"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEmi = calculateEmi;
exports.analyzeLoanEligibility = analyzeLoanEligibility;
exports.analyzeCreditProfile = analyzeCreditProfile;
exports.analyzeRiskProfile = analyzeRiskProfile;
exports.recommendLoanTypes = recommendLoanTypes;
exports.buildAdviceContext = buildAdviceContext;
const EMPLOYMENT_MULTIPLIER = {
    SALARIED: 1,
    SELF_EMPLOYED: 0.95,
    BUSINESS_OWNER: 0.92,
    FREELANCER: 0.88,
    STUDENT: 0.65,
    RETIRED: 0.7,
};
const LOAN_MULTIPLIER = {
    HOME: 18,
    CAR: 8,
    EDUCATION: 10,
    BUSINESS: 12,
    PERSONAL: 5,
    GOLD: 4,
};
const CREDIT_RATING_BY_SCORE = (score) => {
    if (score >= 800)
        return 'EXCELLENT';
    if (score >= 740)
        return 'VERY_GOOD';
    if (score >= 670)
        return 'GOOD';
    if (score >= 600)
        return 'FAIR';
    return 'POOR';
};
const riskClassFromScore = (score) => {
    if (score <= 25)
        return 'LOW';
    if (score <= 45)
        return 'MEDIUM';
    if (score <= 65)
        return 'HIGH';
    return 'VERY_HIGH';
};
function calculateEmi(input) {
    const monthlyRate = input.interestRate / 12 / 100;
    const factor = Math.pow(1 + monthlyRate, input.tenureMonths);
    const emi = monthlyRate === 0 ? input.loanAmount / input.tenureMonths : (input.loanAmount * monthlyRate * factor) / (factor - 1);
    const totalPayment = emi * input.tenureMonths;
    const totalInterest = Math.max(totalPayment - input.loanAmount, 0);
    const amortizationTable = Array.from({ length: input.tenureMonths }, (_, index) => {
        const month = index + 1;
        const interestForMonth = index === 0 ? input.loanAmount * monthlyRate : 0;
        const principalForMonth = Math.max(emi - interestForMonth, 0);
        return {
            month,
            emi: roundMoney(emi),
            principal: roundMoney(principalForMonth),
            interest: roundMoney(emi - principalForMonth),
            balance: roundMoney(Math.max(input.loanAmount - principalForMonth * month, 0)),
        };
    });
    return {
        emi: roundMoney(emi),
        totalPayment: roundMoney(totalPayment),
        totalInterest: roundMoney(totalInterest),
        amortizationTable,
        chart: [
            { name: 'Principal', value: roundMoney(input.loanAmount) },
            { name: 'Interest', value: roundMoney(totalInterest) },
        ],
    };
}
function analyzeLoanEligibility(input) {
    const monthlyObligation = input.existingEmi + input.debt * 0.05;
    const disposableIncome = Math.max(input.monthlyIncome - monthlyObligation, 0);
    const dti = input.monthlyIncome === 0 ? 100 : (monthlyObligation / input.monthlyIncome) * 100;
    const foir = Math.min(dti + (input.loanAmount / Math.max(input.monthlyIncome * 12, 1)) * 10, 100);
    const creditStrength = (input.creditScore - 300) / 6;
    const savingsBuffer = input.monthlyIncome === 0 ? 0 : ((input.savings + input.investments) / input.monthlyIncome) * 10;
    const employmentStrength = (input.employmentYears / 10) * 10 * EMPLOYMENT_MULTIPLIER[input.employmentType];
    const riskScore = clamp(100 - creditStrength * 0.35 - Math.max(0, 40 - disposableIncome / Math.max(input.monthlyIncome, 1) * 100) * 0.2 - savingsBuffer * 0.15 - employmentStrength * 0.1, 0, 100);
    const confidenceScore = clamp(100 - Math.abs(riskScore - 50), 55, 98);
    const maxLoanAmount = Math.max(input.monthlyIncome * LOAN_MULTIPLIER[input.loanType] * EMPLOYMENT_MULTIPLIER[input.employmentType] * (input.creditScore / 850), 0);
    const status = input.creditScore >= 780 && foir <= 55 && dti <= 40
        ? 'ELIGIBLE'
        : input.creditScore < 600 || foir > 70
            ? 'REJECTED'
            : 'REVIEW_REQUIRED';
    const reasons = [
        input.creditScore < 700 ? 'Credit score is below preferred bank threshold.' : 'Credit score supports this application.',
        foir > 60 ? 'Existing obligations are high relative to income.' : 'Obligations are within an acceptable range.',
        input.employmentYears < 2 ? 'Employment history is still building.' : 'Employment stability supports underwriting.',
    ];
    const recommendations = [
        input.creditScore < 750 ? 'Reduce utilization and clear revolving balances before applying.' : 'Maintain on-time repayments to preserve score strength.',
        foir > 50 ? 'Lower existing EMI exposure or extend cash reserve runway.' : 'Consider a shorter tenure to reduce total interest.',
        input.savings < input.monthlyIncome * 6 ? 'Increase emergency fund coverage to at least 6 months.' : 'Emergency fund coverage is healthy.',
    ];
    return {
        status,
        maximumLoanAmount: roundMoney(maxLoanAmount),
        debtToIncomeRatio: roundMoney(dti),
        foir: roundMoney(foir),
        riskScore: roundMoney(riskScore),
        confidenceScore: roundMoney(confidenceScore),
        disposableIncome: roundMoney(disposableIncome),
        reasons,
        recommendations,
    };
}
function analyzeCreditProfile(input) {
    const rating = CREDIT_RATING_BY_SCORE(input.creditScore);
    const utilizationPenalty = Math.max(0, 35 - input.creditUtilization * 0.6);
    const paymentBonus = input.paymentHistory * 0.2;
    const ageBonus = Math.min(input.creditAge * 2.5, 20);
    const predictedScore = clamp(input.creditScore + paymentBonus + ageBonus - utilizationPenalty - input.loans * 2 - input.creditCards, 300, 900);
    const factors = [
        input.paymentHistory >= 95 ? 'Strong repayment history' : 'Payment history needs consistency',
        input.creditUtilization <= 30 ? 'Healthy card utilization' : 'High credit utilization is hurting score',
        input.creditAge >= 3 ? 'Credit age is stable' : 'Short credit history limits score growth',
    ];
    const suggestions = [
        input.creditUtilization > 30 ? 'Keep utilization below 30% and ideally under 10%.' : 'Continue using cards lightly and paying in full.',
        input.paymentHistory < 98 ? 'Set autopay to avoid missed due dates.' : 'Preserve perfect payment behavior.',
        input.creditAge < 5 ? 'Avoid unnecessary new accounts while history matures.' : 'Your history length is helping score stability.',
    ];
    return {
        rating,
        factors,
        suggestions,
        predictedFutureScore: Math.round(predictedScore),
    };
}
function analyzeRiskProfile(input) {
    const disposableIncome = Math.max(input.monthlyIncome - input.existingEmi, 0);
    const foir = input.monthlyIncome === 0 ? 100 : (input.existingEmi / input.monthlyIncome) * 100;
    const debtRatio = input.monthlyIncome === 0 ? 100 : (input.debt / input.monthlyIncome) * 100;
    const coverage = input.existingEmi === 0 ? 100 : ((input.savings + input.investments) / input.existingEmi) * 100;
    const riskScore = clamp(foir * 0.35 + debtRatio * 0.25 - coverage * 0.1 + (700 - input.creditScore) * 0.08, 0, 100);
    const riskClass = riskClassFromScore(riskScore);
    return {
        foir: roundMoney(foir),
        debtRatio: roundMoney(debtRatio),
        disposableIncome: roundMoney(disposableIncome),
        coverageRatio: roundMoney(coverage),
        riskScore: roundMoney(riskScore),
        riskClass,
        radar: [
            { subject: 'Cash Flow', value: roundMoney(clamp(100 - foir, 0, 100)) },
            { subject: 'Debt Load', value: roundMoney(clamp(100 - debtRatio, 0, 100)) },
            { subject: 'Savings', value: roundMoney(clamp(coverage, 0, 100)) },
            { subject: 'Credit', value: roundMoney(clamp((input.creditScore - 300) / 6, 0, 100)) },
        ],
    };
}
function recommendLoanTypes(input) {
    const recommendations = [
        { type: 'HOME', score: scoreRecommendation(input, 'HOME') },
        { type: 'CAR', score: scoreRecommendation(input, 'CAR') },
        { type: 'EDUCATION', score: scoreRecommendation(input, 'EDUCATION') },
        { type: 'BUSINESS', score: scoreRecommendation(input, 'BUSINESS') },
        { type: 'PERSONAL', score: scoreRecommendation(input, 'PERSONAL') },
        { type: 'GOLD', score: scoreRecommendation(input, 'GOLD') },
    ]
        .sort((a, b) => b.score - a.score)
        .map((item) => ({
        loanType: item.type,
        confidence: roundMoney(item.score),
        rationale: recommendationReason(item.type, input),
    }));
    return recommendations;
}
function scoreRecommendation(input, loanType) {
    const base = input.creditScore / 9 - input.riskScore * 0.4 + Math.min(input.monthlyIncome / 1000, 20);
    const typeWeight = {
        HOME: 14,
        CAR: 12,
        EDUCATION: 10,
        BUSINESS: 9,
        PERSONAL: 6,
        GOLD: 4,
    };
    return clamp(base + typeWeight[loanType] + Math.min(input.eligibleAmount / 100000, 12), 0, 100);
}
function recommendationReason(loanType, input) {
    if (loanType === 'HOME') {
        return input.creditScore >= 750 && input.riskScore < 45 ? 'Best fit for stable income and strong underwriting profile.' : 'Possible, but a longer tenure and lower ticket size may be safer.';
    }
    if (loanType === 'CAR') {
        return 'Balanced choice for borrowers needing moderate ticket size and quick approval.';
    }
    if (loanType === 'EDUCATION') {
        return 'Good for future earning potential if cash flow is currently tight.';
    }
    if (loanType === 'BUSINESS') {
        return 'Suitable if income is variable but revenue visibility is strong.';
    }
    if (loanType === 'GOLD') {
        return 'Low-risk collateralized option when immediate liquidity is the goal.';
    }
    return 'Useful for short-term needs, though the cost of borrowing is higher.';
}
function buildAdviceContext(params) {
    return [
        `Eligibility status: ${params.eligibility.status}`,
        `Maximum loan amount: ${params.eligibility.maximumLoanAmount}`,
        `Credit rating: ${params.credit.rating}`,
        `Predicted future score: ${params.credit.predictedFutureScore}`,
        `Risk class: ${params.risk.riskClass}`,
        `Goals: ${params.goals.length ? params.goals.join(', ') : 'General improvement'}`,
    ].join('\n');
}
function roundMoney(value) {
    return Math.round(value * 100) / 100;
}
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
