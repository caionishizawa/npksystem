import { StrategyResult } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface ResultsCardsProps {
  result?: StrategyResult;
}

export function ResultsCards({ result }: ResultsCardsProps) {
  if (!result) {
    return (
      <Card className="text-sm text-slate-400">
        Simule uma estratégia para ver os indicadores principais.
      </Card>
    );
  }

  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Net ROE (orgânico)</p>
        <p className="mt-3 text-3xl font-semibold text-white">{formatPercent(result.netROE)}</p>
      </Card>
      <Card>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Fator de saúde</p>
        <p className="mt-3 text-3xl font-semibold text-white">{result.healthFactor.toFixed(2)}</p>
      </Card>
      <Card>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Distância até liq.</p>
        <p className="mt-3 text-3xl font-semibold text-white">{formatPercent(result.distanceToLiq)}</p>
      </Card>
      <Card>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Preço de liquidação</p>
        <p className="mt-3 text-3xl font-semibold text-white">{result.liquidationPrice.toFixed(2)}x</p>
      </Card>
      <Card>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Alavancagem efetiva</p>
        <p className="mt-3 text-3xl font-semibold text-white">{result.leverage.toFixed(2)}x</p>
      </Card>
    </div>
  );
}
