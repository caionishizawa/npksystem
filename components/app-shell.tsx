'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/builder', label: 'Construtor' },
  { href: '/compare', label: 'Comparar' },
  { href: '/risk', label: 'Laboratório de risco' },
  { href: '/points', label: 'Laboratório de pontos' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-graphite-900 text-slate-100">
      <div className="flex">
        <aside className="hidden min-h-screen w-64 flex-col border-r border-graphite-700 bg-graphite-850/80 p-6 md:flex">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">LoopLab</p>
            <h1 className="mt-2 text-xl font-semibold text-white">Terminal de Loops</h1>
            <Badge className="mt-4" tone="info">
              Pro minimal
            </Badge>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-graphite-700 hover:text-slate-100',
                  pathname === item.href && 'bg-graphite-700 text-slate-100'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto text-xs text-slate-500">
            Não é conselho financeiro. Simulações com hipóteses.
          </div>
        </aside>
        <main className="flex-1">
          <header className="flex items-center justify-between border-b border-graphite-700 bg-graphite-900/80 px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">LoopLab</p>
              <h2 className="text-lg font-semibold text-white">DeFi Looping + Airdrops</h2>
            </div>
            <div className="text-right text-xs text-slate-500">
              Não é conselho financeiro. Resultados podem variar.
            </div>
          </header>
          <div className="px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
