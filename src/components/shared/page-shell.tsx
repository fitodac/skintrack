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
    <section className={cn('space-y-10', className)}>
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between px-2 pt-2 pb-6 border-b border-stone-200/50">
        <div className="space-y-3">
          <p className="font-serif text-[10px] font-medium uppercase tracking-[0.4em] text-primary/70">
            skintrack.
          </p>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-stone-900">{title}</h1>
          {description ? <p className="max-w-xl text-[15px] text-stone-500 leading-relaxed">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-4">{actions}</div> : null}
      </header>

      {children}
    </section>
  );
}
