import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// Panggil file tailwind.css kamu (sesuaikan path foldernya)
import '@/styles/tailwind.css'; // Atau: import '@/app/tailwind.css';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BKK SMK Al Kaaffah',
  description: 'Portal Bursa Kerja Khusus & PKL SMK Al Kaaffah Kepanjen',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}