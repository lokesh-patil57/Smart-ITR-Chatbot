export const validateInput = (input) => {
  const errors = [];

  if (!input.trim()) {
    errors.push('Input cannot be empty');
  }

  if (input.length > 500) {
    errors.push('Input exceeds maximum length of 500 characters');
  }

  // Check for potential harmful inputs
  const harmfulPatterns = [
    /<script/i,
    /javascript:/i,
    /data:/i,
    /vbscript:/i
  ];

  if (harmfulPatterns.some(pattern => pattern.test(input))) {
    errors.push('Invalid input detected');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateIncome = (income) => {
  const errors = [];

  if (isNaN(income) || income < 0) {
    errors.push('Please enter a valid income amount');
  }

  if (income > 1000000000) { // 100 crores
    errors.push('Income amount seems unusually high');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 