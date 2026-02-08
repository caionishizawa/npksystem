'use client';

import { useEffect, useMemo, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useLoopLabStore } from '@/lib/store';
import { getMarketSnapshot } from '@/lib/providers';
import { breakEvenBorrowRate, simulateStrategy } from '@/lib/simulate';

export default function RiskLabPage() {
  const { strategies, hydrate } = useLoopLabStore();
  const [strategyId, setStrategyId] = useState<string>('');
  const [metric, setMetric] = useState<'roe' | 'hf'>('roe');

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const strategy = strategies.find((item) => item.id === strategyId) ?? strategies[0];

  useEffect(() => {
    if (strategy && !strategyId) {
      setStrategyId(strategy.id);
    }
  }, [strategy, strategyId]);

  const snapshot = strategy ? getMarketSnapshot(strategy.marketId) : undefined;
  const result = strategy && snapshot ? simulateStrategy(strategy, snapshot) : undefined;

  const chartData = useMemo(() => {
    if (!strategy || !snapshot) return [];
    if (metric === 'roe') {
      return Array.from({ length: 10 }).map((_, index) => {
        const ltv = 0.4 + index * 0.04;
        const adjusted = { ...strategy, manualLtv: ltv };
        const simulated = simulateStrategy(adjusted, snapshot);
        return {
          ltv: Math.round(ltv * 100),
          roe: simulated.netROE * 100
        };
      });
    }
    const base = simulateStrategy(strategy, snapshot);
    return Array.from({ length: 9 }).map((_, index) => {
      const price = 0.7 + index * 0.05;
      return {
        price: Number(price.toFixed(2)),
        hf: base.healthFactor * price
      };
    });
  }, [strategy, snapshot, metric]);

  const stressMatrix = useMemo(() => {
    if (!strategy || !snapshot) return [];
    return [
      { label: 'Preço -10%', hf: baseHealth(strategy, snapshot, 0.9) },
      { label: 'Preço -20%', hf: baseHealth(strategy, snapshot, 0.8) },
      { label: 'Borrow +10%', hf: baseHealth(strategy, snapshot, 1) - 0.1 }
    ];
  }, [strategy, snapshot]);

  function baseHealth(current: typeof strategy, snap: typeof snapshot, priceMultiplier: number) {
    if (!current || !snap) return 0;
    const base = simulateStrategy(current, snap);
    return base.healthFactor * priceMultiplier;
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-sm font-semibold text-slate-200">Laboratório de risco</h3>
        <p className="mt-2 text-xs text-slate-500">Testes de estresse, break-even e sensibilidade.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs text-slate-400">Estratégia salva</label>
            <Select value={strategyId} onChange={(event) => setStrategyId(event.target.value)}>
              {strategies.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-400">Sensibilidade</label>
            <div className="mt-2 flex gap-2">
              <Button
                size="sm"
                variant={metric === 'roe' ? 'primary' : 'secondary'}
                onClick={() => setMetric('roe')}
              >
                ROE vs LTV
              </Button>
              <Button
                size="sm"
                variant={metric === 'hf' ? 'primary' : 'secondary'}
                onClick={() => setMetric('hf')}
              >
                HF vs preço
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500">Break-even do borrow</h4>
          <p className="mt-3 text-2xl font-semibold text-white">
            {result && snapshot
              ? `${(breakEvenBorrowRate(strategy, snapshot) * 100).toFixed(2)}%`
              : '--'}
          </p>
        </Card>
        <Card>
          <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500">Matriz de stress</h4>
          <p className="mt-3 text-sm text-slate-400">
            {result ? 'Resumo rápido de stress.' : 'Nenhuma estratégia carregada.'}
          </p>
          {stressMatrix.length > 0 && (
            <div className="mt-3 space-y-2 text-xs text-slate-400">
              {stressMatrix.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <span>HF {item.hf.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500">Resumo</h4>
          <p className="mt-3 text-sm text-slate-400">
            {result
              ? `HF ${result.healthFactor.toFixed(2)} · ROE ${(result.netROE * 100).toFixed(2)}%`
              : 'Selecione uma estratégia.'}
          </p>
        </Card>
      </div>

      <Card>
        <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500">Gráfico de sensibilidade</h4>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey={metric === 'roe' ? 'ltv' : 'price'} stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1f2937',
                  fontSize: '12px'
                }}
              />
              <Line type="monotone" dataKey={metric} stroke="#6d8dff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
