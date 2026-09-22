import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CVBuilderClient from './components/CVBuilderClient';

export default function CVBuilderPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <CVBuilderClient />
      </main>
      <Footer />
    </div>
  );
}