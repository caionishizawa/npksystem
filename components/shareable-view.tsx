import { Card } from '@/components/ui/card';
import { PointsModel, StrategyInput } from '@/lib/types';

interface ShareableViewProps {
  strategy?: StrategyInput;
  points?: PointsModel;
}

export function ShareableView({ strategy, points }: ShareableViewProps) {
  if (strategy) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-white">{strategy.name}</h3>
        <p className="mt-2 text-xs text-slate-500">
          {strategy.network} • {strategy.provider} • {strategy.marketId}
        </p>
        <div className="mt-4 grid gap-2 text-sm text-slate-400">
          <p>Colateral: {strategy.collateralAsset}</p>
          <p>Dívida: {strategy.debtAsset}</p>
          <p>Capital inicial: ${strategy.initialCapital.toLocaleString()}</p>
          <p>Alvo de risco: drawdown {strategy.riskTarget}%</p>
        </div>
      </Card>
    );
  }

  if (points) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-white">{points.project}</h3>
        <p className="mt-2 text-xs text-slate-500">Modelo de pontos salvo</p>
        <div className="mt-4 grid gap-2 text-sm text-slate-400">
          <p>Points/dia: {points.pointsPerDay}</p>
          <p>Dias: {points.days}</p>
          <p>Multiplicador: {points.multiplier}</p>
          <p>Range de pontos: {points.range.minPoints} - {points.range.maxPoints}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="text-sm text-slate-400">
      Nenhum modelo encontrado. Verifique se o ID está correto.
    </Card>
  );
}
