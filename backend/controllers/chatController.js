const axios = require('axios');
const { calculateTaxSavings } = require('../utils/taxCalculator');

// Enhanced tax knowledge base
const taxKnowledge = {
    itr1: {
        name: "ITR-1 (Sahaj)",
        eligibility: [
            "Resident individuals",
            "Salary/Pension income",
            "Income from one house property",
            "Income from other sources (interest, dividends)",
            "Agricultural income up to ₹5,000",
            "Total income up to ₹50 lakh"
        ],
        cannotFile: [
            "Income above ₹50 lakh",
            "Capital gains",
            "Business/Professional income",
            "Multiple house properties",
            "Foreign income"
        ],
        documents: [
            "PAN & Aadhaar Card",
            "Form 16 from employer",
            "Form 26AS/AIS",
            "Bank statements",
            "Investment proofs",
            "House property documents (if applicable)"
        ]
    },
    itr2: {
        name: "ITR-2",
        eligibility: [
            "Individuals & HUFs",
            "Salary/Pension income",
            "Multiple house properties",
            "Capital gains",
            "Foreign income/assets",
            "Income above ₹50 lakh"
        ],
        cannotFile: [
            "Business/Professional income"
        ],
        documents: [
            "Form 16 and Form 26AS/AIS",
            "Capital gains statements",
            "Property documents",
            "Foreign income proofs",
            "Investment statements"
        ]
    },
    itr3: {
        name: "ITR-3",
        eligibility: [
            "Individuals & HUFs with business/professional income",
            "Company directors",
            "Partnership firm partners",
            "Income from capital gains",
            "Multiple properties",
            "Foreign assets"
        ],
        documents: [
            "Business balance sheet",
            "Profit & loss statement",
            "Form 16A",
            "Capital gains details",
            "Bank statements"
        ]
    },
    itr4: {
        name: "ITR-4 (Sugam)",
        eligibility: [
            "Presumptive taxation cases",
            "Business income (Section 44AD)",
            "Professional income (Section 44ADA)",
            "Transport income (Section 44AE)",
            "Total income up to ₹50 lakh"
        ],
        cannotFile: [
            "Regular business expenses claims",
            "Business turnover above ₹2 crore"
        ],
        documents: [
            "PAN details",
            "Bank statements",
            "Turnover details",
            "GST returns (if applicable)"
        ]
    },
    itr5: {
        name: "ITR-5",
        eligibility: [
            "Firms",
            "LLPs",
            "Association of Persons (AOPs)",
            "Body of Individuals (BOIs)"
        ],
        cannotFile: [
            "Individuals",
            "HUFs",
            "Companies"
        ],
        documents: [
            "Business financials",
            "Partner details",
            "Income statements",
            "Tax audit report"
        ]
    },
    itr6: {
        name: "ITR-6",
        eligibility: [
            "Companies (except Section 11 entities)",
            "Corporate tax entities"
        ],
        documents: [
            "Profit & Loss account",
            "Balance Sheet",
            "Tax computation",
            "Shareholder details",
            "Director details"
        ]
    },
    itr7: {
        name: "ITR-7",
        eligibility: [
            "Charitable trusts (Section 139(4A))",
            "Political parties (Section 139(4B))",
            "Scientific research institutions (Section 139(4C))",
            "Educational institutions (Section 139(4D))"
        ],
        documents: [
            "Trust/Entity PAN",
            "Income & expenditure statement",
            "Donation records",
            "Tax exemption details"
        ]
    }
};

const userResponses = new Map();

const formDownloadLinks = {
    itr1: "/forms/ITR-1.pdf",
    itr2: "/forms/ITR-2.pdf",
    itr3: "/forms/ITR-3.pdf",
    itr4: "/forms/ITR-4.pdf",
    itr5: "/forms/ITR-5.pdf",
    itr6: "/forms/ITR-6.pdf",
    itr7: "/forms/ITR-7.pdf"
};

