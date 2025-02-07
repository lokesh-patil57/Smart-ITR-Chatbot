import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import FormDownload from './components/FormDownload';
import { ThemeToggle } from './components/ThemeToggle';
import TaxSavingRecommendations from './components/TaxSavingRecommendations';
import TaxCalculator from './components/TaxCalculator';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import './styles/main.css';
import './styles/theme.css';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Create a wrapped component to use the theme context
function AppContent() {
  const { darkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`app ${darkMode ? 'dark-theme' : ''}`}>
      <header className="header">
        <div className="header-left">
          <button 
            className="profile-btn"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="profile-icon">👤</span>
            Profile
          </button>
          <h1>Tax Assistant Chatbot</h1>
        </div>
        <ThemeToggle />
      </header>
      <main className="main-content">
        <div className="chat-section">
          <TaxCalculator />
          <ChatInterface />
        </div>
        <div className="side-panel">
          <FormDownload />
          <TaxSavingRecommendations />
        </div>
      </main>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </div>
  );
}

// Main App component
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/signin" />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/tax-assistant"
                element={
                  <ProtectedRoute>
                    <AppContent />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AppProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App; 