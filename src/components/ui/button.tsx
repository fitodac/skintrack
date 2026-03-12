'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-stone-950 px-4 py-2 text-stone-50 hover:bg-stone-800',
        secondary: 'bg-stone-200 px-4 py-2 text-stone-900 hover:bg-stone-300',
        outline: 'border border-stone-300 bg-white px-4 py-2 text-stone-900 hover:bg-stone-50',
        ghost: 'px-3 py-2 text-stone-700 hover:bg-stone-100',
        danger: 'bg-rose-600 px-4 py-2 text-white hover:bg-rose-500',
      },
      size: {
        default: 'h-10',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
