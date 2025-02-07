import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/ThemeToggle.css';

export function ThemeToggle() {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
        >
            {darkMode ? '☀️' : '🌙'}
        </button>
    );
} 