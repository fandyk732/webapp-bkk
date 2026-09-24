'use client';

import React from 'react';
import { MapPin, Briefcase, GraduationCap, Clock, Users, CheckCircle2, Star } from 'lucide-react';
import type { VacancyItem } from './types';

interface VacancyDetailTabProps {
  vacancy: VacancyItem;
  onGoToApply: () => void;
}

export default function VacancyDetailTab({ vacancy, onGoToApply }: VacancyDetailTabProps) {
  const urgencyClass =
    vacancy.daysLeft <= 5
      ? 'badge-deadline-urgent'
      : vacancy.daysLeft <= 14
      ? 'badge-deadline-soon'
      : 'badge-deadline-ok';

  return (
    <div className="px-6 py-5 flex flex-col gap-5">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            vacancy.type === 'PKL'
              ? 'badge-pkl'
              : vacancy.type === 'Kerja'
              ? 'badge-kerja'
              : 'badge-keduanya'
          }`}
        >
          {vacancy.type}
        </span>
        {vacancy.majors?.map((maj) => (
          <span
            key={`drawer-maj-${maj}`}
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              maj === 'TKJ' ? 'badge-tkj' : maj === 'TAV' ? 'badge-tav' : 'badge-tkr'
            }`}
          >
            {maj}
          </span>
        ))}
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${urgencyClass}`}>
          {vacancy.daysLeft <= 0 ? 'Hari Ini!' : `${vacancy.daysLeft} hari lagi`}
        </span>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted rounded-xl p-3">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">
            Lokasi
          </p>
          <div className="flex items-center gap-1">
            <MapPin size={11} className="text-primary shrink-0" />
            <p className="text-xs font-semibold text-foreground">{vacancy.location}</p>
          </div>
        </div>
        <div className="bg-muted rounded-xl p-3">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">
            {vacancy.type === 'PKL' ? 'Uang Saku' : 'Gaji'}
          </p>
          <div className="flex items-center gap-1">
            {vacancy.type === 'PKL' ? (
              <GraduationCap size={11} className="text-success shrink-0" />
            ) : (
              <Briefcase size={11} className="text-primary shrink-0" />
            )}
            <p className="text-xs font-semibold text-foreground tabular">{vacancy.salary}</p>
          </div>
        </div>
        <div className="bg-muted rounded-xl p-3">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">
            Kuota
          </p>
          <div className="flex items-center gap-1">
            <Users size={11} className="text-primary shrink-0" />
            <p className="text-xs font-semibold text-foreground tabular">
              {(vacancy.quota || 0) - (vacancy.quotaUsed || 0)} slot tersisa
            </p>
          </div>
        </div>
        <div className="bg-muted rounded-xl p-3">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">
            Deadline
          </p>
          <div className="flex items-center gap-1">
            <Clock size={11} className="text-primary shrink-0" />
            <p className="text-xs font-semibold text-foreground">{vacancy.deadline}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
          Deskripsi Pekerjaan
        </h4>
        <p className="text-sm text-foreground leading-relaxed">{vacancy.description}</p>
      </div>

      {/* Qualifications */}
      <div>
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
          Persyaratan
        </h4>
        <ul className="flex flex-col gap-2">
          {vacancy.qualifications?.map((q, idx) => (
            <li key={`qual-${vacancy.id}-${idx}`} className="flex items-start gap-2">
              <CheckCircle2 size={13} className="text-success shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{q}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Benefits */}
      <div>
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
          Fasilitas & Benefit
        </h4>
        <div className="flex flex-wrap gap-2">
          {vacancy.benefits?.map((b) => (
            <span
              key={`benefit-${vacancy.id}-${b}`}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-primary/8 text-primary font-medium"
            >
              <Star size={10} />
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onGoToApply}
        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all active:scale-95 mt-2"
      >
        Lamar Sekarang →
      </button>
    </div>
  );
}