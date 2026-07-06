"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.authLoginSchema = exports.authSignupSchema = exports.aiAdviceInputSchema = exports.riskEngineInputSchema = exports.emiCalculatorInputSchema = exports.creditAnalysisInputSchema = exports.loanEligibilityInputSchema = void 0;
const zod_1 = require("zod");
const money = zod_1.z.number().finite().nonnegative();
const percentage = zod_1.z.number().finite().min(0).max(100);
exports.loanEligibilityInputSchema = zod_1.z.object({
    age: zod_1.z.number().int().min(18).max(75),
    salary: money,
    employmentType: zod_1.z.enum(['SALARIED', 'SELF_EMPLOYED', 'BUSINESS_OWNER', 'FREELANCER', 'STUDENT', 'RETIRED']),
    monthlyIncome: money,
    existingEmi: money,
    creditScore: zod_1.z.number().int().min(300).max(900),
    loanType: zod_1.z.enum(['HOME', 'CAR', 'EDUCATION', 'BUSINESS', 'PERSONAL', 'GOLD']),
    loanAmount: money,
    loanTenure: zod_1.z.number().int().min(6).max(360),
    employmentYears: zod_1.z.number().finite().min(0),
    city: zod_1.z.string().min(2).max(80),
    debt: money,
    savings: money,
    investments: money,
});
exports.creditAnalysisInputSchema = zod_1.z.object({
    creditScore: zod_1.z.number().int().min(300).max(900),
    paymentHistory: percentage,
    creditUtilization: percentage,
    creditAge: zod_1.z.number().finite().min(0),
    loans: zod_1.z.number().int().min(0),
    creditCards: zod_1.z.number().int().min(0),
});
exports.emiCalculatorInputSchema = zod_1.z.object({
    loanAmount: money,
    interestRate: zod_1.z.number().finite().min(0).max(60),
    tenureMonths: zod_1.z.number().int().min(1).max(600),
});
exports.riskEngineInputSchema = zod_1.z.object({
    monthlyIncome: money,
    existingEmi: money,
    debt: money,
    savings: money,
    investments: money,
    creditScore: zod_1.z.number().int().min(300).max(900),
});
exports.aiAdviceInputSchema = zod_1.z.object({
    profile: exports.loanEligibilityInputSchema,
    credit: exports.creditAnalysisInputSchema,
    risk: exports.riskEngineInputSchema,
    goals: zod_1.z.array(zod_1.z.string().min(2).max(120)).max(12).default([]),
});
exports.authSignupSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2).max(120),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(128),
});
exports.authLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(128),
});
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
});
