import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PageShell({
  title,
  description,
  actions,
  children,
  className,
}: PageShellProps) {
  return (
    <section className={cn('space-y-6', className)}>
      <header className="flex flex-col gap-4 rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(209,213,219,0.45),_transparent_55%),linear-gradient(135deg,#faf7f2,#f4efe7)] p-8 shadow-sm md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">
            SkinTrack
          </p>
          <h1 className="text-3xl font-semibold text-stone-950">{title}</h1>
          {description ? <p className="max-w-2xl text-sm text-stone-600">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </header>

      {children}
    </section>
  );
}