const determineITRForm = (responses) => {
    try {
        const incomeSources = Array.isArray(responses.incomeSource) 
            ? responses.incomeSource 
            : [responses.incomeSource];

        console.log('Determining ITR form with responses:', responses);

        // First check entity type for non-individual forms
        switch (responses.entityType) {
            case 'Company':
                return 'itr6';
            case 'Trust/Institution':
                return 'itr7';
            case 'Firm/LLP/AOP':
                return 'itr5';
        }

        // For Individuals and HUFs
        if (responses.entityType === 'Individual' || responses.entityType === 'HUF') {
            
            // ITR-3: Priority check for business income without presumptive
            if (incomeSources.includes('Business/Professional') && 
                (responses.usesPresumptiveTaxation === 'No' || 
                responses.turnoverBelow2Cr === 'No')) {
                return 'itr3';
            }

            // ITR-4: Check for presumptive taxation
            if (incomeSources.includes('Business/Professional') && 
                responses.usesPresumptiveTaxation === 'Yes' && 
                responses.turnoverBelow2Cr === 'Yes' && 
                responses.incomeBelowLimit === 'Yes') {
                return 'itr4';
            }

            // ITR-2: Check conditions
            const itr2Conditions = [
                responses.hasForeignIncome === 'Yes',
                responses.incomeBelowLimit === 'No',
                responses.hasMultipleProperties === 'Yes',
                incomeSources.includes('Capital Gains'),
                incomeSources.includes('Rental Income') && responses.hasMultipleProperties === 'Yes'
            ];

            if (itr2Conditions.some(condition => condition === true)) {
                return 'itr2';
            }

            // ITR-1: Check for simplest case
            const itr1Conditions = {
                income: responses.incomeBelowLimit === 'Yes',
                singleProperty: responses.hasMultipleProperties === 'No',
                noForeign: responses.hasForeignIncome === 'No',
                simpleIncome: incomeSources.every(source => 
                    ['Salary', 'Other Sources', 'Rental Income'].includes(source)
                ),
                noBusiness: !incomeSources.includes('Business/Professional'),
                noCapitalGains: !incomeSources.includes('Capital Gains')
            };

            if (Object.values(itr1Conditions).every(condition => condition === true)) {
                return 'itr1';
            }

            // Default to ITR-2 if no other conditions match
            return 'itr2';
        }

        return 'itr2';
    } catch (error) {
        console.error('Error in determineITRForm:', error, responses);
        return 'itr2';
    }
};

