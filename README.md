# FinWise AI

FinWise AI is a production-oriented fintech platform for loan eligibility checks, credit analysis, EMI calculations, AI-assisted financial advice, report generation, and historical financial tracking.

## Architecture

- `apps/web`: Next.js 15 frontend with React 19, TypeScript, TailwindCSS, Framer Motion, React Hook Form, Zod, React Query, Recharts, and Axios.
- `apps/api`: Express.js TypeScript API with JWT authentication, Google OAuth/email login, Prisma, MongoDB Atlas, Claude AI integration, report generation, and security middleware.
- `packages/shared`: Shared types, schemas, and calculation utilities used by both apps.

## Core Capabilities

- Loan eligibility analysis
- Credit score interpretation and improvement planning
- EMI and amortization calculations
- AI financial advisory using Claude
- Loan recommendation and risk scoring
- PDF report generation
- Report history and audit logging
- Google Sheets sync for report archives

## Local Development

1. Copy `.env.example` to `.env` and fill in secrets.
2. Install dependencies in each app.
3. Run the web and API apps in parallel.

## Notes

This repository is intentionally structured for production use, but external credentials and deployment secrets still need to be supplied before going live.