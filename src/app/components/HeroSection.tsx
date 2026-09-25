'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Sparkles, ArrowRight, GraduationCap, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) router.push(`/job-pkl-board?q=${query}`);
  };

  return (
    <section className="relative pt-28 pb-16 overflow-hidden hero-gradient bg-grid-pattern">
      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Award size={12} />
            Bursa Kerja Khusus (BKK) SMK Al Kaaffah Kepanjen
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-5">
            Temukan <span className="text-primary">PKL & Karir</span> Impianmu Bersama{' '}
            <span className="text-accent">Mitra Industri</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Portal resmi BKK menghubungkan siswa dan alumni SMK Al Kaaffah Kepanjen dengan perusahaan mitra.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
          <div className="flex gap-2 glass rounded-2xl p-2 shadow-glass">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search size={18} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari lowongan PKL, kerja, atau mitra industri..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shrink-0"
            >
              Cari
            </button>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/job-pkl-board"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm"
          >
            <GraduationCap size={16} />
            Lihat Semua Lowongan
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
}