import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <AppLogo size={36} />
              <div className="flex flex-col leading-none">
                <span className="font-bold text-sm text-white">BKKMitradudi</span>
                <span className="text-[10px] text-white/60 font-medium">SMK Al Kaaffah Kepanjen</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Portal resmi Bursa Kerja Khusus (BKK) SMK Al Kaaffah Kepanjen — menghubungkan siswa dan alumni dengan mitra industri terpercaya untuk PKL dan penempatan kerja.
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <div className="flex items-start gap-2.5 text-white/60 text-sm">
                <MapPin size={14} className="mt-0.5 shrink-0 text-accent" />
                <span>Jl. Raya Kepanjen No.XX, Kepanjen, Kab. Malang, Jawa Timur 65163</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/60 text-sm">
                <Phone size={14} className="shrink-0 text-accent" />
                <span>(0341) 395-XXX</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/60 text-sm">
                <Mail size={14} className="shrink-0 text-accent" />
                <span>bkk@smkalkaaffah-kepanjen.sch.id</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Portal BKK</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/job-pkl-board', label: 'Lowongan PKL & Kerja' },
                { href: '/cv-builder', label: 'Generator CV' },
              ]?.map((link) => (
                <li key={`footer-${link?.href}`}>
                  <Link
                    href={link?.href}
                    className="text-white/60 text-sm hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink size={12} />
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Jurusan */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Program Keahlian</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { code: 'TKJ', name: 'Teknik Komputer & Jaringan' },
                { code: 'TAV', name: 'Teknik Audio Video' },
                { code: 'TKR', name: 'Teknik Kendaraan Ringan' },
              ]?.map((maj) => (
                <li key={`footer-maj-${maj?.code}`} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/80">
                    {maj?.code}
                  </span>
                  <span className="text-white/60 text-sm">{maj?.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © 2026 BKK SMK Al Kaaffah Kepanjen. Hak cipta dilindungi.
          </p>
          <p className="text-white/40 text-xs">
            Dikelola oleh Tim BKK & Guru BK
          </p>
        </div>
      </div>
    </footer>
  );
}