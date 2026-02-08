'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ResultsCards } from '@/components/results-cards';
import { RiskPanel } from '@/components/risk-panel';
import { StressTestPanel } from '@/components/stress-test-panel';
import { LoopDetailsTable } from '@/components/loop-details-table';
import { StrategyForm } from '@/components/strategy-form';
import { StrategyInput, StrategyResult, StressResult } from '@/lib/types';

export default function BuilderPage() {
  const [result, setResult] = useState<StrategyResult | undefined>(undefined);
  const [stress, setStress] = useState<StressResult[]>([]);
  const [input, setInput] = useState<StrategyInput | undefined>(undefined);

  useEffect(() => {
    setStress([]);
  }, [input]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1.4fr_0.9fr]">
      <div className="space-y-6">
        <StrategyForm
          onSimulate={(nextInput, nextResult) => {
            setInput(nextInput);
            setResult(nextResult);
          }}
          onStress={(results) => setStress(results)}
        />
        <Card className="text-xs text-slate-400">
          Não é conselho financeiro. Simulações usam hipóteses; resultados podem variar.
        </Card>
      </div>
      <div className="space-y-6">
        <ResultsCards result={result} />
        <LoopDetailsTable result={result} />
        <Card>
          <details>
            <summary className="cursor-pointer text-sm font-semibold text-slate-200">
              Upside especulativo (Points/Airdrops)
            </summary>
            <p className="mt-2 text-xs text-slate-400">
              Seção colapsada. Ative no Laboratório de pontos para modelar cenários detalhados.
            </p>
          </details>
        </Card>
        {result && (
          <Card>
            <details>
              <summary className="cursor-pointer text-sm font-semibold text-slate-200">
                Premissas
              </summary>
              <div className="mt-3 space-y-2 text-xs text-slate-400">
                {Object.entries(result.assumptions).map(([key, value]) => (
                  <p key={key}>
                    {key}: {value}
                  </p>
                ))}
              </div>
            </details>
          </Card>
        )}
      </div>
      <div className="space-y-6">
        <RiskPanel result={result} />
        <StressTestPanel results={stress} />
        <Card>
          <h3 className="text-sm font-semibold text-slate-200">Planejador de unwind</h3>
          <p className="mt-2 text-xs text-slate-400">
            Para restaurar o HF alvo, repague $8.200 e retire $3.400 (estimado).
          </p>
        </Card>
      </div>
    </div>
  );
}
