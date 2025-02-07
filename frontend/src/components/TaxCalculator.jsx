import React, { useState } from 'react';
import '../styles/TaxCalculator.css';

function TaxCalculator() {
    const [formData, setFormData] = useState({
        income: '',
        age: '',
        hasRentalIncome: false,
        hasBusinessIncome: false,
        hasCapitalGains: false
    });
    const [result, setResult] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const calculateTax = () => {
        const income = parseFloat(formData.income);
        if (!income || isNaN(income)) {
            setResult({ error: 'Please enter a valid income amount' });
            return;
        }

        let tax = 0;
        let form = 'ITR-1';
        let surcharge = 0;
        let cess = 0;

        // Basic tax calculation as per 2023-24
        if (income <= 300000) {
            tax = 0;
        } else if (income <= 600000) {
            tax = (income - 300000) * 0.05;
        } else if (income <= 900000) {
            tax = 15000 + (income - 600000) * 0.10;
        } else if (income <= 1200000) {
            tax = 45000 + (income - 900000) * 0.15;
        } else if (income <= 1500000) {
            tax = 90000 + (income - 1200000) * 0.20;
        } else {
            tax = 150000 + (income - 1500000) * 0.30;
        }

        // Surcharge calculation
        if (income > 5000000 && income <= 10000000) {
            surcharge = tax * 0.10;
            form = 'ITR-2';
        } else if (income > 10000000) {
            surcharge = tax * 0.15;
            form = 'ITR-2';
        }

        // Health and Education Cess (4%)
        cess = (tax + surcharge) * 0.04;

        // Total tax
        const totalTax = tax + surcharge + cess;

        // Form determination based on other income sources
        if (formData.hasBusinessIncome) {
            form = 'ITR-3';
        } else if (formData.hasCapitalGains || formData.hasRentalIncome) {
            form = 'ITR-2';
        }

        setResult({
            grossIncome: income,
            basicTax: tax,
            surcharge,
            cess,
            totalTax,
            suggestedForm: form,
            maxSaving: Math.min(totalTax, 150000)
        });
    };

    return (
        <div className="calculator-container">
            <h2>Tax Calculator (FY 2023-24)</h2>
            <div className="calculator-form">
                <div className="input-group">
                    <label>Annual Income (₹)</label>
                    <input
                        type="number"
                        name="income"
                        value={formData.income}
                        onChange={handleInputChange}
                        placeholder="Enter your annual income"
                    />
                </div>

                <div className="input-group">
                    <label>Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="Enter your age"
                    />
                </div>

                <div className="checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="hasRentalIncome"
                            checked={formData.hasRentalIncome}
                            onChange={handleInputChange}
                        />
                        Have Rental Income
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            name="hasBusinessIncome"
                            checked={formData.hasBusinessIncome}
                            onChange={handleInputChange}
                        />
                        Have Business Income
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            name="hasCapitalGains"
                            checked={formData.hasCapitalGains}
                            onChange={handleInputChange}
                        />
                        Have Capital Gains
                    </label>
                </div>

                <button onClick={calculateTax} className="calculate-btn">
                    Calculate Tax
                </button>
            </div>

            {result && !result.error && (
                <div className="result">
                    <h3>Tax Calculation Results</h3>
                    <div className="result-grid">
                        <div className="result-item">
                            <span>Gross Income:</span>
                            <span>₹{result.grossIncome.toLocaleString()}</span>
                        </div>
                        <div className="result-item">
                            <span>Basic Tax:</span>
                            <span>₹{result.basicTax.toLocaleString()}</span>
                        </div>
                        <div className="result-item">
                            <span>Surcharge:</span>
                            <span>₹{result.surcharge.toLocaleString()}</span>
                        </div>
                        <div className="result-item">
                            <span>Health & Education Cess:</span>
                            <span>₹{result.cess.toLocaleString()}</span>
                        </div>
                        <div className="result-item total">
                            <span>Total Tax:</span>
                            <span>₹{result.totalTax.toLocaleString()}</span>
                        </div>
                        <div className="result-item">
                            <span>Suggested Form:</span>
                            <span>{result.suggestedForm}</span>
                        </div>
                        <div className="result-item">
                            <span>Maximum Tax Saving Possible:</span>
                            <span>₹{result.maxSaving.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}

            {result?.error && (
                <div className="error">
                    {result.error}
                </div>
            )}
        </div>
    );
}

export default TaxCalculator; 