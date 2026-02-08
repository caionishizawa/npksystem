import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'bg-accent-500 text-white shadow-glow hover:bg-accent-400',
        variant === 'secondary' && 'bg-graphite-700 text-slate-100 hover:bg-graphite-600',
        variant === 'ghost' && 'bg-transparent text-slate-200 hover:bg-graphite-700',
        size === 'sm' && 'h-8 px-3 text-xs',
        size === 'md' && 'h-10 px-4 text-sm',
        size === 'lg' && 'h-12 px-6 text-base',
        className
      )}
      {...props}
    />
  );
}
