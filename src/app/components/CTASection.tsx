import React from 'react';
import Link from 'next/link';
import { FileText, Briefcase, ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CV Builder CTA */}
        <div className="relative overflow-hidden bg-primary rounded-3xl p-8 flex flex-col gap-4">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
              <FileText size={22} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Buat CV Profesional</h3>
            <p className="text-white/75 text-sm leading-relaxed mb-5">
              Generate CV standar BKK secara otomatis. Isi data sekali, unduh CV siap kirim ke puluhan mitra industri.
            </p>
            <Link
              href="/cv-builder"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary rounded-xl font-semibold text-sm hover:bg-white/90 transition-all active:scale-95"
            >
              Mulai Buat CV
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Job Board CTA */}
        <div className="relative overflow-hidden bg-foreground rounded-3xl p-8 flex flex-col gap-4">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
              <Briefcase size={22} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Jelajahi Lowongan PKL & Kerja</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              33 lowongan aktif dari 47 mitra industri terpercaya. Filter berdasarkan jurusan, lokasi, dan jenis kerjasama.
            </p>
            <Link
              href="/job-pkl-board"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent/90 transition-all active:scale-95"
            >
              Lihat Lowongan
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}