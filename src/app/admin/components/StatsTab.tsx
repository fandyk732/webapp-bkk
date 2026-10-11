'use client';

import React from 'react';
import { Building2, Briefcase, Users, Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import type { StatsData } from '../types';

export default function StatsTab({ statsData }: { statsData: StatsData }) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              Statistik Realtime Database BKK
            </h2>
            <p className="text-xs text-slate-500">
              Data terintegrasi otomatis dari database Supabase
            </p>
          </div>
        </div>

        {/* Grid Kartu Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Mitra Industri */}
          <div className="p-5 bg-gradient-to-br from-blue-50/80 to-blue-100/40 border border-blue-100 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Mitra Industri</p>
              <p className="text-3xl font-black text-blue-900 mt-1">{statsData.mitraAktif || 0}</p>
              <p className="text-[10px] text-blue-500 font-medium mt-0.5">Perusahaan terdaftar</p>
            </div>
            <div className="w-12 h-12 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <Building2 size={24} />
            </div>
          </div>

          {/* 2. Lowongan Terbuka */}
          <div className="p-5 bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 border border-emerald-100 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Lowongan Terbuka</p>
              <p className="text-3xl font-black text-emerald-900 mt-1">{statsData.lowonganTerbuka || 0}</p>
              <p className="text-[10px] text-emerald-500 font-medium mt-0.5">Posisi aktif dibuka</p>
            </div>
            <div className="w-12 h-12 bg-emerald-600/10 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
              <Briefcase size={24} />
            </div>
          </div>

          {/* 3. Permintaan Slot PKL */}
          <div className="p-5 bg-gradient-to-br from-amber-50/80 to-amber-100/40 border border-amber-100 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Minat Slot PKL</p>
              <p className="text-3xl font-black text-amber-900 mt-1">{statsData.slotPKL || 0}</p>
              <p className="text-[10px] text-amber-500 font-medium mt-0.5">Siswa butuh lokasi PKL</p>
            </div>
            <div className="w-12 h-12 bg-amber-600/10 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
              <Award size={24} />
            </div>
          </div>

          {/* 4. Total Pelamar Masuk */}
          <div className="p-5 bg-gradient-to-br from-purple-50/80 to-purple-100/40 border border-purple-100 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Total Lamaran</p>
              <p className="text-3xl font-black text-purple-900 mt-1">{statsData.totalPelamar || 0}</p>
              <p className="text-[10px] text-purple-500 font-medium mt-0.5">Berkas dikirim siswa</p>
            </div>
            <div className="w-12 h-12 bg-purple-600/10 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
              <Users size={24} />
            </div>
          </div>

          {/* 5. Kesiapan Penempatan */}
          <div className="p-5 bg-gradient-to-br from-indigo-50/80 to-indigo-100/40 border border-indigo-100 rounded-2xl flex items-center justify-between sm:col-span-2 lg:col-span-2">
            <div>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Tingkat Kesiapan Penempatan</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-3xl font-black text-indigo-900">{statsData.tingkatPenempatan || '0.0'}%</p>
              </div>
              <p className="text-[10px] text-indigo-500 font-medium mt-0.5">
                Kalkulasi otomatis dari hasil survei pemetaan minat karir
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-600/10 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}