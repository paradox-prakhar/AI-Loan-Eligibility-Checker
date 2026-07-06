import { DashboardShell } from '@/components/dashboard-shell';
import { DashboardClient } from '@/components/dashboard-client';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardClient />
    </DashboardShell>
  );
}