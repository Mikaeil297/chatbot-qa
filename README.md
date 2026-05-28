# Chatbot QA Project

A simple and interactive web-based chatbot that responds to user queries using a Q&A database.

## Overview

This project provides a chatbot application with an HTML interface that allows users to chat with an AI assistant. The chatbot retrieves answers from a text file containing predefined questions and answers.

## Features

- **Interactive Chat Interface**: User-friendly chatbot UI
- **Real-time Responses**: Instant replies to user queries
- **Fuzzy Matching**: Finds similar questions even if not exact matches
- **Responsive Design**: Works on desktop and mobile devices
- **Simple Architecture**: Easy to understand and modify

## Project Structure

```
chatbot-qa/
├── index.html      # Main HTML file with chat interface
├── style.css       # Styling for the chatbot
├── script.js       # JavaScript logic for chatbot functionality
├── qa.txt          # Question-Answer database
└── README.md       # Project documentation
```

## Files Description

### index.html
- Contains the structure of the web application
- Includes the chat display area
- Input field for user messages
- Send button for submitting queries

### style.css
- Styles the chatbot interface
- Responsive design for different screen sizes
- Clean and modern appearance
- Chat message styling (user vs bot)

### script.js
- Loads and parses the Q&A data from `qa.txt`
- Implements message handling logic
- Performs fuzzy matching to find relevant answers
- Updates the chat display dynamically

### qa.txt
- Contains 1000+ pairs of questions and answers
- Format: `question:answer`
- Each pair on a new line
- Covers various topics (greeting, science, technology, etc.)

## How It Works

1. **Load Q&A Data**: JavaScript reads the `qa.txt` file when the page loads
2. **Parse Questions**: Extracts and formats all question-answer pairs
3. **Process User Input**: When user sends a message:
   - Normalizes the input (lowercase, trim spaces)
   - Searches for matching questions using fuzzy matching
   - Returns the best matching answer
4. **Display Messages**: Shows both user input and bot response in chat

## Usage

1. Open `index.html` in a web browser
2. Type your question in the input field
3. Press Enter or click the Send button
4. The chatbot will respond with an answer from the database
5. Continue chatting!

## Fuzzy Matching Algorithm

The chatbot uses a simple fuzzy matching system:
- Converts both user input and questions to lowercase
- Checks for keyword similarity
- Returns the question with the highest match score
- If no match found, returns a default message

## Customization

### Adding More Q&A Pairs
Edit `qa.txt` and add new pairs in the format:
```
your question:your answer
```

### Changing Styles
Modify `style.css` to customize colors, fonts, and layout

### Adjusting Matching Sensitivity
Edit the threshold value in `script.js` to make matching more or less strict

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser supporting ES6 JavaScript

## Limitations

- Works offline with local Q&A file
- No machine learning or NLP
- Simple keyword-based matching
- Limited to predefined Q&A pairs

## Future Enhancements

- [ ] Add database backend (Node.js, MongoDB)
- [ ] Implement advanced NLP
- [ ] Add user authentication
- [ ] Store conversation history
- [ ] Add voice input/output
- [ ] Multi-language support
- [ ] Admin panel for managing Q&A

## Getting Started

1. Clone or download this repository
2. Ensure all files are in the same directory
3. Open `index.html` in your browser
4. Start chatting!

## License

This project is open source and available under the MIT License.

## Author

Created by Mikaeil297

## Support

For issues, questions, or suggestions, please contact the project maintainer.

---

Enjoy chatting with the bot! 🤖
