import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'safe' | 'watch' | 'danger' | 'info';
}

export function Badge({ tone = 'info', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]',
        tone === 'safe' && 'border-neon-green/40 text-neon-green',
        tone === 'watch' && 'border-neon-amber/40 text-neon-amber',
        tone === 'danger' && 'border-neon-red/40 text-neon-red',
        tone === 'info' && 'border-accent-400/40 text-accent-300',
        className
      )}
      {...props}
    />
  );
}
