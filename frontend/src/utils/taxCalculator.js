import { TAX_SLABS } from '../constants/taxConstants';

// Add these additional tax rules and constants
const DEDUCTION_LIMITS = {
    '80C': 150000,      // PPF, ELSS, LIC, etc.
    '80D': {
        self: {
            normal: 25000,
            senior: 50000
        },
        parents: {
            normal: 25000,
            senior: 50000
        }
    },
    '80TTA': 10000,     // Savings account interest
    '80TTB': 50000,     // Senior citizens' bank interest
    'HRA': {
        metro: 0.5,     // 50% of basic for metro cities
        other: 0.4      // 40% of basic for non-metro cities
    },
    'StandardDeduction': 50000
};

// Add these additional tax-related constants
const ADDITIONAL_DEDUCTIONS = {
    '80CCD': {
        NPS_EMPLOYEE: 0.1,      // 10% of salary
        NPS_EMPLOYER: 0.1,      // 10% of salary
        ADDITIONAL: 50000       // Additional NPS deduction
    },
    '80E': Infinity,           // Education loan interest
    '80EE': 50000,            // First time home buyers
    '80EEA': 150000,          // Electric vehicle loan interest
    '80G': {
        FULL: 1.0,            // 100% deduction
        HALF: 0.5             // 50% deduction
    },
    '80GG': {
        MAX: 60000,           // Per annum
        RATE: 0.25            // 25% of total income
    }
};

// Enhanced tax calculation with deductions
export const calculateTaxDetails = (income, formData) => {
    const { 
        taxRegime, 
        ageCategory, 
        taxpayerType, 
        residentialStatus,
        deductions = {} 
    } = formData;

    let taxableIncome = income;
    let deductionBreakdown = [];

    // Apply deductions only for old regime
    if (taxRegime === 'old') {
        const { totalDeductions, breakdown } = calculateDeductions(income, formData);
        taxableIncome -= totalDeductions;
        deductionBreakdown = breakdown;
    }

    // Calculate base tax
    const baseTax = calculateBaseTax(taxableIncome, taxRegime, ageCategory, taxpayerType);

    // Apply 87A rebate
    let rebate = calculateRebate(taxableIncome, baseTax.tax, formData);
    
    // Calculate surcharge with marginal relief
    const { surcharge, surchargeDetails, marginalRelief } = 
        calculateSurchargeWithRelief(baseTax.tax, income, taxpayerType);

    // Calculate cess
    const cess = Math.round((baseTax.tax + surcharge) * 0.04);

    // Calculate advance tax requirements
    const advanceTaxSchedule = calculateAdvanceTax(baseTax.tax + surcharge + cess);

    return {
        grossIncome: income,
        deductions: deductionBreakdown,
        taxableIncome,
        taxBreakdown: baseTax.breakdown,
        surchargeDetails,
        marginalRelief,
        rebate,
        cess,
        totalTax: baseTax.tax + surcharge + cess,
        advanceTaxSchedule,
        applicableForms: determineITRForms(formData, income)
    };
};

const calculateDeductions = (income, formData) => {
    const { ageCategory, deductions = {} } = formData;
    let totalDeductions = 0;
    let breakdown = [];

    // Standard Deduction
    if (deductions.salary) {
        const standardDeduction = Math.min(DEDUCTION_LIMITS.StandardDeduction, deductions.salary);
        totalDeductions += standardDeduction;
        breakdown.push({
            section: 'Standard Deduction',
            amount: standardDeduction,
            description: 'Fixed deduction for salaried individuals'
        });
    }

    // Section 80C
    if (deductions['80C']) {
        const limit80C = Math.min(deductions['80C'], DEDUCTION_LIMITS['80C']);
        totalDeductions += limit80C;
        breakdown.push({
            section: '80C',
            amount: limit80C,
            description: 'Life Insurance, PPF, ELSS, etc.'
        });
    }

    // Section 80D (Medical Insurance)
    if (deductions['80D']) {
        const limit80D = calculateMedicalInsuranceDeduction(deductions['80D'], ageCategory);
        totalDeductions += limit80D.total;
        breakdown.push(...limit80D.breakdown);
    }

    // House Rent Allowance
    if (deductions.hra) {
        const hraExemption = calculateHRAExemption(deductions.hra);
        totalDeductions += hraExemption.amount;
        breakdown.push({
            section: 'HRA Exemption',
            amount: hraExemption.amount,
            description: hraExemption.description
        });
    }

    return { totalDeductions, breakdown };
};

