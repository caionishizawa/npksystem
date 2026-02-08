import { Card } from '@/components/ui/card';
import { StrategyResult } from '@/lib/types';

interface LoopDetailsTableProps {
  result?: StrategyResult;
}

export function LoopDetailsTable({ result }: LoopDetailsTableProps) {
  if (!result) return null;

  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-200">Detalhamento do loop</h3>
      <div className="mt-4 grid gap-3 text-xs text-slate-400">
        <div className="flex items-center justify-between">
          <span>APY de supply</span>
          <span>{formatPercent(result.supplyAPY)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>APY de borrow</span>
          <span>{formatPercent(result.borrowAPY)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Incentivos líquidos</span>
          <span>{formatPercent(result.incentivesNet)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Taxas estimadas</span>
          <span>{formatPercent(result.fees)}</span>
        </div>
      </div>
    </Card>
  );
}
