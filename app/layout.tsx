import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Raschini — Beyond the Season',
  description: 'Luxury menswear digital experience by Raschini.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0d0b09',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
