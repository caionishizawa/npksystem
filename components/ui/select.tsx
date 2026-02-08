import { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-md border border-graphite-700 bg-graphite-800 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-400',
        className
      )}
      {...props}
    />
  );
}
