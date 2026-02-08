import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const quickLinks = [
  { href: '/builder', label: 'Construtor de estratégia', description: 'Monte loops com métricas ao vivo.' },
  { href: '/compare', label: 'Comparar estratégias', description: 'Compare e ranqueie estratégias.' },
  { href: '/risk', label: 'Laboratório de risco', description: 'Testes de estresse e break-even.' },
  { href: '/points', label: 'Laboratório de pontos', description: 'Simule airdrops e cenários.' }
];

const topStrategies = [
  { name: 'ETH/USDC Loop', metric: 'ROE 9.4%', badge: 'SAFE' },
  { name: 'ARB/USDC Boost', metric: 'ROE 11.1%', badge: 'WATCH' },
  { name: 'OP/WETH Ultra', metric: 'ROE 12.4%', badge: 'DANGER' }
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">LoopLab</h2>
          <p className="mt-4 text-sm text-slate-400">
            Terminal minimalista para estratégias de looping, risco e pontos. Controle em modo simples
            ou aprofunde em Pro.
          </p>
        </div>
        <Card className="scan-bar">
          <CardHeader>
            <div>
              <CardTitle>Radar de mercado</CardTitle>
              <CardDescription>Analisando mercado...</CardDescription>
            </div>
            <Badge tone="info">HUD</Badge>
          </CardHeader>
          <p className="text-xs text-slate-400">
            Recalibrando volatilidade, incentivos e liquidez em tempo real.
          </p>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="transition hover:border-accent-400/60">
              <CardHeader>
                <CardTitle>{link.label}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">Top estratégias hoje</h3>
          <Badge tone="info">Mock</Badge>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {topStrategies.map((strategy) => (
            <Card key={strategy.name}>
              <CardHeader>
                <div>
                  <CardTitle>{strategy.name}</CardTitle>
                  <CardDescription>{strategy.metric}</CardDescription>
                </div>
                <Badge tone={strategy.badge === 'SAFE' ? 'safe' : strategy.badge === 'WATCH' ? 'watch' : 'danger'}>
                  {strategy.badge}
                </Badge>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
