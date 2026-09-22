'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { LogIn, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';

export default function AuthButton() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ambil data user yang sedang aktif
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // 2. Listen perubahan auth state (misal setelah login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="h-9 w-20 bg-slate-200 animate-pulse rounded-xl" />
    );
  }

  // JIKA BELUM LOGIN -> TAMPILKAN TOMBOL MASUK
  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm active:scale-95"
      >
        <LogIn size={14} />
        Masuk
      </Link>
    );
  }

  // JIKA SUDAH LOGIN -> TAMPILKAN AVATAR/EMAIL & TOMBOL LOGOUT
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200">
        {user.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.email || 'User'}
            className="w-6 h-6 rounded-full border border-slate-300"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
            <UserIcon size={12} />
          </div>
        )}
        <span className="text-xs font-medium text-slate-700 max-w-[120px] truncate">
          {user.user_metadata?.full_name || user.email?.split('@')[0]}
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all active:scale-95"
        title="Keluar Akun"
      >
        <LogOut size={14} />
        Keluar
      </button>
    </div>
  );
}