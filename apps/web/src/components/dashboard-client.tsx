'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { cashflowSeries, eligibilitySeries, overviewMetrics, recentReports } from '@/lib/mock-data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Bot, CheckCircle2, FileDown, LineChart, Sparkles, Shield, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { calculateEmi, creditAnalysisInputSchema, emiCalculatorInputSchema, loanEligibilityInputSchema } from '@finwise/shared';

const eligibilityUiSchema = loanEligibilityInputSchema.extend({
  salary: z.coerce.number().min(0),
  monthlyIncome: z.coerce.number().min(0),
  existingEmi: z.coerce.number().min(0),
  creditScore: z.coerce.number().int().min(300).max(900),
  loanAmount: z.coerce.number().min(0),
  loanTenure: z.coerce.number().int().min(6).max(360),
  employmentYears: z.coerce.number().min(0),
  debt: z.coerce.number().min(0),
  savings: z.coerce.number().min(0),
  investments: z.coerce.number().min(0),
});

const creditUiSchema = creditAnalysisInputSchema.extend({
  creditScore: z.coerce.number().int().min(300).max(900),
  paymentHistory: z.coerce.number().min(0).max(100),
  creditUtilization: z.coerce.number().min(0).max(100),
  creditAge: z.coerce.number().min(0),
  loans: z.coerce.number().int().min(0),
  creditCards: z.coerce.number().int().min(0),
});

const emiUiSchema = emiCalculatorInputSchema.extend({
  loanAmount: z.coerce.number().min(0),
  interestRate: z.coerce.number().min(0).max(60),
  tenureMonths: z.coerce.number().int().min(1).max(600),
});

