'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModeToggle } from '@/components/mode-toggle';
import { listMarkets, listAssets, getMarketSnapshot } from '@/lib/providers';
import { StrategyInput, StrategyResult } from '@/lib/types';
import { simulateStrategy, stressTests } from '@/lib/simulate';
import { useLoopLabStore } from '@/lib/store';

const schema = z.object({
  name: z.string().min(1),
  network: z.enum(['Ethereum', 'Arbitrum', 'Optimism', 'Base']),
  provider: z.enum(['Aave V3', 'Morpho', 'Custom']),
  marketId: z.string().min(1),
  collateralAsset: z.string().min(1),
  debtAsset: z.string().min(1),
  initialCapital: z.coerce.number().min(100),
  riskTarget: z.coerce.number().refine((value) => [15, 25, 35].includes(value))
});

type FormValues = z.infer<typeof schema>;

interface StrategyFormProps {
  onSimulate: (input: StrategyInput, result: StrategyResult) => void;
  onStress: (results: ReturnType<typeof stressTests>) => void;
}

export function StrategyForm({ onSimulate, onStress }: StrategyFormProps) {
  const [mode, setMode] = useState<'simple' | 'pro'>('simple');
  const [provider, setProvider] = useState<'Aave V3' | 'Morpho' | 'Custom'>('Aave V3');
  const [savedId, setSavedId] = useState<string | null>(null);
  const saveStrategy = useLoopLabStore((state) => state.saveStrategy);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: 'Loop ETH/USDC',
      network: 'Ethereum',
      provider: 'Aave V3',
      marketId: 'eth-aave-usdc',
      collateralAsset: 'ETH',
      debtAsset: 'USDC',
      initialCapital: 15000,
      riskTarget: 25
    }
  });

  const values = form.watch();
  const markets = useMemo(() => listMarkets(values.network, provider), [values.network, provider]);
  const assets = useMemo(() => listAssets(values.marketId), [values.marketId]);

  useEffect(() => {
    form.setValue('provider', provider);
  }, [provider, form]);

  useEffect(() => {
    if (markets.length > 0 && !markets.find((market) => market.id === values.marketId)) {
      form.setValue('marketId', markets[0].id);
    }
  }, [markets, values.marketId, form]);

  useEffect(() => {
    const nextAssets = listAssets(values.marketId);
    if (nextAssets.length > 0) {
      form.setValue('collateralAsset', nextAssets[0]);
      form.setValue('debtAsset', nextAssets[nextAssets.length - 1]);
    }
  }, [values.marketId, form]);

  const simulate = form.handleSubmit((data) => {
    const input: StrategyInput = {
      id: crypto.randomUUID(),
      name: data.name,
      network: data.network,
      provider: data.provider,
      marketId: data.marketId,
      collateralAsset: data.collateralAsset,
      debtAsset: data.debtAsset,
      initialCapital: data.initialCapital,
      riskTarget: data.riskTarget as 15 | 25 | 35,
      mode,
      manualLtv: mode === 'pro' ? 0.65 : undefined,
      minHealthFactor: mode === 'pro' ? 1.6 : undefined,
      borrowSpike: mode === 'pro' ? 5 : undefined,
      slippage: mode === 'pro' ? 0.2 : undefined,
      liquidationBonus: mode === 'pro' ? 5 : undefined,
      depegHaircut: mode === 'pro' ? 2 : undefined,
      loopStopThreshold: mode === 'pro' ? 250 : undefined
    };
    const snapshot = getMarketSnapshot(data.marketId);
    const result = simulateStrategy(input, snapshot);
    onSimulate(input, result);
    onStress(stressTests(input, snapshot));
  });

  const save = form.handleSubmit((data) => {
    const id = crypto.randomUUID();
    const input: StrategyInput = {
      id,
      name: data.name,
      network: data.network,
      provider: data.provider,
      marketId: data.marketId,
      collateralAsset: data.collateralAsset,
      debtAsset: data.debtAsset,
      initialCapital: data.initialCapital,
      riskTarget: data.riskTarget as 15 | 25 | 35,
      mode
    };
    saveStrategy(input);
    setSavedId(id);
  });

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Construtor de estratégia</h3>
          <p className="text-xs text-slate-500">Entradas essenciais com profundidade Pro.</p>
        </div>
        <ModeToggle value={mode} onChange={setMode} />
      </div>
      <form className="mt-6 grid gap-4" onSubmit={simulate}>
        <div>
          <label className="text-xs text-slate-400">Nome da estratégia</label>
          <Input {...form.register('name')} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-slate-400">Rede</label>
            <Select {...form.register('network')}>
              {['Ethereum', 'Arbitrum', 'Optimism', 'Base'].map((network) => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-400">Provedor</label>
            <Tabs value={provider} onValueChange={(value) => setProvider(value as typeof provider)}>
              <TabsList>
                {['Aave V3', 'Morpho', 'Custom'].map((item) => (
                  <TabsTrigger key={item} value={item}>
                    {item}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400">Mercado</label>
          <Select {...form.register('marketId')}>
            {markets.map((market) => (
              <option key={market.id} value={market.id}>
                {market.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-slate-400">Ativo colateral</label>
            <Select {...form.register('collateralAsset')}>
              {assets.map((asset) => (
                <option key={asset} value={asset}>
                  {asset}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-400">Ativo de dívida</label>
            <Select {...form.register('debtAsset')}>
              {assets.map((asset) => (
                <option key={asset} value={asset}>
                  {asset}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-slate-400">Capital inicial (USD)</label>
            <Input type="number" step="100" {...form.register('initialCapital')} />
          </div>
          <div>
            <label className="text-xs text-slate-400">Alvo de risco</label>
            <div className="mt-2 space-y-2">
              <input type="hidden" {...form.register('riskTarget')} />
              <input
                type="range"
                min={15}
                max={35}
                step={10}
                value={values.riskTarget}
                onChange={(event) => form.setValue('riskTarget', Number(event.target.value) as 15 | 25 | 35)}
                className="w-full accent-accent-400"
              />
              <p className="text-xs text-slate-500">
                {values.riskTarget === 15 && 'Sobreviver drawdown 15%'}
                {values.riskTarget === 25 && 'Sobreviver drawdown 25%'}
                {values.riskTarget === 35 && 'Sobreviver drawdown 35%'}
              </p>
            </div>
          </div>
        </div>

        {mode === 'pro' && (
          <Accordion type="single" collapsible className="mt-2">
            <AccordionItem value="pro">
              <AccordionTrigger>Parâmetros avançados</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-xs text-slate-400">LTV manual (%)</label>
                    <Input type="number" step="0.1" placeholder="0.65" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Buffer HF mínimo</label>
                    <Input type="number" step="0.1" placeholder="1.6" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Spike de borrow (%)</label>
                    <Input type="number" step="0.1" placeholder="5" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Deslizamento (%)</label>
                    <Input type="number" step="0.1" placeholder="0.2" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Bônus de liquidação (%)</label>
                    <Input type="number" step="0.1" placeholder="5" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Haircut de depeg (%)</label>
                    <Input type="number" step="0.1" placeholder="2" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Limite de parada do loop</label>
                    <Input type="number" step="10" placeholder="250" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Oráculo</label>
                    <Input value={getMarketSnapshot(values.marketId).oracleType} readOnly />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        <div className="flex items-center gap-3">
          <Button type="submit">Simular</Button>
          <Button type="button" variant="secondary" onClick={save}>
            Salvar
          </Button>
        </div>
        {savedId && (
          <p className="text-xs text-slate-400">
            Link compartilhável: <span className="text-accent-300">/share/{savedId}</span>
          </p>
        )}
      </form>
    </Card>
  );
}
