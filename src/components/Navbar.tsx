'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import AuthButton from '@/components/AuthButton'; // Import AuthButton
import {
  Menu,
  X,
  Briefcase,
  FileText,
  Home,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/job-pkl-board', label: 'Lowongan', icon: Briefcase },
  { href: '/cv-builder', label: 'Buat CV', icon: FileText },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-border shadow-glass'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <AppLogo size={36} />
              <div className="flex flex-col leading-none">
                <span className="font-bold text-sm text-foreground tracking-tight">
                  BKKMitradudi
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  SMK Al Kaaffah Kepanjen
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks?.map((link) => {
                const isActive = pathname === link?.href;
                return (
                  <Link
                    key={`nav-${link?.href}`}
                    href={link?.href}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground hover:bg-muted hover:text-primary'
                    }`}
                  >
                    <link.icon size={15} />
                    {link?.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA & Auth Status */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/job-pkl-board"
                className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95"
              >
                <GraduationCap size={15} />
                Daftar PKL
              </Link>

              {/* Komponen Auth (Login / Profile / Logout) */}
              <AuthButton />
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Buka menu navigasi"
            >
              <Menu size={22} className="text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Overlay */}
          <div
            className="drawer-overlay absolute inset-0"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="relative ml-auto w-72 h-full bg-card shadow-modal flex flex-col animate-slide-up">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <AppLogo size={30} />
                <span className="font-bold text-sm text-foreground">BKKMitradudi</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                aria-label="Tutup menu"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
              {navLinks?.map((link) => {
                const isActive = pathname === link?.href;
                return (
                  <Link
                    key={`mobile-nav-${link?.href}`}
                    href={link?.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon size={17} />
                      {link?.label}
                    </div>
                    <ChevronRight size={15} className="text-muted-foreground" />
                  </Link>
                );
              })}
            </nav>

            {/* Area CTA & Auth di Mobile Drawer */}
            <div className="px-4 pb-6 space-y-3">
              <Link
                href="/job-pkl-board"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all"
              >
                <GraduationCap size={16} />
                Daftar PKL Sekarang
              </Link>

              {/* Komponen Auth di Mobile */}
              <div className="pt-2 border-t border-border flex justify-center">
                <AuthButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}