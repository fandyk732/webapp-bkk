'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Briefcase, 
  Users, 
  BarChart3, 
  ArrowLeft, 
  RefreshCw, 
  LogOut 
} from 'lucide-react';

interface AdminHeaderProps {
  activeTab: 'stats' | 'mitra' | 'vacancies' | 'applications';
  setActiveTab: (tab: 'stats' | 'mitra' | 'vacancies' | 'applications') => void;
  loading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
  mitraCount: number;
  vacanciesCount: number;
  applicantsCount: number;
}

export default function AdminHeader({
  activeTab,
  setActiveTab,
  loading,
  onRefresh,
  onLogout,
  mitraCount,
  vacanciesCount,
  applicantsCount,
}: AdminHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Panel BKK</h1>
          <p className="text-sm text-slate-500">Manajemen Lowongan, Mitra, dan Pelamar Siswa (Database Connected)</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors"
          >
            <LogOut size={14} /> Keluar Admin
          </button>
          <button 
            onClick={onRefresh} 
            className="p-2 border rounded-xl hover:bg-slate-100 transition-colors text-slate-600" 
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'stats' ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 size={18} /> Ringkasan
        </button>
        <button
          onClick={() => setActiveTab('mitra')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'mitra' ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 size={18} /> Mitra Industri ({mitraCount})
        </button>
        <button
          onClick={() => setActiveTab('vacancies')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'vacancies' ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase size={18} /> Lowongan ({vacanciesCount})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'applications' ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users size={18} /> Data Pelamar ({applicantsCount})
        </button>
      </div>
    </div>
  );
}