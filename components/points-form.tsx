'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/mode-toggle';
import { useLoopLabStore } from '@/lib/store';
import { PointsModel } from '@/lib/types';

const schema = z.object({
  project: z.string().min(1),
  pointsPerDay: z.coerce.number().min(0),
  days: z.coerce.number().min(1),
  multiplier: z.coerce.number().min(0.1),
  airdropPercent: z.coerce.number().min(0),
  fdvConservative: z.coerce.number().min(0),
  fdvBase: z.coerce.number().min(0),
  fdvBull: z.coerce.number().min(0),
  minPoints: z.coerce.number().min(0),
  maxPoints: z.coerce.number().min(0),
  totalSupply: z.coerce.number().optional(),
  recipients: z.coerce.number().optional(),
  capPerUser: z.coerce.number().optional(),
  sybilDiscount: z.coerce.number().optional(),
  tgeUnlock: z.coerce.number().optional(),
  vestingMonths: z.coerce.number().optional()
});

type FormValues = z.infer<typeof schema>;

export function PointsForm() {
  const [mode, setMode] = useState<'simple' | 'pro'>('simple');
  const [savedId, setSavedId] = useState<string | null>(null);
  const savePoints = useLoopLabStore((state) => state.savePoints);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      project: 'Projeto X',
      pointsPerDay: 120,
      days: 90,
      multiplier: 1,
      airdropPercent: 10,
      fdvConservative: 300000000,
      fdvBase: 700000000,
      fdvBull: 1200000000,
      minPoints: 9000,
      maxPoints: 14000,
      totalSupply: 1000000000,
      recipients: 150000,
      capPerUser: 200000,
      sybilDiscount: 12,
      tgeUnlock: 15,
      vestingMonths: 12
    }
  });

  const values = form.watch();

  const totals = useMemo(() => {
    const total = values.pointsPerDay * values.days * values.multiplier;
    const range = {
      min: values.minPoints,
      max: values.maxPoints
    };
    return { total, range };
  }, [values]);

  const scenarios = useMemo(() => {
    const airdropValue = (fdv: number) => (fdv * (values.airdropPercent / 100)) / 1;
    const valuePerPoint = (fdv: number) => airdropValue(fdv) / Math.max(values.maxPoints, 1);

    return [
      { label: 'Conservador', fdv: values.fdvConservative },
      { label: 'Base', fdv: values.fdvBase },
      { label: 'Bull', fdv: values.fdvBull }
    ].map((scenario) => {
      const vpp = valuePerPoint(scenario.fdv);
      return {
        ...scenario,
        vpp,
        minValue: vpp * values.minPoints,
        maxValue: vpp * values.maxPoints
      };
    });
  }, [values]);

  const confidence =
    values.minPoints === 0 || values.maxPoints === 0
      ? 'BAIXA'
      : values.minPoints !== values.maxPoints
        ? 'ALTA'
        : 'MÉDIA';

  const onSave = form.handleSubmit((data) => {
    const id = crypto.randomUUID();
    const model: PointsModel = {
      id,
      project: data.project,
      pointsPerDay: data.pointsPerDay,
      days: data.days,
      multiplier: data.multiplier,
      airdropPercent: data.airdropPercent,
      fdv: {
        conservative: data.fdvConservative,
        base: data.fdvBase,
        bull: data.fdvBull
      },
      range: {
        minPoints: data.minPoints,
        maxPoints: data.maxPoints
      },
      pro: {
        totalSupply: data.totalSupply,
        recipients: data.recipients,
        capPerUser: data.capPerUser,
        sybilDiscount: data.sybilDiscount,
        tgeUnlock: data.tgeUnlock,
        vestingMonths: data.vestingMonths
      }
    };
    savePoints(model);
    setSavedId(id);
  });

  useEffect(() => {
    form.setValue('maxPoints', Math.max(values.minPoints, values.maxPoints));
  }, [values.minPoints, values.maxPoints, form]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Entradas - Points/Airdrops</h3>
            <p className="text-xs text-slate-500">Modo simples e Pro para ajustes avançados.</p>
          </div>
          <ModeToggle value={mode} onChange={setMode} />
        </div>
        <form className="mt-6 grid gap-4" onSubmit={onSave}>
          <div>
            <label className="text-xs text-slate-400">Projeto</label>
            <Input {...form.register('project')} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs text-slate-400">Points por dia</label>
              <Input type="number" step="1" {...form.register('pointsPerDay')} />
            </div>
            <div>
              <label className="text-xs text-slate-400">Dias de farming</label>
              <Input type="number" step="1" {...form.register('days')} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs text-slate-400">Multiplicador</label>
              <Input type="number" step="0.1" {...form.register('multiplier')} />
            </div>
            <div>
              <label className="text-xs text-slate-400">% do FDV para airdrop</label>
              <Input type="number" step="0.1" {...form.register('airdropPercent')} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-xs text-slate-400">FDV conservador</label>
              <Input type="number" step="1000" {...form.register('fdvConservative')} />
            </div>
            <div>
              <label className="text-xs text-slate-400">FDV base</label>
              <Input type="number" step="1000" {...form.register('fdvBase')} />
            </div>
            <div>
              <label className="text-xs text-slate-400">FDV bull</label>
              <Input type="number" step="1000" {...form.register('fdvBull')} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs text-slate-400">Pontos mínimos</label>
              <Input type="number" step="1" {...form.register('minPoints')} />
            </div>
            <div>
              <label className="text-xs text-slate-400">Pontos máximos</label>
              <Input type="number" step="1" {...form.register('maxPoints')} />
            </div>
          </div>

          {mode === 'pro' && (
            <div className="grid gap-4 border-t border-graphite-700 pt-4">
              <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500">Ajustes avançados</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs text-slate-400">Oferta total</label>
                  <Input type="number" step="1000" {...form.register('totalSupply')} />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Estimativa de recipients</label>
                  <Input type="number" step="100" {...form.register('recipients')} />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Cap por usuário</label>
                  <Input type="number" step="100" {...form.register('capPerUser')} />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Desconto Sybil %</label>
                  <Input type="number" step="0.1" {...form.register('sybilDiscount')} />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Unlock no TGE %</label>
                  <Input type="number" step="0.1" {...form.register('tgeUnlock')} />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Meses de vesting</label>
                  <Input type="number" step="1" {...form.register('vestingMonths')} />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit">Salvar modelo</Button>
          </div>
          {savedId && (
            <span className="text-xs text-slate-500">Link compartilhável: /share/{savedId}</span>
          )}
        </form>
      </Card>

      <div className="space-y-4">
        <Card>
          <h3 className="text-sm font-semibold text-slate-200">Resumo</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-400">
            <p>Total de pontos projetado: <span className="text-white">{totals.total.toFixed(0)}</span></p>
            <p>Range de pontos: <span className="text-white">{totals.range.min} - {totals.range.max}</span></p>
            <p>Confiança: <span className="text-white">{confidence}</span></p>
          </div>
        </Card>
        {scenarios.map((scenario) => (
          <Card key={scenario.label}>
            <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500">{scenario.label}</h4>
            <div className="mt-2 text-sm text-slate-400">
              <p>Valor por point: <span className="text-white">${scenario.vpp.toFixed(6)}</span></p>
              <p>Seu airdrop (range): <span className="text-white">${scenario.minValue.toFixed(0)} - ${scenario.maxValue.toFixed(0)}</span></p>
            </div>
          </Card>
        ))}
        {mode === 'pro' && (
          <Card>
            <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500">Linha do tempo de unlock</h4>
            <p className="mt-2 text-xs text-slate-400">
              Unlock no TGE {values.tgeUnlock}% com vesting linear de {values.vestingMonths} meses.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
