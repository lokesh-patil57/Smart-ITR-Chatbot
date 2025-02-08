import React from 'react';
import './styles.css';

const TaxSavingGuide = () => {
  const taxSavingMethods = [
    {
      section: "Section 80C (Maximum Deduction: ₹1.5 Lakhs)",
      methods: [
        {
          title: "Employee Provident Fund (EPF)",
          description: "Mandatory contribution of 12% of basic salary by both employer and employee. Offers interest rates of around 8.15% annually.",
          benefits: "Tax-free interest earnings and maturity amount"
        },
        {
          title: "Public Provident Fund (PPF)",
          description: "Government-backed savings scheme with a 15-year lock-in period. Current interest rate: 7.1% p.a., compounded annually.",
          benefits: "Complete tax exemption on investment, interest, and maturity"
        },
        {
          title: "Equity-Linked Savings Scheme (ELSS)",
          description: "Mutual funds with a 3-year lock-in period investing primarily in equity markets.",
          benefits: "Potential for high returns, shortest lock-in period among 80C investments"
        },
        {
          title: "National Savings Certificate (NSC)",
          description: "5-year government savings bond offering guaranteed returns (Current rate: 7% p.a.).",
          benefits: "Guaranteed returns, can be used as collateral for loans"
        }
      ]
    },
    {
      section: "Section 80D (Health Insurance)",
      methods: [
        {
          title: "Health Insurance Premium",
          description: "Deduction for health insurance premiums paid for self, family, and parents",
          limits: [
            "Self & Family: Up to ₹25,000",
            "Parents below 60 years: Up to ₹25,000",
            "Senior citizen parents: Up to ₹50,000"
          ]
        }
      ]
    },
    {
      section: "Section 80CCD (National Pension System)",
      methods: [
        {
          title: "NPS Investment",
          description: "Additional deduction of up to ₹50,000 under Section 80CCD(1B)",
          benefits: "Market-linked returns, professional fund management, retirement focused"
        }
      ]
    },
    {
      section: "Home Loan Benefits",
      methods: [
        {
          title: "Home Loan Principal Repayment",
          description: "Covered under Section 80C limit of ₹1.5 Lakhs",
          benefits: "Part of diversified tax saving portfolio"
        },
        {
          title: "Home Loan Interest",
          description: "Deduction under Section 24(b) up to ₹2 Lakhs for self-occupied property",
          benefits: "Additional benefit beyond 80C limit"
        }
      ]
    },
    {
      section: "Other Important Deductions",
      methods: [
        {
          title: "Section 80G (Donations)",
          description: "Deductions for donations to approved charitable institutions",
          benefits: "50-100% deduction depending on the institution"
        },
        {
          title: "Section 80E (Education Loan)",
          description: "Deduction for interest paid on education loan",
          benefits: "No upper limit on interest deduction"
        },
        {
          title: "Section 80TTA",
          description: "Deduction on savings account interest up to ₹10,000",
          benefits: "Applicable to all taxpayers"
        }
      ]
    }
  ];

  return (
    <div className="tax-saving-guide">
      <h1>Comprehensive Tax Saving Guide</h1>
      <p className="guide-intro">
        Optimize your tax savings with these government-approved investment and deduction options.
        Understanding these methods can help you reduce your taxable income legally and effectively.
      </p>
      
      {taxSavingMethods.map((category, index) => (
        <div key={index} className="category-section">
          <h2>{category.section}</h2>
          <div className="methods-grid">
            {category.methods.map((method, methodIndex) => (
              <div key={methodIndex} className="method-card">
                <h3>{method.title}</h3>
                <p className="description">{method.description}</p>
                {method.benefits && (
                  <div className="benefits">
                    <h4>Benefits:</h4>
                    <p>{method.benefits}</p>
                  </div>
                )}
                {method.limits && (
                  <div className="limits">
                    <h4>Limits:</h4>
                    <ul>
                      {method.limits.map((limit, limitIndex) => (
                        <li key={limitIndex}>{limit}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaxSavingGuide; 