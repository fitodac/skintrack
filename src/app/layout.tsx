import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { SessionWarningProvider } from '@/components/shared/session-warning-provider';

export const metadata: Metadata = {
  title: 'SkinTrack',
  description: 'Gestión clínica de pacientes y sesiones para cosmiatría.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <SessionWarningProvider />
      </body>
    </html>
  );
}
