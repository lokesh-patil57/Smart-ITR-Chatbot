import React, { useState } from 'react';
import TaxSummary from './TaxSummary';
import { calculateTaxDetails } from '../utils/taxCalculator';
import '../styles/TaxCalculator.css';

const TaxCalculator = () => {
    const [formData, setFormData] = useState({
        assessmentYear: '2024-25',
        taxpayerType: '',
        taxRegime: 'new',
        ageCategory: '',
        residentialStatus: '',
        netIncome: ''
    });

    const [taxSummary, setTaxSummary] = useState(null);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'netIncome') {
            // Format number in Indian style and validate
            const numValue = value.replace(/[^\d]/g, '');
            if (numValue > 999999999999) { // Limit to 9999,99,99,999
                setError('Income cannot exceed ₹9999,99,99,999');
                return;
            }
            const formattedValue = new Intl.NumberFormat('en-IN').format(numValue);
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
            setError('');
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const income = parseFloat(formData.netIncome.replace(/,/g, ''));
            const result = calculateTaxDetails(income, formData);
            setTaxSummary(result);
            setError('');
        } catch (err) {
            setError('Error calculating tax. Please check your inputs.');
        }
    };

    const regimeOptions = [
        {
            value: 'new',
            title: 'New Tax Regime (Section 115BAC)',
            subtitle: 'For FY 2024-25',
            features: [
                'No tax up to ₹3 lakh',
                'Lower tax rates for higher slabs',
                'No need for investment proof',
                'No major deductions available',
                'Simplified tax structure'
            ],
            rates: [
                '0% up to ₹3 lakh',
                '5% from ₹3-6 lakh',
                '10% from ₹6-9 lakh',
                '15% from ₹9-12 lakh',
                '20% from ₹12-15 lakh',
                '30% above ₹15 lakh'
            ]
        },
        {
            value: 'old',
            title: 'Old Tax Regime (Regular)',
            subtitle: 'With Tax Benefits',
            features: [
                'Standard deduction of ₹50,000',
                'Section 80C deduction up to ₹1.5 lakh',
                'HRA and other allowances exempt',
                'Medical insurance premium deduction',
                'Home loan benefits available'
            ],
            rates: [
                '0% up to ₹2.5 lakh',
                '5% from ₹2.5-5 lakh',
                '20% from ₹5-10 lakh',
                '30% above ₹10 lakh'
            ]
        }
    ];

    return (
        <div className="tax-calculator">
            <div className="calculator-header">
                <h1>Income Tax Calculator 2024-25</h1>
                <p className="subtitle">Calculate your income tax liability as per latest tax rules</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="tax-form">
                {/* Assessment Year Section */}
                <div className="form-section">
                    <h3>Basic Details</h3>
                    <div className="form-group">
                        <label>Assessment Year</label>
                        <select 
                            name="assessmentYear" 
                            value={formData.assessmentYear}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="2024-25">2024-25</option>
                            <option value="2023-24">2023-24</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Tax Payer Category</label>
                        <select 
                            name="taxpayerType"
                            value={formData.taxpayerType}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Tax Payer Type</option>
                            <option value="individual">Individual</option>
                            <option value="huf">HUF</option>
                            <option value="aop">AOP/BOI</option>
                            <option value="firm">Partnership Firm</option>
                        </select>
                    </div>
                </div>

                {/* Tax Regime Section */}
                <div className="form-section regime-section">
                    <h3>Tax Regime Selection</h3>
                    <div className="form-group">
                        <label>Select Tax Regime</label>
                        <div className="regime-dropdown">
                            <select
                                name="taxRegime"
                                value={formData.taxRegime}
                                onChange={handleInputChange}
                                className="regime-select"
                            >
                                {regimeOptions.map(regime => (
                                    <option key={regime.value} value={regime.value}>
                                        {regime.title}
                                    </option>
                                ))}
                            </select>
                            
                            <div className="regime-details">
                                {regimeOptions.find(r => r.value === formData.taxRegime) && (
                                    <div className="regime-info-card">
                                        <div className="regime-header">
                                            <h4>{regimeOptions.find(r => r.value === formData.taxRegime).title}</h4>
                                            <span className="regime-badge">
                                                {regimeOptions.find(r => r.value === formData.taxRegime).subtitle}
                                            </span>
                                        </div>
                                        
                                        <div className="regime-content">
                                            <div className="regime-features-section">
                                                <h5>Key Features</h5>
                                                <ul className="regime-features">
                                                    {regimeOptions
                                                        .find(r => r.value === formData.taxRegime)
                                                        .features.map((feature, index) => (
                                                            <li key={index}>{feature}</li>
                                                        ))}
                                                </ul>
                                            </div>
                                            
                                            <div className="regime-rates-section">
                                                <h5>Tax Rates</h5>
                                                <ul className="regime-rates">
                                                    {regimeOptions
                                                        .find(r => r.value === formData.taxRegime)
                                                        .rates.map((rate, index) => (
                                                            <li key={index}>{rate}</li>
                                                        ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Details Section */}
                <div className="form-section">
                    <h3>Personal Details</h3>
                    <div className="form-group">
                        <label>Age Category</label>
                        <select
                            name="ageCategory"
                            value={formData.ageCategory}
                            onChange={handleInputChange}
                            required
                            disabled={formData.taxpayerType !== 'individual'}
                        >
                            <option value="">Select Age Category</option>
                            <option value="general">Below 60 years</option>
                            <option value="senior">Senior Citizen (60-80 years)</option>
                            <option value="super-senior">Super Senior Citizen (Above 80 years)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Residential Status</label>
                        <select
                            name="residentialStatus"
                            value={formData.residentialStatus}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Residential Status</option>
                            <option value="resident">Resident Indian</option>
                            <option value="nri">Non-Resident Indian</option>
                            <option value="rnor">Resident but Not Ordinarily Resident</option>
                        </select>
                    </div>
                </div>

                {/* Income Details Section */}
                <div className="form-section">
                    <h3>Income Details</h3>
                    <div className="form-group">
                        <label>Net Taxable Income (₹)</label>
                        <div className="income-input-wrapper">
                            <input
                                type="text"
                                name="netIncome"
                                value={formData.netIncome}
                                onChange={handleInputChange}
                                placeholder="Enter your total taxable income"
                                required
                            />
                            <div className="income-indicator" 
                                 style={{
                                     width: `${Math.min((parseFloat(formData.netIncome.replace(/,/g, '')) || 0) / 999999999999 * 100, 100)}%`
                                 }}
                            />
                        </div>
                        <small className="help-text">Enter total income after all applicable deductions</small>
                    </div>
                </div>

                <button type="submit" className="calculate-btn">
                    Calculate Tax
                </button>
            </form>

            {taxSummary && <TaxSummary summary={taxSummary} formData={formData} />}
        </div>
    );
};

export default TaxCalculator; 