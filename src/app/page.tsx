import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import StatsBar from './components/StatsBar';
import MitraGrid from './components/MitraGrid';
import RecentVacancies from './components/RecentVacancies';
import CTASection from './components/CTASection';

export default function PublicPortalHome() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <MitraGrid />
        <RecentVacancies />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}