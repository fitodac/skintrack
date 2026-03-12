import type { ReactNode } from 'react';
import { AppShell } from '@/components/shared/app-shell';
import { requireViewer } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const viewer = await requireViewer();

  return <AppShell viewer={viewer}>{children}</AppShell>;
}
