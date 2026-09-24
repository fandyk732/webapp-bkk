'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import VacancyDetailTab from './VacancyDetailTab';
import ApplyFormTab from './ApplyFormTab';
import type { VacancyItem } from './types';

export default function ApplyDrawer({
  vacancy,
  onClose,
}: {
  vacancy: VacancyItem;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<'detail' | 'apply'>('detail');

  return (
    <div className="fixed inset-0 z-[200] flex">
      {/* Overlay */}
      <div
        className="drawer-overlay absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Drawer Container */}
      <div className="relative ml-auto w-full max-w-lg h-full bg-card shadow-modal flex flex-col animate-slide-up overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/95 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {vacancy.companyLogo ? (
                <AppImage
                  src={vacancy.companyLogo}
                  alt={`Logo ${vacancy.company}`}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain p-1"
                  unoptimized
                />
              ) : (
                <span className="text-xs font-bold text-primary">
                  {vacancy.company.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground line-clamp-1">{vacancy.title}</h3>
              <p className="text-xs text-muted-foreground">{vacancy.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            aria-label="Tutup drawer"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border shrink-0">
          {(['detail', 'apply'] as const).map((t) => (
            <button
              key={`drawer-tab-${t}`}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-semibold transition-all border-b-2 ${
                tab === t
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'detail' ? 'Detail Lowongan' : 'Form Lamaran'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {tab === 'detail' ? (
            <VacancyDetailTab vacancy={vacancy} onGoToApply={() => setTab('apply')} />
          ) : (
            <ApplyFormTab vacancy={vacancy} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}