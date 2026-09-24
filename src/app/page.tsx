import React from 'react';
import HeroSection from './components/HeroSection';
import StatsBar from './components/StatsBar';
import MitraGrid from './components/MitraGrid';
import RecentVacancies from './components/RecentVacancies';
import CTASection from './components/CTASection';

export default function PublicPortalHome() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <MitraGrid />
      <RecentVacancies />
      <CTASection />
    </>
  );
}