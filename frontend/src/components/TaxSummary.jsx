import React from 'react';

const TaxSummary = ({ summary, formData }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="result-section">
            <h3>Tax Calculation Summary</h3>
            
            <div className="result-grid">
                {/* Tax Breakdown */}
                <div className="breakdown-section">
                    <h4>Tax Slab Breakdown</h4>
                    {summary.taxBreakdown.map((item, index) => (
                        <div key={index} className="result-item">
                            <span>{item.description}</span>
                            <span>{item.rate}%</span>
                            <span>{formatCurrency(item.tax)}</span>
                        </div>
                    ))}
                </div>

                {/* Surcharge Details */}
                {summary.surchargeDetails.length > 0 && (
                    <div className="surcharge-section">
                        <h4>Surcharge</h4>
                        {summary.surchargeDetails.map((item, index) => (
                            <div key={index} className="result-item">
                                <span>{item.description}</span>
                                <span>{formatCurrency(item.amount)}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Cess */}
                <div className="cess-section">
                    <div className="result-item">
                        <span>Health and Education Cess @4%</span>
                        <span>{formatCurrency(summary.cess)}</span>
                    </div>
                </div>

                {/* Total Tax */}
                <div className="result-item total">
                    <span>Total Tax Liability</span>
                    <span>{formatCurrency(summary.totalTax)}</span>
                </div>

                {/* ITR Forms */}
                <div className="itr-forms-section">
                    <h4>Applicable ITR Forms</h4>
                    {summary.applicableForms.map((form, index) => (
                        <div key={index} className="itr-form-card">
                            <h5>{form.name}</h5>
                            <ul>
                                {form.eligibility.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaxSummary; 