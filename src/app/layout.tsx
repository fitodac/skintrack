import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';
import { SessionWarningProvider } from '@/components/shared/session-warning-provider';
import designConfig from '@/config/design.json';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--app-font-serif',
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--app-font-sans',
});

export const metadata: Metadata = {
  title: 'SkinTrack',
  description: 'Gestión clínica de pacientes y sesiones para cosmiatría.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body
        style={
          {
            '--theme-bg': designConfig.colors.background,
            '--theme-primary': designConfig.colors.primary,
            '--theme-secondary': designConfig.colors.secondary,
          } as React.CSSProperties
        }
      >
        {children}
        <SessionWarningProvider />
      </body>
    </html>
  );
}