const calculateAdvanceTax = (totalTax) => {
    if (totalTax < 10000) return null;

    return [
        {
            dueDate: 'September 15, 2024',
            percentage: 30,
            amount: Math.round(totalTax * 0.30)
        },
        {
            dueDate: 'December 15, 2024',
            percentage: 60,
            amount: Math.round(totalTax * 0.60)
        },
        {
            dueDate: 'March 15, 2025',
            percentage: 100,
            amount: totalTax
        }
    ];
};

const calculateBaseTax = (income, regime, ageCategory, taxpayerType) => {
    let slabs;
    
    if (regime === 'new') {
        // New Tax Regime slabs (FY 2024-25)
        slabs = [
            { limit: 300000, rate: 0 },
            { limit: 600000, rate: 5 },
            { limit: 900000, rate: 10 },
            { limit: 1200000, rate: 15 },
            { limit: 1500000, rate: 20 },
            { limit: Infinity, rate: 30 }
        ];
    } else {
        // Old Tax Regime slabs based on age category
        switch(ageCategory) {
            case 'super-senior': // Above 80 years
                slabs = [
                    { limit: 500000, rate: 0 },
                    { limit: 1000000, rate: 20 },
                    { limit: Infinity, rate: 30 }
                ];
                break;
            case 'senior': // 60-80 years
                slabs = [
                    { limit: 300000, rate: 0 },
                    { limit: 500000, rate: 5 },
                    { limit: 1000000, rate: 20 },
                    { limit: Infinity, rate: 30 }
                ];
                break;
            default: // Below 60 years
                slabs = [
                    { limit: 250000, rate: 0 },
                    { limit: 500000, rate: 5 },
                    { limit: 1000000, rate: 20 },
                    { limit: Infinity, rate: 30 }
                ];
        }
    }

    return calculateTaxBySlabs(income, slabs);
};

const calculateSurcharge = (tax, income, taxpayerType) => {
    let surcharge = 0;
    let surchargeDetails = [];
    
    if (taxpayerType === 'individual' || taxpayerType === 'huf') {
        // Surcharge rates for individuals/HUF
        if (income > 50000000) { // Above 5 crore
            surcharge = Math.round(tax * 0.37);
            surchargeDetails.push({ 
                description: 'Surcharge @37%', 
                amount: surcharge 
            });
        } else if (income > 20000000) { // Above 2 crore
            surcharge = Math.round(tax * 0.25);
            surchargeDetails.push({ 
                description: 'Surcharge @25%', 
                amount: surcharge 
            });
        } else if (income > 10000000) { // Above 1 crore
            surcharge = Math.round(tax * 0.15);
            surchargeDetails.push({ 
                description: 'Surcharge @15%', 
                amount: surcharge 
            });
        } else if (income > 5000000) { // Above 50 lakhs
            surcharge = Math.round(tax * 0.10);
            surchargeDetails.push({ 
                description: 'Surcharge @10%', 
                amount: surcharge 
            });
        }
    } else if (taxpayerType === 'domestic-company') {
        // Surcharge for domestic companies
        if (income > 100000000) { // Above 10 crore
            surcharge = Math.round(tax * 0.12);
            surchargeDetails.push({ 
                description: 'Surcharge @12%', 
                amount: surcharge 
            });
        } else if (income > 10000000) { // Above 1 crore
            surcharge = Math.round(tax * 0.07);
            surchargeDetails.push({ 
                description: 'Surcharge @7%', 
                amount: surcharge 
            });
        }
    }

    return { surcharge, surchargeDetails };
};

const calculateTaxBySlabs = (income, slabs) => {
    let remainingIncome = income;
    let totalTax = 0;
    let breakdown = [];
    let previousLimit = 0;

    for (const slab of slabs) {
        if (remainingIncome <= 0) break;

        const taxableInThisSlab = Math.min(remainingIncome, slab.limit - previousLimit);
        const taxInSlab = Math.round((taxableInThisSlab * slab.rate) / 100);

        if (taxInSlab > 0) {
            breakdown.push({
                description: `${previousLimit + 1} to ${slab.limit === Infinity ? 'above' : slab.limit}`,
                rate: slab.rate,
                amount: taxableInThisSlab,
                tax: taxInSlab
            });
        }

        totalTax += taxInSlab;
        remainingIncome -= taxableInThisSlab;
        previousLimit = slab.limit;
    }

    return { tax: totalTax, breakdown };
};

