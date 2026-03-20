import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export function Checkbox({ className, label, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        'group flex items-center gap-3 rounded-2xl bg-white/35 px-4 py-3 text-sm text-stone-700 transition hover:bg-white/55 hover:text-stone-900',
        className,
      )}
    >
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-stone-400 accent-primary focus:ring-primary"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
