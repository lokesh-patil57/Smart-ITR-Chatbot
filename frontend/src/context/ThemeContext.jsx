import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
        // Get saved theme from localStorage or default to false
        const savedTheme = localStorage.getItem('darkMode');
        return savedTheme ? JSON.parse(savedTheme) : false;
    });

    useEffect(() => {
        // Save theme preference to localStorage
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        // Apply theme to body
        document.body.classList.toggle('dark-theme', darkMode);
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
} 