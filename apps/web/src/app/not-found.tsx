import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12 text-center">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">FinWise AI</p>
        <h1 className="text-4xl font-semibold text-white">Page not found</h1>
        <p className="text-slate-300">The requested route does not exist in this workspace.</p>
        <Link className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950" href="/">Return home</Link>
      </div>
    </main>
  );
}