const calculateTaxSavings = (income) => {
    // Basic tax calculation logic
    return {
        maxSavings: 150000, // 80C limit
        recommendedInvestments: [
            { type: "ELSS", amount: 50000 },
            { type: "PPF", amount: 50000 },
            { type: "Insurance", amount: 50000 }
        ]
    };
};

module.exports = {
    calculateTaxSavings
}; 