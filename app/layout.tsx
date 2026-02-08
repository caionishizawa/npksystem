import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'LoopLab',
  description: 'Terminal profissional para estratégias de looping e pontos.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
