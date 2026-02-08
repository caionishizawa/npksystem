'use client';

import { useEffect, useState } from 'react';
import { StrategyCompareGrid } from '@/components/strategy-compare-grid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useLoopLabStore } from '@/lib/store';
import { getMarketSnapshot } from '@/lib/providers';
import { simulateStrategy } from '@/lib/simulate';
import { exportSnapshot, importSnapshot } from '@/lib/storage';

export default function ComparePage() {
  const { strategies, hydrate } = useLoopLabStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [jsonValue, setJsonValue] = useState('');

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const items = strategies
    .filter((strategy) => selected.includes(strategy.id))
    .map((strategy) => ({
      input: strategy,
      result: simulateStrategy(strategy, getMarketSnapshot(strategy.marketId))
    }));

  const exportCsv = () => {
    const rows = items.map((item) =>
      [
        item.input.name,
        item.input.provider,
        item.result.netROE,
        item.result.healthFactor,
        item.result.distanceToLiq
      ].join(',')
    );
    const header = 'nome,provider,net_roe,health_factor,distancia_liq';
    const blob = new Blob([header, '\n', rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'looplab-compare.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    setJsonValue(exportSnapshot());
  };

  const handleImportJson = () => {
    importSnapshot(jsonValue);
    hydrate();
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-sm font-semibold text-slate-200">Selecionar estratégias</h3>
        <p className="mt-2 text-xs text-slate-500">Escolha estratégias salvas ou presets rápidos.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {strategies.length === 0 && (
            <span className="text-xs text-slate-400">Nenhuma estratégia salva ainda.</span>
          )}
          {strategies.map((strategy) => (
            <Button
              key={strategy.id}
              variant={selected.includes(strategy.id) ? 'primary' : 'secondary'}
              size="sm"
              onClick={() =>
                setSelected((prev) =>
                  prev.includes(strategy.id)
                    ? prev.filter((id) => id !== strategy.id)
                    : [...prev, strategy.id]
                )
              }
            >
              {strategy.name}
            </Button>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="ghost" size="sm" onClick={exportCsv}>
            Exportar CSV
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-slate-200">Importar / Exportar JSON</h3>
        <p className="mt-2 text-xs text-slate-500">
          Portabilidade local para snapshots de estratégias e modelos de pontos.
        </p>
        <div className="mt-4 space-y-3">
          <Textarea
            placeholder="Cole aqui um snapshot JSON para importar."
            value={jsonValue}
            onChange={(event) => setJsonValue(event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={handleExportJson}>
              Exportar JSON
            </Button>
            <Button size="sm" onClick={handleImportJson}>
              Importar JSON
            </Button>
          </div>
        </div>
      </Card>

      <StrategyCompareGrid strategies={items} />
    </div>
  );
}
