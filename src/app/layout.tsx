import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// Panggil file tailwind.css kamu (sesuaikan path foldernya)
import '@/styles/tailwind.css'; // Atau: import '@/app/tailwind.css';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

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
          {/* Tanpa ini, semua toast.success()/toast.error() di seluruh app
              (ApplyFormTab, CVBuilderClient, dll) tidak akan menampilkan
              apa-apa ke user — dipanggil tapi tidak ada UI untuk merendernya. */}
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}