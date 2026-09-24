'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, GraduationCap, ChevronDown, Menu, X, FileText, Briefcase, Home } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between md:grid md:grid-cols-12">
        
        {/* LOGO (Kiri) */}
        <div className="md:col-span-3 flex items-center justify-start">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-foreground">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xs font-black shadow-sm">
              BKK
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight">BKKMitradudi</span>
              <span className="text-[10px] text-muted-foreground font-normal">SMK Al Kaaffah</span>
            </div>
          </Link>
        </div>

        {/* MENU DESKTOP (Tengah - Hanya tampil di MD ke atas) */}
        <nav className="hidden md:flex md:col-span-6 items-center justify-center gap-1 sm:gap-2">
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              pathname === '/' 
                ? 'bg-primary/10 text-primary font-semibold' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/job-pkl-board"
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              pathname === '/job-pkl-board' 
                ? 'bg-primary/10 text-primary font-semibold' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            Lowongan
          </Link>
          <Link
            href="/cv-builder"
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              pathname === '/cv-builder' 
                ? 'bg-primary/10 text-primary font-semibold' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            Buat CV
          </Link>
        </nav>

        {/* PROFILE / LOGIN DESKTOP & TOGGLE MOBILE (Kanan) */}
        <div className="md:col-span-3 flex items-center justify-end gap-2">
          
          {/* Menu Profile (Desktop) */}
          <div className="hidden md:block">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-border bg-card hover:bg-muted transition-all shadow-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/15 text-primary font-bold flex items-center justify-center text-xs">
                    {userInitial}
                  </div>
                  <span className="text-xs font-semibold text-foreground max-w-[100px] truncate">
                    {userName}
                  </span>
                  <ChevronDown size={14} className="text-muted-foreground" />
                </button>

                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl p-2 z-50 animate-slide-up">
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <p className="text-xs font-bold text-foreground truncate">{userName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/job-pkl-board"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
                      >
                        <GraduationCap size={14} className="text-primary" /> Daftar PKL
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2 mt-1 px-3 py-2 text-xs font-semibold text-danger hover:bg-danger-bg rounded-xl transition-colors"
                      >
                        <LogOut size={14} /> Keluar / Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-sm"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Tombol Hamburger (Khusus Mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-foreground hover:bg-muted transition-colors border border-border"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </div>

      {/* DROPDOWN MENU MOBILE */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 pt-3 pb-6 space-y-3 animate-slide-up">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                pathname === '/' ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-muted'
              }`}
            >
              <Home size={18} /> Beranda
            </Link>
            <Link
              href="/job-pkl-board"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                pathname === '/job-pkl-board' ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-muted'
              }`}
            >
              <Briefcase size={18} /> Lowongan
            </Link>
            <Link
              href="/cv-builder"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                pathname === '/cv-builder' ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-muted'
              }`}
            >
              <FileText size={18} /> Buat CV
            </Link>
          </div>

          <div className="pt-3 border-t border-border">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary font-bold flex items-center justify-center text-xs">
                    {userInitial}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">{userName}</span>
                    <span className="text-[10px] text-muted-foreground">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold text-danger bg-danger-bg rounded-xl border border-danger/20"
                >
                  <LogOut size={16} /> Keluar / Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center py-2.5 px-4 text-xs font-semibold text-white bg-primary rounded-xl"
              >
                Masuk Akun
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}