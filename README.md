# Smart ITR Guide Chatbot

A modern tax assistant chatbot that helps users with ITR filing, tax calculations, and provides tax-saving recommendations.

## Features

- 🤖 Interactive Tax Assistant Chatbot
- 💰 Tax Calculator with Old and New Regime Support
- 📝 Complete ITR Form Suite (ITR-1 to ITR-7)
- 💡 Comprehensive Tax Saving Guide
- 🌓 Dark/Light Theme Support
- 🔒 Secure Authentication System
- 📱 Responsive Design
- 📊 Tax Analytics Dashboard
- 📥 Chat History with PDF Export

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/downloads)

## Installation & Setup

Open Windows PowerShell and follow these steps:

1. Clone the repository:
```powershell
git clone https://github.com/bhaveshburad729/Smart-ITR-Chatbot.git
cd Smart-ITR-Chatbot
```

2. Set up the backend:
```powershell
cd backend
npm install bcryptjs cors express-validator mongoose express dotenv jsonwebtoken
npm install
```

3. Create a .env file in the backend directory:
```powershell
New-Item .env
```

Add the following content to .env:
```env
MONGODB_URI=Your mongo URL
JWT_SECRET= YOUR JWT SECRET KEY
PORT=5000
```

### Setting up a New MongoDB Cluster

If the provided cluster isn't working, follow these steps to create your own:

1. Create a MongoDB Atlas account:
```powershell
# Visit MongoDB Atlas website
Start-Process "https://www.mongodb.com/cloud/atlas/register"
```

2. Set up a new cluster:
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select your preferred provider & region
   - Click "Create"

3. Configure database access:
   - Go to Security → Database Access
   - Click "Add New Database User"
   - Create username and password
   - Select "Read and write to any database"
   - Click "Add User"

4. Configure network access:
   - Go to Security → Network Access
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. Get your connection string:
   - Go to "Database" under "Deployment"
   - Click "Connect"
   - Choose "Drivers"
   - Copy the connection string

6. Update your .env file:
```env
MONGODB_URI=your_new_connection_string
# Replace <password> with your database user password
```

4. Set up the frontend:
```powershell
cd ..
cd frontend
npm install
```

## Running the Application

1. Start the backend server (in one PowerShell window):
```powershell
cd backend
npm run dev
```

2. Start the frontend development server (in another PowerShell window):
```powershell
cd frontend
npm run dev
```

3. Access the application:
- Open your browser and navigate to `http://localhost:3000`
- You'll be redirected to the sign-in page
- Create a new account or sign in with existing credentials

## Available ITR Forms

The application provides access to all Income Tax Return forms:

- **ITR-1 (Sahaj)**: For individuals with salary/pension income
- **ITR-2**: For individuals with capital gains/foreign income
- **ITR-3**: For individuals with business/professional income
- **ITR-4 (Sugam)**: For presumptive business income
- **ITR-5**: For firms, LLPs, and AOPs
- **ITR-6**: For companies
- **ITR-7**: For charitable trusts, political parties

## Tax Saving Guide

Access comprehensive tax-saving information:
- Section 80C deductions (₹1.5 Lakhs limit)
- Section 80D health insurance benefits
- NPS and pension schemes
- Home loan tax benefits
- Other important deductions

## Features in Detail

### Authentication
- Secure sign-up and sign-in system
- Protected routes for authenticated users
- JWT-based authentication

### Tax Assistant Chatbot
- Interactive chat interface
- Context-aware responses
- Tax-related query handling
- Chat history with PDF download option
- Smart form recommendations

### Tax Calculator
- Support for both old and new tax regimes
- Real-time calculations
- Detailed breakdown of tax components
- Advance tax calculation

### Profile Management
- User profile customization
- Document upload capability
- Tax filing history
- Notification system

## Troubleshooting

If you encounter any issues:

1. Port already in use:
```powershell
# Find process using port
netstat -ano | findstr :5000
# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

2. MongoDB connection issues:
```powershell
# Check MongoDB service status
Get-Service MongoDB
# Start MongoDB service if stopped
Start-Service MongoDB
 
```

3. Node modules issues:
```powershell
# Remove node_modules and reinstall
Remove-Item -Recurse -Force node_modules
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

Made with ❤️ by [Code_Hackers](https://github.com/bhaveshburad729/Smart-ITR-Chatbot.git)
