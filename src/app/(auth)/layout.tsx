import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,113,108,0.12),transparent_40%),linear-gradient(180deg,#f7f2eb_0%,#ece5dc_100%)]">{children}</div>;
}
