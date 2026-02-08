import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StrategyInput, StrategyResult } from '@/lib/types';

interface StrategyCompareGridProps {
  strategies: Array<{ input: StrategyInput; result: StrategyResult }>;
}

export function StrategyCompareGrid({ strategies }: StrategyCompareGridProps) {
  if (strategies.length === 0) {
    return <Card className="text-sm text-slate-400">Adicione estratégias para comparar.</Card>;
  }

  const topRoe = Math.max(...strategies.map((item) => item.result.netROE));
  const topSafety = Math.max(...strategies.map((item) => item.result.distanceToLiq));
  const topRar = Math.max(
    ...strategies.map((item) => item.result.netROE / Math.max(item.result.distanceToLiq, 0.01))
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {strategies.map((item) => {
        const rar = item.result.netROE / Math.max(item.result.distanceToLiq, 0.01);
        return (
          <Card key={item.input.id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.input.provider}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{item.input.name}</h3>
                <p className="text-xs text-slate-400">{item.input.marketId}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {item.result.netROE === topRoe && <Badge tone="info">Maior ROE</Badge>}
                {item.result.distanceToLiq === topSafety && <Badge tone="safe">Mais seguro</Badge>}
                {rar === topRar && <Badge tone="watch">Melhor risco/retorno</Badge>}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-400">
              <div>
                <p>Net ROE</p>
                <p className="text-base text-white">{(item.result.netROE * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p>RAR</p>
                <p className="text-base text-white">{rar.toFixed(2)}</p>
              </div>
              <div>
                <p>HF</p>
                <p className="text-base text-white">{item.result.healthFactor.toFixed(2)}</p>
              </div>
              <div>
                <p>Distância liq.</p>
                <p className="text-base text-white">{(item.result.distanceToLiq * 100).toFixed(1)}%</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
