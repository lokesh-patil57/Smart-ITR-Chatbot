const taxRules = {
  standardDeduction: 50000,
  section80C: {
    maxLimit: 150000,
    eligibleInvestments: [
      {
        name: 'PPF',
        minLockIn: '15 years',
        riskLevel: 'Low'
      },
      {
        name: 'ELSS',
        minLockIn: '3 years',
        riskLevel: 'High'
      },
      {
        name: 'Life Insurance',
        minLockIn: 'Policy Term',
        riskLevel: 'Low'
      }
    ]
  },
  section80D: {
    selfAndFamily: {
      normal: 25000,
      senior: 50000
    },
    parents: {
      normal: 25000,
      senior: 50000
    }
  },
  section80CCD: {
    additionalNPS: 50000
  },
  homeLoanInterest: {
    maxDeduction: 200000,
    additionalForFirstTime: 150000
  }
};

const getTaxSavingRecommendations = (income, age) => {
  const recommendations = [];
  
  // Basic 80C recommendation
  if (income > 500000) {
    recommendations.push({
      section: '80C',
      amount: Math.min(150000, income * 0.3),
      priority: 'High'
    });
  }

  // Health Insurance recommendation
  const healthInsuranceAmount = income > 1000000 ? 25000 : 15000;
  recommendations.push({
    section: '80D',
    amount: healthInsuranceAmount,
    priority: 'High'
  });

  // NPS recommendation for high income
  if (income > 800000) {
    recommendations.push({
      section: '80CCD',
      amount: 50000,
      priority: 'Medium'
    });
  }

  return recommendations;
};

module.exports = {
  taxRules,
  getTaxSavingRecommendations
}; 