export function DashboardClient() {
  const [activeResult, setActiveResult] = useState<string>('Your AI summary will appear here after you run a check.');
  const [emiResult, setEmiResult] = useState<{ emi: number; totalPayment: number; totalInterest: number } | null>(null);
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High' | 'Very High'>('Low');

  const eligibilityForm = useForm<z.input<typeof eligibilityUiSchema>>({
    resolver: zodResolver(eligibilityUiSchema),
    defaultValues: {
      age: 31,
      salary: 2400000,
      employmentType: 'SALARIED',
      monthlyIncome: 200000,
      existingEmi: 18000,
      creditScore: 768,
      loanType: 'HOME',
      loanAmount: 8000000,
      loanTenure: 240,
      employmentYears: 6,
      city: 'Mumbai',
      debt: 120000,
      savings: 1500000,
      investments: 900000,
    },
  });

  const creditForm = useForm<z.input<typeof creditUiSchema>>({
    resolver: zodResolver(creditUiSchema),
    defaultValues: {
      creditScore: 768,
      paymentHistory: 98,
      creditUtilization: 18,
      creditAge: 5,
      loans: 2,
      creditCards: 3,
    },
  });

  const emiForm = useForm<z.input<typeof emiUiSchema>>({
    resolver: zodResolver(emiUiSchema),
    defaultValues: {
      loanAmount: 8000000,
      interestRate: 8.65,
      tenureMonths: 240,
    },
  });

  const eligibilityMutation = useMutation({
    mutationFn: async (values: z.input<typeof eligibilityUiSchema>) => {
      const response = await api.post('/finance/eligibility/check', values);
      return response.data.data as { status: string; riskScore: number; recommendations: string[]; confidenceScore: number; maximumLoanAmount: number };
    },
    onSuccess: (data) => {
      setActiveResult(`${data.status} with ${data.confidenceScore}% confidence. Max loan amount: ${formatCurrency(data.maximumLoanAmount)}.`);
      toast.success('Eligibility analysis completed');
      setRiskLevel(data.riskScore > 65 ? 'High' : data.riskScore > 45 ? 'Medium' : 'Low');
    },
    onError: () => toast.error('Eligibility check failed'),
  });

  const creditMutation = useMutation({
    mutationFn: async (values: z.input<typeof creditUiSchema>) => {
      const response = await api.post('/finance/credit/analyze', values);
      return response.data.data as { rating: string; suggestions: string[]; predictedFutureScore: number };
    },
    onSuccess: (data) => {
      setActiveResult(`${data.rating} credit profile. Predicted future score: ${data.predictedFutureScore}.`);
      toast.success('Credit analysis completed');
    },
    onError: () => toast.error('Credit analysis failed'),
  });

  const emiMutation = useMutation({
    mutationFn: async (values: z.input<typeof emiUiSchema>) => {
      const response = await api.post('/finance/emi/calculate', values);
      return response.data.data as ReturnType<typeof calculateEmi>;
    },
    onSuccess: (data) => {
      setEmiResult({ emi: data.emi, totalPayment: data.totalPayment, totalInterest: data.totalInterest });
      toast.success('EMI calculated');
    },
    onError: () => toast.error('EMI calculation failed'),
  });

  const chartData = useMemo(() => cashflowSeries, []);

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8">
      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card className="relative overflow-hidden border-cyan-400/15 bg-linear-to-br from-white/10 via-white/5 to-indigo-500/5">
          <CardContent className="space-y-6 p-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
              <Sparkles className="h-4 w-4" />
              Claude-powered financial intelligence with deterministic calculations
            </div>
            <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">Financial clarity for lending, credit growth, and long-term planning.</h2>
              <p className="max-w-2xl text-base text-slate-300 md:text-lg">Run loan eligibility checks, calculate EMI, get AI-backed financial advice, and generate professional reports from one secure dashboard.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                Run Assessment <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="secondary">Download Report <FileDown className="h-4 w-4" /></Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {overviewMetrics.map((metric) => (
                <div key={metric.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{metric.label}</p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <span className="text-2xl font-semibold text-white">{metric.value}</span>
                    <span className="text-sm text-emerald-300">{metric.delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Summary</CardTitle>
            <CardDescription>Live financial guidance based on your latest analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
              <Bot className="h-5 w-5 text-cyan-300" />
              <span className="text-sm text-slate-200">{activeResult}</span>
            </div>
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <div className="flex items-center justify-between text-sm text-emerald-100">
                <span>Risk posture</span>
                <span>{riskLevel}</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-linear-to-r from-emerald-300 to-cyan-300" style={{ width: riskLevel === 'Low' ? '88%' : riskLevel === 'Medium' ? '66%' : '42%' }} />
              </div>
            </div>
            <div className="grid gap-3 text-sm text-slate-300">
              {recentReports.map((report) => (
                <div key={report.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div>
                    <p className="text-white">{report.title}</p>
                    <p className="text-xs text-slate-400">{report.date}</p>
                  </div>
                  <Badge>{report.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Financial Dashboard</CardTitle>
            <CardDescription>Income, savings, and liability mix with smooth performance trends.</CardDescription>
          </CardHeader>
          <CardContent>
            <MiniBarChart data={chartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Credit Trend</CardTitle>
            <CardDescription>Eligibility and score momentum over the last six months.</CardDescription>
          </CardHeader>
          <CardContent>
            <MiniLineChart data={eligibilitySeries} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Loan Eligibility</CardTitle>
            <CardDescription>Evaluate borrowing capacity and underwriting risk.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={eligibilityForm.handleSubmit((values) => eligibilityMutation.mutate(values))}>
              <Input {...eligibilityForm.register('monthlyIncome')} type="number" placeholder="Monthly income" />
              <Input {...eligibilityForm.register('existingEmi')} type="number" placeholder="Existing EMI" />
              <Input {...eligibilityForm.register('creditScore')} type="number" placeholder="Credit score" />
              <Button className="w-full" type="submit">Check Eligibility</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Credit Score Analyzer</CardTitle>
            <CardDescription>See what is holding your score back and how to improve it.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={creditForm.handleSubmit((values) => creditMutation.mutate(values))}>
              <Input {...creditForm.register('creditScore')} type="number" placeholder="Credit score" />
              <Input {...creditForm.register('creditUtilization')} type="number" placeholder="Utilization %" />
              <Input {...creditForm.register('paymentHistory')} type="number" placeholder="Payment history %" />
              <Button className="w-full" type="submit">Analyze Credit</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>EMI Calculator</CardTitle>
            <CardDescription>Preview repayment pressure before you apply.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={emiForm.handleSubmit((values) => emiMutation.mutate(values))}>
              <Input {...emiForm.register('loanAmount')} type="number" placeholder="Loan amount" />
              <Input {...emiForm.register('interestRate')} type="number" step="0.01" placeholder="Interest rate" />
              <Input {...emiForm.register('tenureMonths')} type="number" placeholder="Tenure in months" />
              <Button className="w-full" type="submit">Calculate EMI</Button>
            </form>
            <AnimatePresence>
              {emiResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="mt-4 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-50"
                >
                  <div className="flex items-center gap-2 text-emerald-200"><CheckCircle2 className="h-4 w-4" /> EMI ready</div>
                  <p className="mt-2">EMI: {formatCurrency(emiResult.emi)} · Total interest: {formatCurrency(emiResult.totalInterest)}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

function MiniBarChart({ data }: { data: Array<{ name: string; value: number }> }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="flex h-80 items-end gap-4 rounded-3xl border border-white/10 bg-black/10 p-4">
      {data.map((item) => {
        const height = `${Math.max((item.value / maxValue) * 100, 8)}%`;
        return (
          <div key={item.name} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex w-full flex-1 items-end">
              <div className="relative h-full w-full rounded-2xl bg-white/5">
                <motion.div
                  className="absolute bottom-0 left-0 right-0 rounded-2xl bg-linear-to-t from-indigo-500 via-cyan-400 to-emerald-300 shadow-lg shadow-cyan-500/20"
                  initial={{ height: 0 }}
                  animate={{ height }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
            <span className="text-xs text-slate-300">{item.name}</span>
          </div>
        );
      })}
    </div>
  );
}

function MiniLineChart({ data }: { data: Array<{ month: string; score: number }> }) {
  const width = 640;
  const height = 320;
  const padding = 28;
  const maxScore = Math.max(...data.map((point) => point.score), 100);
  const minScore = Math.min(...data.map((point) => point.score), 0);
  const range = maxScore - minScore || 1;

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * (width - padding * 2);
    const y = padding + (1 - (point.score - minScore) / range) * (height - padding * 2);
    return { ...point, x, y };
  });

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  return (
    <div className="rounded-3xl border border-white/10 bg-black/10 p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-80 w-full overflow-visible">
        <defs>
          <linearGradient id="finwiseLine" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((step) => {
          const y = padding + (step / 3) * (height - padding * 2);
          return <line key={step} x1={padding} x2={width - padding} y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 6" />;
        })}
        <path d={linePath} fill="none" stroke="url(#finwiseLine)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point) => (
          <g key={point.month}>
            <circle cx={point.x} cy={point.y} r="6" fill="#0b1120" stroke="#06b6d4" strokeWidth="3" />
            <text x={point.x} y={height - 8} textAnchor="middle" fill="#94a3b8" fontSize="12">
              {point.month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}