'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { Users, UserCircle2, ClipboardList, LogOut, Menu } from 'lucide-react';
import type { Viewer } from '@/lib/auth';
import { signOut } from '@/lib/actions/auth-actions';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface AppShellProps {
  viewer: Viewer;
  children: ReactNode;
}

const commonLinks = [
  { href: '/patients', label: 'Pacientes', icon: ClipboardList },
];

export function AppShell({ viewer, children }: AppShellProps) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const links =
    viewer.role === 'superadmin'
      ? [...commonLinks, { href: '/admin/users', label: 'Usuarios', icon: Users }]
      : commonLinks;

  const sidebarContent = (opts?: { closeOnNavigate?: () => void }) => (
    <div className="flex h-full flex-col justify-between py-8">
      <div>
        <div className="px-6 mb-14">
          <p className="font-serif text-3xl italic tracking-tight text-primary">skintrack.</p>
        </div>

        <nav className="space-y-2 px-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={opts?.closeOnNavigate}
                className={cn(
                  'group flex items-center gap-4 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300',
                  isActive
                    ? 'bg-primary text-white! shadow-[0_12px_40px_rgba(51,75,66,0.25)] ring-1 ring-primary/20'
                    : 'text-stone-600 hover:bg-white/55 hover:text-primary hover:translate-x-1',
                )}
              >
                <Icon className={cn('h-5 w-5', isActive ? 'opacity-100' : 'opacity-50')} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2 px-2 pt-6">
        <Link
          href="/profile"
          onClick={opts?.closeOnNavigate}
          className={cn(
            'group flex items-center gap-4 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300',
            pathname.startsWith('/profile')
              ? 'bg-primary text-white! shadow-[0_12px_40px_rgba(51,75,66,0.25)] ring-1 ring-primary/20'
              : 'text-stone-500 hover:text-primary hover:translate-x-1',
          )}
        >
          <UserCircle2
            className={cn('h-5 w-5', pathname.startsWith('/profile') ? 'opacity-100' : 'opacity-50')}
          />
          Perfil
        </Link>

        <form action={signOut}>
          <button
            type="submit"
            className="group flex w-full items-center gap-4 rounded-full px-5 py-3 text-sm font-semibold text-stone-500 transition-all duration-300 hover:text-primary hover:translate-x-1"
          >
            <LogOut className="h-5 w-5 opacity-50" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas font-sans">
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 lg:py-8">
        <div className="flex items-center justify-between pb-6 lg:hidden">
          <p className="font-serif text-2xl italic tracking-tight text-primary">skintrack.</p>
          <Dialog open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-11 w-11 rounded-full p-0">
                <Menu className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="left-0 top-0 h-screen w-screen -translate-x-0 -translate-y-0 rounded-none bg-canvas p-0">
              <div className="mx-auto h-full max-w-7xl px-6">
                {sidebarContent({ closeOnNavigate: () => setIsMobileNavOpen(false) })}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside className="hidden lg:block">{sidebarContent()}</aside>

          <main className="py-6 px-4 md:px-8 bg-white/40 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-white/60 backdrop-blur-3xl min-h-[85vh]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
