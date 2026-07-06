import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Bell, CreditCard, LayoutDashboard, LineChart, ShieldCheck } from 'lucide-react';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Credit Health', icon: ShieldCheck },
  { label: 'Loans', icon: CreditCard },
  { label: 'Insights', icon: LineChart },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.32),transparent_28%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.18),transparent_24%),linear-gradient(180deg,rgba(11,17,32,1),rgba(11,17,32,0.92))]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1600px] gap-6 p-4 md:p-6 lg:p-8">
        <aside className="hidden w-72 shrink-0 flex-col gap-6 lg:flex">
          <Card className="border-white/10 bg-white/5">
            <CardContent className="space-y-6 p-0">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-cyan-300">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">FinWise AI</p>
                  <h1 className="text-xl font-semibold">Command Center</h1>
                </div>
              </div>
              <div className="space-y-2">
                {navItems.map((item) => (
                  <button key={item.label} className="flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/10">
                    <item.icon className="h-4 w-4 text-cyan-300" />
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <Badge className="border-emerald-400/30 bg-emerald-500/20 text-emerald-200">Live</Badge>
                <p className="mt-3 text-sm text-emerald-50/90">Your portfolio is in a low-risk posture with stable cash flow and improving credit momentum.</p>
              </div>
            </CardContent>
          </Card>
          <Button variant="secondary" className="justify-between">
            Notifications
            <Bell className="h-4 w-4" />
          </Button>
        </aside>
        <main className="flex-1 overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          {children}
        </main>
      </div>
    </div>
  );
}