import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BarChart3, BrainCircuit, CheckCircle2, Coins, ShieldCheck, Sparkles, Star, Wallet } from 'lucide-react';
import Link from 'next/link';

const features = [
	{ title: 'Loan Eligibility', description: 'Programmatic underwriting with FOIR, DTI, risk score, confidence, and actionable reasons.', icon: ShieldCheck },
	{ title: 'Credit Intelligence', description: 'Understand rating bands, factors affecting score, and projected improvement path.', icon: BarChart3 },
	{ title: 'AI Financial Advisor', description: 'Claude-backed reasoning that always stays grounded in deterministic calculations.', icon: BrainCircuit },
	{ title: 'EMI & Reports', description: 'EMI calculator, amortization, professional PDFs, and history tracking in one flow.', icon: Wallet },
];

const testimonials = [
	{ name: 'Priya N.', role: 'Homebuyer', quote: 'The loan readiness view made it obvious what to fix before applying.' },
	{ name: 'Amit S.', role: 'Founder', quote: 'The risk engine is clear, fast, and feels like a real underwriting tool.' },
	{ name: 'Sarah K.', role: 'Salaried Professional', quote: 'The advice is practical, precise, and not full of hallucinated numbers.' },
];

const pricing = [
	{ name: 'Starter', price: 'Free', items: ['Basic eligibility checks', 'EMI calculator', 'Single report export'] },
	{ name: 'Pro', price: '₹799/mo', items: ['Unlimited reports', 'AI advisory', 'PDF history and insights'] },
	{ name: 'Enterprise', price: 'Custom', items: ['Team dashboards', 'Admin analytics', 'API and workflow integrations'] },
];

export default function HomePage() {
	return (
		<main className="relative overflow-hidden">
			<section className="mx-auto flex min-h-screen max-w-7xl flex-col gap-16 px-6 py-8 lg:px-10">
				<header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/20 text-cyan-300"><Sparkles className="h-5 w-5" /></div>
						<div>
							<p className="text-xs uppercase tracking-[0.3em] text-slate-400">FinWise AI</p>
							<p className="text-sm text-white">Intelligent Financial Advisory Platform</p>
						</div>
					</div>
					<div className="hidden items-center gap-3 md:flex">
						<Link href="/login"><Button variant="ghost">Login</Button></Link>
						<Link href="/signup"><Button>Get Started</Button></Link>
					</div>
				</header>

				<section className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
					<div className="space-y-8">
						<Badge className="border-cyan-400/20 bg-cyan-500/10 text-cyan-100">Dark glassmorphism fintech dashboard</Badge>
						<div className="space-y-5">
							<h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">Loan eligibility, credit analysis, and AI financial advice in one secure system.</h1>
							<p className="max-w-2xl text-lg text-slate-300">FinWise AI combines deterministic underwriting math with Claude-powered reasoning to produce professional, trustworthy financial guidance for users and admin teams.</p>
						</div>
						<div className="flex flex-wrap gap-3">
							<Link href="/dashboard"><Button className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">Open Dashboard <ArrowRight className="h-4 w-4" /></Button></Link>
							<Link href="/signup"><Button variant="secondary">Create Account</Button></Link>
						</div>
						<div className="grid gap-3 sm:grid-cols-3">
							{['Loan check', 'Credit score', 'Financial advice'].map((item) => (
								<div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 backdrop-blur-md">{item}</div>
							))}
						</div>
					</div>
					<Card className="border-cyan-400/15 bg-white/5">
						<CardHeader>
							<CardTitle>Platform snapshot</CardTitle>
							<CardDescription>Built for responsive web, API-first integration, and production deployment.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-3 sm:grid-cols-2">
								{[
									{ label: 'Credit Health', value: 'Excellent' },
									{ label: 'Eligibility', value: '91%' },
									{ label: 'Risk Profile', value: 'Low' },
									{ label: 'AI Confidence', value: '96%' },
								].map((item) => (
									<div key={item.label} className="rounded-3xl border border-white/10 bg-black/20 p-4">
										<p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
										<p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
									</div>
								))}
							</div>
							<div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-50">
								<div className="flex items-center gap-2 font-medium text-emerald-200"><CheckCircle2 className="h-4 w-4" /> Safe calculation pipeline</div>
								<p className="mt-2">All numeric outputs are computed programmatically first. Claude is used only for reasoning and advisory synthesis.</p>
							</div>
						</CardContent>
					</Card>
				</section>

				<section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
					{features.map((feature) => (
						<Card key={feature.title} className="h-full">
							<CardHeader>
								<div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-300"><feature.icon className="h-5 w-5" /></div>
								<CardTitle>{feature.title}</CardTitle>
								<CardDescription>{feature.description}</CardDescription>
							</CardHeader>
						</Card>
					))}
				</section>

				<section className="grid gap-6 lg:grid-cols-3">
					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle>How It Works</CardTitle>
							<CardDescription>Deterministic calculations drive the truth; Claude turns the results into useful financial guidance.</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 md:grid-cols-3">
							{['Capture profile and debts', 'Run eligibility, EMI, and risk engines', 'Generate AI advice, PDFs, and recommendations'].map((step, index) => (
								<div key={step} className="rounded-3xl border border-white/10 bg-white/5 p-4">
									<p className="text-sm text-cyan-200">Step {index + 1}</p>
									<p className="mt-2 text-sm text-slate-200">{step}</p>
								</div>
							))}
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Why teams choose it</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm text-slate-300">
							<p className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-300" /> Enterprise-ready architecture</p>
							<p className="flex items-center gap-2"><Coins className="h-4 w-4 text-emerald-300" /> Bank-grade calculation transparency</p>
							<p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan-300" /> Secure auth and audit trails</p>
						</CardContent>
					</Card>
				</section>

				<section className="grid gap-6 lg:grid-cols-3">
					{testimonials.map((item) => (
						<Card key={item.name}>
							<CardContent className="space-y-4 p-0">
								<p className="text-sm text-slate-300">“{item.quote}”</p>
								<div>
									<p className="text-sm font-medium text-white">{item.name}</p>
									<p className="text-xs text-slate-400">{item.role}</p>
								</div>
							</CardContent>
						</Card>
					))}
				</section>

				<section className="grid gap-6 md:grid-cols-3">
					{pricing.map((tier) => (
						<Card key={tier.name} className={tier.name === 'Pro' ? 'border-cyan-400/30 bg-cyan-500/10' : ''}>
							<CardHeader>
								<CardTitle>{tier.name}</CardTitle>
								<CardDescription>{tier.price}</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								{tier.items.map((item) => (
									<p key={item} className="flex items-center gap-2 text-sm text-slate-200"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> {item}</p>
								))}
							</CardContent>
						</Card>
					))}
				</section>

				<footer className="flex flex-col gap-3 border-t border-white/10 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
					<p>FinWise AI is designed for responsible borrowing, explainable analytics, and production deployment.</p>
					<div className="flex gap-4">
						<Link href="/login">Login</Link>
						<Link href="/signup">Signup</Link>
						<Link href="/dashboard">Dashboard</Link>
					</div>
				</footer>
			</section>
		</main>
	);
}
