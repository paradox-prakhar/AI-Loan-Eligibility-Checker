import { Router } from 'express';
import { analyzeCreditProfile, analyzeLoanEligibility, analyzeRiskProfile } from '@finwise/shared';
import { buildReportPdf } from '../services/report.service';
import { syncReportToSheets } from '../services/sheets.service';

export const reportRouter = Router();

reportRouter.post('/pdf', async (req, res) => {
  const { title, summary, sections } = req.body as {
    title: string;
    summary: string;
    sections: Array<{ label: string; value: string }>;
  };

  const pdf = await buildReportPdf({ title, summary, sections });
  res.setHeader('content-type', 'application/pdf');
  res.setHeader('content-disposition', `attachment; filename="${slugify(title)}.pdf"`);
  res.send(pdf);
});

reportRouter.post('/sync/sheets', async (req, res) => {
  const result = await syncReportToSheets(req.body as Record<string, unknown>);
  res.json({ success: true, data: result });
});

reportRouter.post('/combined', async (req, res) => {
  const { profile, credit, risk } = req.body as {
    profile: Parameters<typeof analyzeLoanEligibility>[0];
    credit: Parameters<typeof analyzeCreditProfile>[0];
    risk: Parameters<typeof analyzeRiskProfile>[0];
  };

  const eligibility = analyzeLoanEligibility(profile);
  const creditResult = analyzeCreditProfile(credit);
  const riskResult = analyzeRiskProfile(risk);

  res.json({
    success: true,
    data: {
      eligibility,
      credit: creditResult,
      risk: riskResult,
      summary: 'Combined financial report generated successfully.',
    },
  });
});

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}