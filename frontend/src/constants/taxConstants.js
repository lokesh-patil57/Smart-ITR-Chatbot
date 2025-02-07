export const TAX_SLABS = {
    NEW_REGIME: [
        { limit: 300000, rate: 0 },
        { limit: 600000, rate: 5 },
        { limit: 900000, rate: 10 },
        { limit: 1200000, rate: 15 },
        { limit: 1500000, rate: 20 },
        { limit: Infinity, rate: 30 }
    ],
    OLD_REGIME: {
        GENERAL: [
            { limit: 250000, rate: 0 },
            { limit: 500000, rate: 5 },
            { limit: 1000000, rate: 20 },
            { limit: Infinity, rate: 30 }
        ],
        SENIOR: [
            { limit: 300000, rate: 0 },
            { limit: 500000, rate: 5 },
            { limit: 1000000, rate: 20 },
            { limit: Infinity, rate: 30 }
        ],
        SUPER_SENIOR: [
            { limit: 500000, rate: 0 },
            { limit: 1000000, rate: 20 },
            { limit: Infinity, rate: 30 }
        ]
    }
};

export const SURCHARGE_SLABS = [
    { limit: 50000000, rate: 37 },
    { limit: 20000000, rate: 25 },
    { limit: 10000000, rate: 15 },
    { limit: 5000000, rate: 10 }
];

export const CESS_RATE = 4; 