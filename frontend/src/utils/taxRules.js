export const taxRules = {
  itrForms: {
    ITR1: {
      eligibility: [
        'Salary/Pension Income',
        'One House Property',
        'Income from Other Sources',
        'Total Income up to ₹50 lakhs'
      ],
      notEligible: [
        'Multiple House Properties',
        'Capital Gains',
        'Business Income',
        'Foreign Income'
      ]
    },
    ITR2: {
      eligibility: [
        'Salary Income',
        'Capital Gains',
        'Multiple House Properties',
        'Foreign Income',
        'Income from Other Sources'
      ],
      notEligible: [
        'Business Income',
        'Professional Income'
      ]
    },
    ITR3: {
      eligibility: [
        'Business Income',
        'Professional Income',
        'All types of Income applicable to ITR1 and ITR2'
      ]
    }
  },
  
  taxSavings: {
    section80C: {
      limit: 150000,
      options: [
        'PPF',
        'ELSS',
        'Life Insurance Premium',
        'NSC',
        'Tax Saving FD',
        'Home Loan Principal'
      ]
    },
    section80D: {
      limit: {
        self: 25000,
        parents: 25000,
        seniorCitizen: 50000
      }
    },
    section80CCD: {
      limit: 50000,
      description: 'Additional NPS contribution'
    }
  }
};

export const determineSuitableITR = (incomeDetails) => {
  if (
    incomeDetails.totalIncome <= 5000000 &&
    !incomeDetails.hasBusinessIncome &&
    !incomeDetails.hasCapitalGains &&
    !incomeDetails.hasForeignIncome &&
    incomeDetails.houseProperties <= 1
  ) {
    return 'ITR1';
  } else if (!incomeDetails.hasBusinessIncome) {
    return 'ITR2';
  }
  return 'ITR3';
}; 