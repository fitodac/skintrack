import * as React from 'react';
import { cn } from '@/lib/utils';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-28 w-full rounded-3xl border border-stone-300 bg-white px-5 py-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-primary focus:ring-1 focus:ring-primary/20',
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
