// ==================== CHATBOT MAIN SCRIPT ====================

class ChatBot {
    constructor() {
        this.qaDatabase = {};
        this.chatMessages = document.getElementById('chatMessages');
        this.chatForm = document.getElementById('chatForm');
        this.userInput = document.getElementById('userInput');
        this.isLoading = false;
        
        this.init();
    }

    /**
     * Initialize the chatbot
     */
    async init() {
        await this.loadQAData();
        this.setupEventListeners();
    }

    /**
     * Load Q&A data from the text file
     */
    async loadQAData() {
        try {
            const response = await fetch('qa.txt');
            if (!response.ok) {
                throw new Error('Failed to load Q&A database');
            }
            const text = await response.text();
            this.parseQAData(text);
            console.log(`Loaded ${Object.keys(this.qaDatabase).length} Q&A pairs`);
        } catch (error) {
            console.error('Error loading Q&A data:', error);
            this.addBotMessage(
                'Sorry, I encountered an error loading my database. Please refresh the page.'
            );
        }
    }

    /**
     * Parse Q&A data from text format
     * Format: question:answer
     */
    parseQAData(text) {
        const lines = text.split('\n');
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            
            if (trimmedLine && trimmedLine.includes(':')) {
                const [question, answer] = trimmedLine.split(':').map(str => str.trim());
                
                if (question && answer) {
                    // Store with lowercase question as key for matching
                    const normalizedQuestion = this.normalizeText(question);
                    this.qaDatabase[normalizedQuestion] = answer;
                }
            }
        });
    }

    /**
     * Normalize text for comparison
     */
    normalizeText(text) {
        return text.toLowerCase().trim();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUserInput();
        });

        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserInput();
            }
        });
    }

    /**
     * Handle user input
     */
    async handleUserInput() {
        const message = this.userInput.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addUserMessage(message);
        this.userInput.value = '';
        this.userInput.focus();

        // Simulate typing delay
        this.isLoading = true;
        this.showTypingIndicator();

        // Wait a bit before showing response
        await this.delay(1000);

        // Get bot response
        const response = this.findAnswer(message);
        
        // Remove typing indicator and add bot response
        this.removeTypingIndicator();
        this.addBotMessage(response);
        
        this.isLoading = false;
    }

    /**
     * Find answer for user query using fuzzy matching
     */
    findAnswer(userQuery) {
        const normalizedQuery = this.normalizeText(userQuery);
        
        // Exact match
        if (this.qaDatabase[normalizedQuery]) {
            return this.qaDatabase[normalizedQuery];
        }

        // Fuzzy matching - find best match
        let bestMatch = null;
        let bestScore = 0;
        const threshold = 0.3; // Minimum similarity score

        for (const question in this.qaDatabase) {
            const score = this.calculateSimilarity(normalizedQuery, question);
            
            if (score > bestScore && score >= threshold) {
                bestScore = score;
                bestMatch = question;
            }
        }

        if (bestMatch) {
            return this.qaDatabase[bestMatch];
        }

        // Default response
        return this.getDefaultResponse(userQuery);
    }

    /**
     * Calculate similarity between two strings
     * Using Levenshtein distance with word matching
     */
    calculateSimilarity(str1, str2) {
        const words1 = str1.split(/\s+/).filter(w => w.length > 0);
        const words2 = str2.split(/\s+/).filter(w => w.length > 0);

        // Count matching words
        let matchingWords = 0;
        
        for (const word1 of words1) {
            for (const word2 of words2) {
                if (word1 === word2 || this.stringSimilarity(word1, word2) > 0.8) {
                    matchingWords++;
                    break;
                }
            }
        }

        // Calculate similarity score
        const maxWords = Math.max(words1.length, words2.length);
        const similarity = matchingWords / maxWords;

        // Also consider substring matching
        if (str2.includes(str1) || str1.includes(str2)) {
            return Math.max(similarity, 0.9);
        }

        return similarity;
    }

    /**
     * Calculate string similarity using simple algorithm
     */
    stringSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;

        if (longer.length === 0) return 1.0;

        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }

    /**
     * Calculate Levenshtein distance between two strings
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }

    /**
     * Get default response when no match found
     */
    getDefaultResponse(userQuery) {
        const responses = [
            `I'm not sure about "${userQuery}". Could you rephrase your question?`,
            `That's an interesting question! I don't have a specific answer for that yet. Try asking something else!`,
            `I didn't quite understand that. Could you ask differently?`,
            `Hmm, I don't have information about that. Try another question!`,
            `I'm still learning! That question is beyond my current knowledge. Ask me something else!`
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * Add user message to chat
     */
    addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const textP = document.createElement('p');
        textP.textContent = message;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = this.getCurrentTime();

        contentDiv.appendChild(textP);
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeSpan);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Add bot message to chat
     */
    addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const textP = document.createElement('p');
        textP.textContent = message;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = this.getCurrentTime();

        contentDiv.appendChild(textP);
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeSpan);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.id = 'typing-indicator';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const indicatorDiv = document.createElement('div');
        indicatorDiv.className = 'typing-indicator';

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dot.className = 'typing-dot';
            indicatorDiv.appendChild(dot);
        }

        contentDiv.appendChild(indicatorDiv);
        messageDiv.appendChild(contentDiv);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Remove typing indicator
     */
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    /**
     * Scroll chat to bottom
     */
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 0);
    }

    /**
     * Get current time in HH:MM format
     */
    getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    /**
     * Delay function for async operations
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ==================== INITIALIZE CHATBOT ====================

document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});