const determineITRForms = (formData, income) => {
    const { taxpayerType, residentialStatus } = formData;
    let forms = [];

    // ITR-1 SAHAJ
    if (taxpayerType === 'individual' && 
        income <= 5000000 && 
        residentialStatus === 'resident') {
        forms.push({
            name: 'ITR-1 SAHAJ',
            eligibility: [
                'For individuals having income from:',
                '- Salary',
                '- One house property',
                '- Other sources (Interest etc.)',
                'Total income up to ₹50 lakhs'
            ]
        });
    }

    // ITR-2
    if (['individual', 'huf'].includes(taxpayerType)) {
        forms.push({
            name: 'ITR-2',
            eligibility: [
                'For individuals and HUFs:',
                '- Not having income from business/profession',
                '- Having capital gains',
                '- Having income from multiple properties',
                '- Foreign income/assets'
            ]
        });
    }

    return forms;
};

const calculateRebate = (taxableIncome, tax, formData) => {
    const { taxRegime, residentialStatus } = formData;
    let rebate = 0;

    // Section 87A rebate
    if (residentialStatus === 'resident') {
        if (taxRegime === 'new' && taxableIncome <= 700000) {
            rebate = Math.min(tax, 25000);
        } else if (taxRegime === 'old' && taxableIncome <= 500000) {
            rebate = Math.min(tax, 12500);
        }
    }

    return rebate;
};

const calculateSurchargeWithRelief = (tax, income, taxpayerType) => {
    const { surcharge, surchargeDetails } = calculateSurcharge(tax, income, taxpayerType);
    let marginalRelief = 0;

    // Calculate marginal relief if applicable
    if (taxpayerType === 'individual' || taxpayerType === 'huf') {
        const thresholds = [
            { limit: 50000000, rate: 0.37 },
            { limit: 20000000, rate: 0.25 },
            { limit: 10000000, rate: 0.15 },
            { limit: 5000000, rate: 0.10 }
        ];

        for (const threshold of thresholds) {
            if (income > threshold.limit) {
                const excess = income - threshold.limit;
                const reliefAmount = excess + (tax * threshold.rate) - surcharge;
                if (reliefAmount > 0) {
                    marginalRelief = reliefAmount;
                }
                break;
            }
        }
    }

    return { surcharge, surchargeDetails, marginalRelief };
};

const calculateMedicalInsuranceDeduction = (data, ageCategory) => {
    const { self = 0, parents = 0, parentsAge } = data;
    let total = 0;
    let breakdown = [];

    // Self and family
    const selfLimit = ageCategory === 'senior' ? 
        DEDUCTION_LIMITS['80D'].self.senior : 
        DEDUCTION_LIMITS['80D'].self.normal;
    
    const selfDeduction = Math.min(self, selfLimit);
    if (selfDeduction > 0) {
        total += selfDeduction;
        breakdown.push({
            section: '80D',
            amount: selfDeduction,
            description: 'Medical Insurance Premium (Self & Family)'
        });
    }

    // Parents
    const parentsLimit = parentsAge === 'senior' ? 
        DEDUCTION_LIMITS['80D'].parents.senior : 
        DEDUCTION_LIMITS['80D'].parents.normal;
    
    const parentsDeduction = Math.min(parents, parentsLimit);
    if (parentsDeduction > 0) {
        total += parentsDeduction;
        breakdown.push({
            section: '80D',
            amount: parentsDeduction,
            description: 'Medical Insurance Premium (Parents)'
        });
    }

    return { total, breakdown };
};

const calculateHRAExemption = (data) => {
    const { 
        basicSalary = 0, 
        hraReceived = 0, 
        rentPaid = 0, 
        cityType = 'other' 
    } = data;

    // Calculate HRA exemption as per rules
    const rentExcess = rentPaid - (0.1 * basicSalary); // 10% of basic salary
    const hraLimit = basicSalary * DEDUCTION_LIMITS.HRA[cityType];
    
    const exemption = Math.min(
        hraReceived,
        rentExcess > 0 ? rentExcess : 0,
        hraLimit
    );

    return {
        amount: exemption,
        description: `HRA Exemption (${cityType === 'metro' ? 'Metro City' : 'Non-Metro City'})`
    };
};

const calculateTaxSavings = (formData) => {
    const { income, deductions = {} } = formData;
    
    // Calculate tax with current deductions
    const withDeductions = calculateTaxDetails(income, formData);
    
    // Calculate tax without deductions
    const withoutDeductions = calculateTaxDetails(income, {
        ...formData,
        deductions: {}
    });

    return {
        savings: withoutDeductions.totalTax - withDeductions.totalTax,
        potentialSavings: calculatePotentialSavings(formData)
    };
};