const chatController = {
    processMessage: async (req, res) => {
        try {
            const { message, step, userId } = req.body;
            const response = handleChatFlow(message, step, userId || 'default');
            return res.json({ response });
        } catch (error) {
            console.error('Chat error:', error);
            res.status(500).json({ 
                error: 'Failed to process your request',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

const handleChatFlow = (message, step, userId) => {
    if (!userResponses.has(userId)) {
        userResponses.set(userId, {});
    }
    const responses = userResponses.get(userId);

    if (!step || message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
        return {
            message: "Hello! I'm your ITR Guide Bot 🤖. I can help you determine the correct Income Tax Return (ITR) form based on your income details. Let's get started! 📝",
            options: ["Individual", "HUF", "Business"],
            step: 1
        };
    }

    switch (step) {
        case 1:
            responses.entityType = message;
            return {
                message: "What type of entity are you?",
                options: [
                    "Individual",
                    "HUF",
                    "Company",
                    "Firm/LLP/AOP",
                    "Trust/Institution"
                ],
                step: 2
            };

        case 2:
            responses.entityType = message;
            if (message === 'Company') {
                return provideFinalRecommendation('itr6', responses);
            }
            if (message === 'Trust/Institution') {
                return provideFinalRecommendation('itr7', responses);
            }
            if (message === 'Firm/LLP/AOP') {
                return provideFinalRecommendation('itr5', responses);
            }
            return {
                message: "What are your sources of income? (You can choose multiple)",
                options: [
                    "Salary",
                    "Business/Professional",
                    "Capital Gains",
                    "Rental Income",
                    "Other Sources"
                ],
                step: 3,
                multiSelect: true
            };

        case 3:
            responses.incomeSource = message;
            if (responses.incomeSource.includes('Business/Professional')) {
                return {
                    message: "Do you use presumptive taxation scheme under sections 44AD, 44ADA, or 44AE?",
                    options: ["Yes", "No"],
                    step: "3a"
                };
            }
            return {
                message: "Do you have income from foreign sources or assets outside India?",
                options: ["Yes", "No"],
                step: 4
            };

        case "3a":
            responses.usesPresumptiveTaxation = message;
            return {
                message: "Is your business turnover below ₹2 crore?",
                options: ["Yes", "No"],
                step: "3b"
            };

        case "3b":
            responses.turnoverBelow2Cr = message;
            return {
                message: "Do you have income from foreign sources or assets outside India?",
                options: ["Yes", "No"],
                step: 4
            };

        case 4:
            responses.hasForeignIncome = message;
            if (responses.incomeSource.includes('Business/Professional')) {
                return {
                    message: "Do you use presumptive taxation scheme?",
                    options: ["Yes", "No"],
                    step: "4a"
                };
            }
            return {
                message: "Do you have multiple house properties?",
                options: ["Yes", "No"],
                step: 5
            };

        case 5:
            responses.hasMultipleProperties = message;
            return {
                message: "Is your total income below ₹50 lakh?",
                options: ["Yes", "No"],
                step: "5a"
            };

        case "5a":
            responses.incomeBelowLimit = message;
            return {
                message: "Are you eligible for tax exemptions under sections like 80C, 80D, etc.?",
                options: ["Yes", "No"],
                step: 6
            };

        case 6:
            responses.hasExemptions = message;
            const formType = determineITRForm(responses);
            responses.itrForm = formType;
            
            console.log('Determined form type:', formType, responses);

            return {
                message: `Based on your responses, the correct ITR form for you is ${taxKnowledge[formType].name}.\n\n` +
                        `This form is suitable for your income profile:\n` +
                        `${taxKnowledge[formType].eligibility.map(e => `• ${e}`).join('\n')}\n\n`,
                options: ["Download Form", "View Guide", "No, thanks"],
                downloadLink: formDownloadLinks[formType],
                step: 7
            };

        case 7:
            if (message === "Download Form") {
                return {
                    message: "You can download the form using the button below. Would you like to see the filing guide as well?",
                    options: ["Yes, show me the guide", "No, thanks"],
                    downloadLink: formDownloadLinks[responses.itrForm],
                    step: "7a"
                };
            }
            if (message === "View Guide") {
                const formType = responses.itrForm;
                return {
                    message: "Here's your step-by-step guide:\n\n" +
                            `1. Download the ${taxKnowledge[formType].name} form\n` +
                            "2. Gather required documents:\n" +
                            `${taxKnowledge[formType].documents.map(d => `   • ${d}`).join('\n')}\n` +
                            "3. Fill in your personal information\n" +
                            "4. Enter income details\n" +
                            "5. Claim deductions\n" +
                            "6. Verify and submit\n\n" +
                            "Would you like to know about tax-saving options?",
                    options: ["Yes, show tax-saving options", "No, I'm good"],
                    downloadLink: formDownloadLinks[formType],
                    step: 8
                };
            }
            return {
                message: "Would you like to know about tax-saving options?",
                options: ["Yes, show tax-saving options", "No, I'm good"],
                step: 8
            };

        case 8:
            if (message === "Yes, show tax-saving options") {
                return {
                    message: "Here are tax-saving options based on your profile:\n\n" +
                            "1. Section 80C (₹1.5L limit):\n" +
                            "   • PPF (Public Provident Fund)\n" +
                            "   • ELSS Mutual Funds\n" +
                            "   • Life Insurance Premium\n" +
                            "   • NPS Contribution\n\n" +
                            "2. Section 80D (Health Insurance):\n" +
                            "   • Self & Family: ₹25,000\n" +
                            "   • Senior Parents: ₹50,000\n\n" +
                            "3. Other Deductions:\n" +
                            "   • Home Loan Interest (₹2L)\n" +
                            "   • Education Loan Interest\n" +
                            "   • NPS Additional (₹50,000)\n\n" +
                            "Would you like to start a new consultation?",
                    options: ["Start Over", "Exit"],
                    step: "end"
                };
            }
            return {
                message: "Thank you for using the ITR Guide Bot! Would you like to start a new consultation?",
                options: ["Start Over", "Exit"],
                step: "end"
            };

        case "end":
            if (message === "Start Over") {
                // Clear user responses for this session
                userResponses.set(userId, {});
                return {
                    message: "Hello! I'm your ITR Guide Bot 🤖. I can help you determine the correct Income Tax Return (ITR) form based on your income details. Let's get started! 📝",
                    options: ["Individual", "HUF", "Business"],
                    step: 1,
                    shouldStoreHistory: true // New flag to indicate storing in history
                };
            }
            return {
                message: "Thank you for using the ITR Guide Bot! Feel free to start a new conversation anytime.",
                options: ["Start Over"],
                step: "end"
            };

        default:
            return {
                message: "Thank you for using the ITR Guide Bot! 🎉 If you have any more questions, feel free to ask. Happy Tax Filing! 😊",
                options: ["Start Over", "Exit"],
                step: "end"
            };
    }
};

const provideFinalRecommendation = (formType, responses) => {
    console.log('Final recommendation:', {
        formType,
        responses,
        eligibility: taxKnowledge[formType].eligibility
    });

    const form = taxKnowledge[formType];
    return {
        message: `Based on your responses, you should file ${form.name}.\n\n` +
                `Eligibility Criteria:\n${form.eligibility.map(e => `• ${e}`).join('\n')}\n\n` +
                `${form.cannotFile ? `Cannot File If:\n${form.cannotFile.map(c => `• ${c}`).join('\n')}\n\n` : ''}` +
                `Required Documents:\n${form.documents.map(d => `• ${d}`).join('\n')}\n\n` +
                `Would you like a step-by-step guide on how to file it?`,
        options: ["Yes, show me the guide", "No, thanks"],
        step: 6
    };
};

const handleLocalResponse = (userInput) => {
    if (!userInput) return defaultResponse();

    const input = userInput.toLowerCase();
    const numbers = userInput.match(/\d+/g);
    const income = numbers ? Math.max(...numbers.map(num => parseInt(num))) : 0;

    // Greeting patterns
    if (input.match(/^(hi|hello|hey|help|start)/i)) {
        return {
            message: "Hello! 👋 I'm your Tax Assistant. I can help you with:\n\n" +
                    "1. Finding the right ITR form\n" +
                    "2. Tax saving suggestions\n" +
                    "3. Income tax calculations\n" +
                    "4. Required documents\n" +
                    "5. Due dates and compliance\n\n" +
                    "Please ask me anything specific about these topics!"
        };
    }

    // Document requirements
    if (input.includes('document') || input.includes('proof') || input.includes('required')) {
        if (input.includes('itr1') || input.includes('itr 1') || input.includes('sahaj')) {
            return {
                message: `Documents required for ${taxKnowledge.itr1.name}:\n\n` +
                        taxKnowledge.itr1.documents.map(doc => `• ${doc}`).join('\n')
            };
        }
    }

    // Income and ITR form recommendation
    if (input.match(/(salary|income|earn|ctc|package)/i)) {
        if (income > 0) {
            const taxBracket = calculateTaxBracket(income);
            const taxAmount = calculateTax(income);
            
            let suggestedForm = "ITR-1";
            if (income > 5000000) suggestedForm = "ITR-2";

            return {
                message: `Based on your income of ₹${income.toLocaleString()}:\n\n` +
                        `1. Tax Bracket: ${taxBracket.rate}%\n` +
                        `2. Estimated Tax: ₹${taxAmount.toLocaleString()}\n` +
                        `3. Suggested Form: ${suggestedForm}\n` +
                        `4. Maximum Tax Saving Possible: ₹${taxBracket.maxSaving.toLocaleString()}\n\n` +
                        `Would you like to:\n` +
                        `a) Know about tax saving options?\n` +
                        `b) See required documents?\n` +
                        `c) Learn more about ${suggestedForm}?`
            };
        }
    }

    // Business income queries
    if (input.match(/(business|professional|freelance|consultant|practice)/i)) {
        if (input.includes('turnover') && income > 0) {
            const suggestedForm = income <= 20000000 ? 'ITR-4' : 'ITR-3';
            return {
                message: `For business turnover of ₹${income.toLocaleString()}:\n\n` +
                        `1. Suggested Form: ${suggestedForm}\n` +
                        `2. ${suggestedForm === 'ITR-4' ? 'You can opt for presumptive taxation' : 'Regular books of accounts required'}\n\n` +
                        `Required Documents:\n` +
                        taxKnowledge[suggestedForm.toLowerCase()].documents.map(doc => `• ${doc}`).join('\n')
            };
        }
        return {
            message: "For business/professional income:\n\n" +
                    "1. ITR-4 (Sugam): For turnover up to ₹2 crore under presumptive scheme\n" +
                    "2. ITR-3: For regular business income\n\n" +
                    "Please specify your annual turnover for more specific guidance."
        };
    }

    // Tax saving queries
    if (input.match(/(save tax|saving|80c|deduction|exemption)/i)) {
        return {
            message: "Tax Saving Options:\n\n" +
                    "1. Section 80C (₹1.5L limit):\n" +
                    "   • PPF (Public Provident Fund)\n" +
                    "   • ELSS Mutual Funds\n" +
                    "   • Life Insurance Premium\n" +
                    "   • Children's Tuition Fees\n\n" +
                    "2. Section 80D (Health Insurance):\n" +
                    "   • Self & Family: ₹25,000\n" +
                    "   • Parents below 60: ₹25,000\n" +
                    "   • Parents above 60: ₹50,000\n\n" +
                    "3. Home Loan Benefits:\n" +
                    "   • Principal: Under 80C\n" +
                    "   • Interest: Up to ₹2L deduction\n\n" +
                    "4. NPS Additional Deduction:\n" +
                    "   • Extra ₹50,000 under 80CCD(1B)\n\n" +
                    "Which option would you like to know more about?"
        };
    }

    return defaultResponse();
};

const calculateTax = (income) => {
    if (income <= 500000) return 0;
    if (income <= 1000000) return (income - 500000) * 0.2;
    return 100000 + (income - 1000000) * 0.3;
};

const calculateTaxBracket = (income) => {
    if (income <= 500000) return { rate: 0, form: 'ITR-1', maxSaving: 150000 };
    if (income <= 1000000) return { rate: 20, form: 'ITR-1', maxSaving: 200000 };
    return { rate: 30, form: 'ITR-2', maxSaving: 250000 };
};

const defaultResponse = () => ({
    message: "I can help you with:\n\n" +
            "• Income tax calculations\n" +
            "• ITR form selection\n" +
            "• Tax saving options\n" +
            "• Document requirements\n\n" +
            "Please ask specific questions like:\n" +
            "- What's my tax on 8 lakh salary?\n" +
            "- Which ITR form for business income?\n" +
            "- Documents needed for ITR-1?\n" +
            "- How to save tax on 15 lakh income?"
});

module.exports = chatController; 