import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-900 outline-none ring-0 transition placeholder:text-stone-400 focus:border-stone-950',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
