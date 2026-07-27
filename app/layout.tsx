import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-display',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const sans = Manrope({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Raschini — Сила спокойствия',
  description: 'Неаполитанское портновское искусство и современный стиль Raschini.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0d0b09',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
