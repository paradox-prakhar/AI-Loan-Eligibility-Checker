import { Router } from 'express';
import {
  analyzeCreditProfile,
  analyzeLoanEligibility,
  analyzeRiskProfile,
  aiAdviceInputSchema,
  creditAnalysisInputSchema,
  emiCalculatorInputSchema,
  loanEligibilityInputSchema,
  recommendLoanTypes,
  riskEngineInputSchema,
  calculateEmi,
} from '@finwise/shared';
import { generateFinancialAdvice } from '../services/ai.service';

export const financeRouter = Router();

financeRouter.post('/eligibility/check', (req, res) => {
  const input = loanEligibilityInputSchema.parse(req.body);
  const result = analyzeLoanEligibility(input);
  const recommendations = recommendLoanTypes({
    monthlyIncome: input.monthlyIncome,
    creditScore: input.creditScore,
    riskScore: result.riskScore,
    eligibleAmount: result.maximumLoanAmount,
  });
  res.json({ success: true, data: { ...result, recommendations } });
});

financeRouter.post('/credit/analyze', (req, res) => {
  const input = creditAnalysisInputSchema.parse(req.body);
  const result = analyzeCreditProfile(input);
  res.json({ success: true, data: result });
});

financeRouter.post('/emi/calculate', (req, res) => {
  const input = emiCalculatorInputSchema.parse(req.body);
  const result = calculateEmi(input);
  res.json({ success: true, data: result });
});

financeRouter.post('/risk/analyze', (req, res) => {
  const input = riskEngineInputSchema.parse(req.body);
  const result = analyzeRiskProfile(input);
  res.json({ success: true, data: result });
});

financeRouter.post('/advisor/financial', async (req, res) => {
  const input = aiAdviceInputSchema.parse(req.body);
  const advice = await generateFinancialAdvice(input);
  res.json({ success: true, data: advice });
});
