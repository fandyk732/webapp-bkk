import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/tailwind.css';
import { Toaster } from 'sonner';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'BKKMitradudi — Portal Karir & PKL SMK Al Kaaffah Kepanjen',
  description:
    'Portal resmi BKK SMK Al Kaaffah Kepanjen untuk menemukan lowongan PKL dan kerja, mitra industri, serta membuat CV profesional untuk siswa dan alumni.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={plusJakarta.variable}>
      <body className={plusJakarta.className}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-plus-jakarta)',
              fontSize: '0.875rem',
              letterSpacing: '-0.015em',
            },
          }}
        />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fbkkmitradu7039back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.3" /></body>
    </html>
  );
}