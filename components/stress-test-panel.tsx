import { Card } from '@/components/ui/card';
import { StressResult } from '@/lib/types';

interface StressTestPanelProps {
  results?: StressResult[];
}

export function StressTestPanel({ results }: StressTestPanelProps) {
  if (!results || results.length === 0) {
    return (
      <Card className="text-xs text-slate-400">
        Execute uma simulação para ver os stress tests rápidos.
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-200">Testes de estresse rápidos</h3>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
        {['Preço -10%', 'Preço -20%', 'Preço -30%', 'Borrow +5%', 'Borrow +10%', 'Depeg 1%', 'Depeg 3%', 'Depeg 5%'].map(
          (label) => (
            <span
              key={label}
              className="rounded-full border border-graphite-700 bg-graphite-800 px-2 py-1"
            >
              {label}
            </span>
          )
        )}
      </div>
      <div className="mt-4 grid gap-3">
        {results.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-graphite-700 bg-graphite-800 px-3 py-2 text-xs text-slate-300"
          >
            <div className="flex items-center justify-between">
              <span>{item.label}</span>
              <span>HF {item.healthFactor.toFixed(2)}</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              ROE {`${(item.netROE * 100).toFixed(2)}%`}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
