import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-widest border',
  {
    variants: {
      variant: {
        neutral: 'bg-stone-50 text-stone-600 border-stone-200/60',
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
        danger: 'bg-rose-50 text-rose-700 border-rose-200/60',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
