# Smart ITR Guide Chatbot

A modern tax assistant chatbot that helps users with ITR filing, tax calculations, and provides tax-saving recommendations.

## Features

- 🤖 Interactive Tax Assistant Chatbot
- 💰 Tax Calculator with Old and New Regime Support
- 📝 ITR Form Downloads
- 💡 Tax Saving Recommendations
- 🌓 Dark/Light Theme Support
- 🔒 Secure Authentication System
- 📱 Responsive Design

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/downloads)

## Installation & Setup

Open Windows PowerShell and follow these steps:

1. Clone the repository:
```
git clone https://github.com/yourusername/Smart-ITR-Chatbot.git
cd Smart-ITR-Chatbot
```

2. Set up the backend:
```
cd backend
npm install
```

3. Create a .env file in the backend directory:
```
New-Item .env
```

Add the following content to .env:
```
MONGODB_URI=mongodb+srv://lucky577:Lok22rk+@cluster0.8effy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=myTaxAssistant2024SecureKey!@#$
PORT=5000
```

4. Set up the frontend:
```
cd ..
cd frontend
npm install
```

## Running the Application

1. Start the backend server (in one PowerShell window):
```
cd backend
npm run dev
```

2. Start the frontend development server (in another PowerShell window):
```
cd frontend
npm run dev
```

3. Access the application:
- Open your browser and navigate to `http://localhost:3000`
- You'll be redirected to the sign-in page
- Create a new account or sign in with existing credentials

## Project Structure

```
Smart-ITR-Chatbot/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── styles/
    │   ├── hooks/
    │   └── App.jsx
    └── package.json
```

## Features in Detail

### Authentication
- Secure sign-up and sign-in system
- Protected routes for authenticated users
- JWT-based authentication

### Tax Assistant Chatbot
- Interactive chat interface
- Context-aware responses
- Tax-related query handling
- Chat history with download option

### Tax Calculator
- Support for both old and new tax regimes
- Real-time calculations
- Detailed breakdown of tax components

### ITR Forms
- Easy download of various ITR forms
- Form selection guidance
- PDF format support

### Tax Saving Recommendations
- Personalized suggestions
- Investment options
- Deduction opportunities

## Troubleshooting

If you encounter any issues:

1. Port already in use:
```
# Find process using port
netstat -ano | findstr :5000
# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

2. MongoDB connection issues:
- Verify MongoDB is running
- Check MongoDB connection string in .env
- Ensure network connectivity

3. Node modules issues:
```
# Remove node_modules and reinstall
rm -r node_modules
npm install
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

Made with ❤️ by [Code_Hackers](https://github.com/lucky577)
