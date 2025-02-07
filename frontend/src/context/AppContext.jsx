import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [income, setIncome] = useState(0);
    const [taxSavings, setTaxSavings] = useState(0);
    const [selectedForm, setSelectedForm] = useState('ITR-1');

    const value = {
        income,
        setIncome,
        taxSavings,
        setTaxSavings,
        selectedForm,
        setSelectedForm
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
} 