import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export function Checkbox({ className, label, ...props }: CheckboxProps) {
  return (
    <label className={cn('flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3', className)}>
      <input type="checkbox" className="h-4 w-4 rounded border-stone-400" {...props} />
      <span className="text-sm text-stone-700">{label}</span>
    </label>
  );
}