const calculatePotentialSavings = (formData) => {
    const { deductions = {} } = formData;
    let potential = [];

    // Check for unused 80C limit
    const unused80C = DEDUCTION_LIMITS['80C'] - (deductions['80C'] || 0);
    if (unused80C > 0) {
        potential.push({
            section: '80C',
            amount: unused80C,
            description: 'Additional investment in PPF, ELSS, etc.'
        });
    }

    // Check for unused 80D limit
    // Add other potential savings checks...

    return potential;
};

// Add these helper functions
const calculateSalaryBreakdown = (salary, allowances = {}) => {
    const {
        basic = 0.4,          // 40% of CTC by default
        hra = 0.4,           // 40% of basic by default
        da = 0,              // Dearness allowance
        specialAllowance = 0, // Special allowance
        transport = 0,       // Transport allowance
        medical = 0,         // Medical allowance
        lta = 0             // Leave travel allowance
    } = allowances;

    const basicSalary = Math.round(salary * basic);
    const breakdown = {
        basic: basicSalary,
        hra: Math.round(basicSalary * hra),
        da: Math.round(basicSalary * da),
        specialAllowance: Math.round(salary * specialAllowance),
        transport: Math.round(transport),
        medical: Math.round(medical),
        lta: Math.round(lta),
        gross: 0,
        deductions: {},
        net: 0
    };

    // Calculate gross salary
    breakdown.gross = Object.values(breakdown)
        .reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0);

    return breakdown;
};

const calculateSection80Deductions = (data, income) => {
    const deductions = {};
    let total = 0;

    // 80CCD(1) - NPS Employee Contribution
    if (data.npsEmployee) {
        const limit = Math.min(
            data.npsEmployee,
            data.salary * ADDITIONAL_DEDUCTIONS['80CCD'].NPS_EMPLOYEE
        );
        deductions['80CCD(1)'] = limit;
        total += limit;
    }

    // 80CCD(2) - NPS Employer Contribution
    if (data.npsEmployer) {
        const limit = Math.min(
            data.npsEmployer,
            data.salary * ADDITIONAL_DEDUCTIONS['80CCD'].NPS_EMPLOYER
        );
        deductions['80CCD(2)'] = limit;
        total += limit;
    }

    // 80CCD(1B) - Additional NPS
    if (data.npsAdditional) {
        const limit = Math.min(
            data.npsAdditional,
            ADDITIONAL_DEDUCTIONS['80CCD'].ADDITIONAL
        );
        deductions['80CCD(1B)'] = limit;
        total += limit;
    }

    // 80E - Education Loan Interest
    if (data.educationLoanInterest) {
        deductions['80E'] = data.educationLoanInterest;
        total += data.educationLoanInterest;
    }

    // 80EE - First Time Home Buyers
    if (data.firstTimeHomeLoan) {
        const limit = Math.min(
            data.firstTimeHomeLoan,
            ADDITIONAL_DEDUCTIONS['80EE']
        );
        deductions['80EE'] = limit;
        total += limit;
    }

    // 80G - Donations
    if (data.donations) {
        let donationDeduction = 0;
        for (const donation of data.donations) {
            const { amount, type } = donation;
            const rate = ADDITIONAL_DEDUCTIONS['80G'][type] || 0;
            donationDeduction += amount * rate;
        }
        deductions['80G'] = donationDeduction;
        total += donationDeduction;
    }

    return { deductions, total };
};

const calculateExemptions = (data) => {
    const exemptions = {};
    let total = 0;

    // LTA Exemption
    if (data.lta) {
        const ltaExemption = Math.min(
            data.lta.claimed,
            data.lta.actual,
            data.lta.allowed
        );
        exemptions.lta = ltaExemption;
        total += ltaExemption;
    }

    // Children Education Allowance
    if (data.childrenEducation) {
        const limit = 100 * 12 * (data.childrenEducation.count || 0); // ₹100 per month per child
        exemptions.childrenEducation = Math.min(
            data.childrenEducation.amount,
            limit
        );
        total += exemptions.childrenEducation;
    }

    // Transport Allowance for disabled
    if (data.transportDisabled) {
        const limit = 3200 * 12; // ₹3200 per month
        exemptions.transportDisabled = Math.min(
            data.transportDisabled,
            limit
        );
        total += exemptions.transportDisabled;
    }

    return { exemptions, total };
}; 