import React from 'react';

function TaxSavingRecommendations() {
  const recommendations = [
    {
      title: 'Section 80C',
      description: 'Invest in PPF, ELSS, or Life Insurance for tax benefits up to ₹1.5 lakhs',
    },
    {
      title: 'Section 80D',
      description: 'Get deductions up to ₹25,000 on health insurance premiums',
    },
    {
      title: 'NPS Investment',
      description: 'Additional ₹50,000 deduction under Section 80CCD(1B)',
    },
    {
      title: 'Home Loan',
      description: 'Interest deduction up to ₹2 lakhs under Section 24',
    },
  ];

  return (
    <div className="tax-saving">
      <h2>Tax Saving Recommendations</h2>
      <div className="recommendations-list">
        {recommendations.map((rec, index) => (
          <div key={index} className="recommendation-item">
            <h3>{rec.title}</h3>
            <p>{rec.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaxSavingRecommendations; 