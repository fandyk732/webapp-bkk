'use client';

import React from 'react';
import type { StatsData } from '../types';

export default function StatsTab({ statsData }: { statsData: StatsData }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 max-w-3xl">
      <h2 className="text-lg font-semibold text-slate-800">Statistik Realtime Database</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-xs font-semibold text-blue-600">Mitra Industri</p>
          <p className="text-3xl font-black text-blue-900 mt-1">{statsData.mitraAktif}</p>
        </div>
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
          <p className="text-xs font-semibold text-emerald-600">Lowongan Terbuka</p>
          <p className="text-3xl font-black text-emerald-900 mt-1">{statsData.lowonganTerbuka}</p>
        </div>
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <p className="text-xs font-semibold text-amber-600">Slot PKL Tersedia</p>
          <p className="text-3xl font-black text-amber-900 mt-1">{statsData.slotPKL}</p>
        </div>
        <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
          <p className="text-xs font-semibold text-purple-600">Total Pelamar Masuk</p>
          <p className="text-3xl font-black text-purple-900 mt-1">{statsData.totalPelamar}</p>
        </div>
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
          <p className="text-xs font-semibold text-indigo-600">Tingkat Penempatan</p>
          <p className="text-3xl font-black text-indigo-900 mt-1">{statsData.tingkatPenempatan}%</p>
        </div>
      </div>
    </div>
  );
}