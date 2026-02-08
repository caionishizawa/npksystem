'use client';

import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { cn } from '@/lib/utils';

interface ModeToggleProps {
  value: 'simple' | 'pro';
  onChange: (value: 'simple' | 'pro') => void;
}

export function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next as 'simple' | 'pro');
      }}
      className="inline-flex rounded-full border border-graphite-700 bg-graphite-800 p-1"
    >
      {['simple', 'pro'].map((mode) => (
        <ToggleGroup.Item
          key={mode}
          value={mode}
          className={cn(
            'rounded-full px-4 py-1 text-xs uppercase tracking-[0.2em] transition',
            value === mode ? 'bg-accent-500 text-white shadow-glow' : 'text-slate-400'
          )}
        >
          {mode === 'simple' ? 'Modo simples' : 'Modo pro'}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
