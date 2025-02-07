# Tax Assistant Chatbot
 
A  hiii smart chatbot application that helps users determine the appropriate ITR form and provides tax saving recommendations. The application features a user-friendly interface with dark/light theme support, real-time tax calculations, and downloadable ITR forms.


## Features

- 🤖 Interactive chat interface for tax-related queries
- 📊 Real-time tax calculations
- 📝 ITR form recommendations based on income sources
- 💰 Tax saving suggestions under various sections
- 🌓 Dark/Light theme toggle
- 📄 ITR form downloads
- 🔒 Privacy-focused (no data storage)

## Prerequisites

Before running the project, make sure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Git

## Project Setup

### Clone the Repository
Clone the repository
git clone https://github.com/yourusername/tax-assistant-chatbot.git
Navigate to project directory
cd tax-assistant-chatbot

### Backend Setup

Navigate to backend directory
cd backend
Install dependencies
npm install
Create .env file
New-Item .env

Add the following to your `.env` file:
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

Start the backend server
npm start
For development with auto-reload
npm run dev


The backend server will start running on http://localhost:5000

### Frontend Setup

Open a new PowerShell window:

Navigate to frontend directory
cd frontend
Install dependencies
npm install 
Create .env file
New-Item .env

Add the following to your `.env` file:
VITE_API_URL=http://localhost:5000

Start the frontend development server
npm start


The application will open automatically in your default browser at http://localhost:3000

## Project Structure

ITR Chatbot/
├── frontend/
│ ├── public/
│ │ ├── index.html
│ │ └── assets/
│ │ └── forms/
│ ├── src/
│ │ ├── components/
│ │ ├── context/
│ │ ├── hooks/
│ │ ├── utils/
│ │ ├── styles/
│ │ ├── App.jsx
│ │ └── index.js
│ └── package.json
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ ├── middleware/
│ ├── server.js
│ └── package.json
└── README.md


## Available Scripts

### Backend

Run in development mode
npm run dev
Run in production mode
npm start


### Frontend

Start development server
npm start
Build for production
npm run build
Run tests
npm test

## Troubleshooting

1. If you get a port already in use error:

Find process using port 5000
netstat -ano | findstr :5000
Kill the process (replace PID with the actual process ID)
taskkill /PID <PID> /F

2. If npm install fails:

Clear npm cache
npm cache clean --force
Try installing again
npm install


3. If the frontend can't connect to the backend:
- Verify both servers are running
- Check the REACT_APP_API_URL in frontend .env file
- Ensure CORS_ORIGIN in backend .env matches frontend URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Contact

Your Name - your.email@example.com
Project Link: https://github.com/yourusername/tax-assistant-chatbot

## How to Use the Chatbot

1. **Start a Conversation**
   - Open the application in your browser
   - Type "Hello" or "Hi" to begin the conversation

2. **Provide Your Income Details**
   The chatbot will ask about your income sources. Be ready with information about:
   - Salary income
   - Business/Professional income
   - Rental income
   - Capital gains
   - Other sources of income

3. **ITR Form Recommendations**
   Based on your inputs, the chatbot will recommend the appropriate ITR form:

   - **ITR-1 (Sahaj)**: For individuals with:
     - Salary income
     - One house property
     - Interest income
     - Total income up to ₹50 lakhs

   - **ITR-2**: For individuals with:
     - Salary income
     - Capital gains
     - More than one house property
     - Foreign income/assets

   - **ITR-3**: For individuals with:
     - Business/Professional income
     - Salary and other sources

   - **ITR-4 (Sugam)**: For individuals with:
     - Presumptive business income
     - Professional income under section 44ADA

4. **Additional Features**
   - Get tax saving suggestions
   - Download the recommended ITR form
   - Calculate estimated tax liability

## Example Conversation

User: "Hi"
Bot: "Hello! I can help you determine which ITR form is suitable for you. Could you tell me about your sources of income?"

User: "I have salary income and rental income from one house property"
Bot: "Could you specify your total annual income?"

User: "My salary is 8 lakhs and rental income is 2 lakhs"
Bot: "Based on your income sources and total income of ₹10 lakhs, ITR-1 (Sahaj) would be the appropriate form for you..."

## Privacy Note
- The chatbot doesn't store any personal information
- All calculations are done in real-time
- No data is saved after the session ends