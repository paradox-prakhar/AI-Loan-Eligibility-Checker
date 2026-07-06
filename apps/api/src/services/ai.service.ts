import { env } from '../config/env';
import { analyzeCreditProfile, analyzeLoanEligibility, analyzeRiskProfile, buildAdviceContext } from '@finwise/shared';

const SYSTEM_PROMPT = `You are FinWise AI, an expert financial advisor for lending, credit, risk, savings, budgeting, and responsible borrowing.
Provide concise but actionable guidance.
Never invent numbers. Only use the supplied calculations and explain assumptions clearly.
Always include: reasoning, recommendations, risk analysis, and an improvement plan.`;

export async function generateFinancialAdvice(input: {
  profile: Parameters<typeof analyzeLoanEligibility>[0];
  credit: Parameters<typeof analyzeCreditProfile>[0];
  risk: Parameters<typeof analyzeRiskProfile>[0];
  goals: string[];
}) {
  const eligibility = analyzeLoanEligibility(input.profile);
  const credit = analyzeCreditProfile(input.credit);
  const risk = analyzeRiskProfile(input.risk);
  const context = buildAdviceContext({ eligibility, credit, risk, goals: input.goals });

  if (!env.CLAUDE_API_KEY) {
    return buildFallbackAdvice({ eligibility, credit, risk, goals: input.goals });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 1200,
        temperature: 0.2,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: `Financial context:\n${context}\n\nWrite personalized advice.` }],
      }),
    });

    if (!response.ok) {
      return buildFallbackAdvice({ eligibility, credit, risk, goals: input.goals });
    }

    const data = await response.json();
    const text = Array.isArray(data.content)
      ? data.content.map((item: { text?: string }) => item.text ?? '').join('\n')
      : 'Claude response unavailable.';

    return {
      provider: 'claude',
      summary: text,
      structured: {
        eligibility,
        credit,
        risk,
        goals: input.goals,
      },
    };
  } catch {
    return buildFallbackAdvice({ eligibility, credit, risk, goals: input.goals });
  }
}

function buildFallbackAdvice({ eligibility, credit, risk, goals }: { eligibility: ReturnType<typeof analyzeLoanEligibility>; credit: ReturnType<typeof analyzeCreditProfile>; risk: ReturnType<typeof analyzeRiskProfile>; goals: string[] }) {
  return {
    provider: 'deterministic-fallback',
    summary: [
      `Eligibility status: ${eligibility.status}.`,
      `Credit rating: ${credit.rating}.`,
      `Risk class: ${risk.riskClass}.`,
      goals.length ? `Primary goals: ${goals.join(', ')}.` : 'No specific goals supplied.',
      eligibility.recommendations[0],
      credit.suggestions[0],
    ].join(' '),
    structured: { eligibility, credit, risk, goals },
  };
}