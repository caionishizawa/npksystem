import { Card } from '@/components/ui/card';
import { StrategyResult } from '@/lib/types';

interface RiskPanelProps {
  result?: StrategyResult;
}

export function RiskPanel({ result }: RiskPanelProps) {
  const risks = result
    ? [
        result.healthFactor < 1.5 ? 'Health factor abaixo do buffer recomendado.' : 'HF dentro do buffer recomendado.',
        result.distanceToLiq < 0.2 ? 'Pouca distância até a liquidação.' : 'Distância confortável até a liquidação.',
        result.netROE < 0.05 ? 'ROE orgânico baixo para o risco.' : 'ROE orgânico saudável para o risco.'
      ]
    : ['Simule uma estratégia para gerar alertas.'];

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-200">Painel de risco</h3>
      <ul className="mt-4 space-y-2 text-xs text-slate-400">
        {risks.map((risk) => (
          <li key={risk}>• {risk}</li>
        ))}
      </ul>
    </Card>
  );
}
