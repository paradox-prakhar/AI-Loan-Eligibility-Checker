import { z } from 'zod';

const money = z.number().finite().nonnegative();
const percentage = z.number().finite().min(0).max(100);

export const loanEligibilityInputSchema = z.object({
  age: z.number().int().min(18).max(75),
  salary: money,
  employmentType: z.enum(['SALARIED', 'SELF_EMPLOYED', 'BUSINESS_OWNER', 'FREELANCER', 'STUDENT', 'RETIRED']),
  monthlyIncome: money,
  existingEmi: money,
  creditScore: z.number().int().min(300).max(900),
  loanType: z.enum(['HOME', 'CAR', 'EDUCATION', 'BUSINESS', 'PERSONAL', 'GOLD']),
  loanAmount: money,
  loanTenure: z.number().int().min(6).max(360),
  employmentYears: z.number().finite().min(0),
  city: z.string().min(2).max(80),
  debt: money,
  savings: money,
  investments: money,
});

export const creditAnalysisInputSchema = z.object({
  creditScore: z.number().int().min(300).max(900),
  paymentHistory: percentage,
  creditUtilization: percentage,
  creditAge: z.number().finite().min(0),
  loans: z.number().int().min(0),
  creditCards: z.number().int().min(0),
});

export const emiCalculatorInputSchema = z.object({
  loanAmount: money,
  interestRate: z.number().finite().min(0).max(60),
  tenureMonths: z.number().int().min(1).max(600),
});

export const riskEngineInputSchema = z.object({
  monthlyIncome: money,
  existingEmi: money,
  debt: money,
  savings: money,
  investments: money,
  creditScore: z.number().int().min(300).max(900),
});

export const aiAdviceInputSchema = z.object({
  profile: loanEligibilityInputSchema,
  credit: creditAnalysisInputSchema,
  risk: riskEngineInputSchema,
  goals: z.array(z.string().min(2).max(120)).max(12).default([]),
});

export type LoanEligibilityInput = z.infer<typeof loanEligibilityInputSchema>;
export type CreditAnalysisInput = z.infer<typeof creditAnalysisInputSchema>;
export type EmiCalculatorInput = z.infer<typeof emiCalculatorInputSchema>;
export type RiskEngineInput = z.infer<typeof riskEngineInputSchema>;
export type AiAdviceInput = z.infer<typeof aiAdviceInputSchema>;

export const authSignupSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});