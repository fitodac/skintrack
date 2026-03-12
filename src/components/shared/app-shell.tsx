import Link from 'next/link';
import type { ReactNode } from 'react';
import { Users, UserCircle2, ClipboardList, LogOut } from 'lucide-react';
import type { Viewer } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { signOut } from '@/lib/actions/auth-actions';

interface AppShellProps {
  viewer: Viewer;
  children: ReactNode;
}

const commonLinks = [
  { href: '/patients', label: 'Pacientes', icon: ClipboardList },
  { href: '/profile', label: 'Perfil', icon: UserCircle2 },
];

export function AppShell({ viewer, children }: AppShellProps) {
  const links =
    viewer.role === 'superadmin'
      ? [...commonLinks, { href: '/admin/users', label: 'Usuarios', icon: Users }]
      : commonLinks;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f4ef_0%,#f3eee7_45%,#efebe4_100%)]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[32px] bg-stone-950 px-6 py-8 text-stone-50 shadow-xl">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.36em] text-stone-400">SkinTrack</p>
            <div>
              <h1 className="text-2xl font-semibold">{viewer.name}</h1>
              <p className="text-sm text-stone-300">{viewer.professional_title ?? viewer.email}</p>
            </div>
            <Badge variant={viewer.role === 'superadmin' ? 'warning' : 'neutral'}>
              {viewer.role}
            </Badge>
          </div>

          <nav className="mt-10 space-y-2">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-stone-200 transition hover:bg-stone-800 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <form action={signOut} className="mt-10">
            <Button
              type="submit"
              variant="secondary"
              className="w-full justify-start bg-stone-100 text-stone-950"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </form>
        </aside>

        <main className="py-2">{children}</main>
      </div>
    </div>
  );
}
