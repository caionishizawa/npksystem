'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ...props }: AccordionPrimitive.AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      className={cn('rounded-lg border border-graphite-700 bg-graphite-850', className)}
      {...props}
    />
  );
}

export function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        className={cn(
          'flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-slate-200',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, ...props }: AccordionPrimitive.AccordionContentProps) {
  return (
    <AccordionPrimitive.Content className={cn('px-4 pb-4 text-sm text-slate-300', className)} {...props} />
  );
}
