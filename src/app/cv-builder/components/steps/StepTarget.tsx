'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { CVData } from '../cv-constants';

interface StepTargetProps {
  register: UseFormRegister<CVData>;
  errors: FieldErrors<CVData>;
  cvData: Partial<CVData>;
  updateCvData: () => void;
}

export default function StepTarget({ register, errors, cvData, updateCvData }: StepTargetProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-primary/8 border border-primary/15 rounded-xl">
        <p className="text-xs text-primary font-medium">
          Langkah terakhir! Tentukan target lamaranmu dan tulis profil singkat untuk CV.
        </p>
      </div>

      {/* Target Position */}
      <div>
        <label htmlFor="cv-targetPosition" className="block text-xs font-semibold text-foreground mb-1.5">
          Posisi yang Dilamar <span className="text-danger">*</span>
        </label>
        <input
          id="cv-targetPosition"
          type="text"
          placeholder="Contoh: Network Technician / Mekanik Kendaraan / Teknisi Audio Video"
          className={`form-input ${errors.targetPosition ? 'error' : ''}`}
          {...register('targetPosition', { required: 'Posisi target wajib diisi' })}
          onChange={updateCvData}
        />
        {errors.targetPosition && (
          <p className="text-xs text-danger mt-1">{errors.targetPosition.message}</p>
        )}
      </div>

      {/* Target Type */}
      <div>
        <label className="block text-xs font-semibold text-foreground mb-2">
          Jenis Lamaran <span className="text-danger">*</span>
        </label>
        <div className="flex gap-3">
          {['PKL', 'Kerja', 'Keduanya'].map((type) => (
            <label key={`target-type-${type}`} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={type}
                className="accent-primary"
                {...register('targetType', { required: true })}
                onChange={updateCvData}
              />
              <span className="text-sm text-foreground font-medium">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Target Major */}
      <div>
        <label htmlFor="cv-targetMajor" className="block text-xs font-semibold text-foreground mb-1.5">
          Bidang Keahlian yang Ditonjolkan
        </label>
        <div className="relative">
          <select
            id="cv-targetMajor"
            className="form-input appearance-none pr-8"
            {...register('targetMajor')}
            onChange={updateCvData}
          >
            <option value="">Pilih Bidang</option>
            <option value="Teknik Komputer dan Jaringan">Teknik Komputer dan Jaringan</option>
            <option value="Teknik Audio Video">Teknik Audio Video</option>
            <option value="Teknik Kendaraan Ringan">Teknik Kendaraan Ringan</option>
          </select>
          <ChevronRight size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rotate-90" />
        </div>
      </div>

      {/* About Me */}
      <div>
        <label htmlFor="cv-aboutMe" className="block text-xs font-semibold text-foreground mb-1.5">
          Profil Singkat / Tentang Saya <span className="text-danger">*</span>
        </label>
        <p className="text-[11px] text-muted-foreground mb-1.5">
          2–3 kalimat mendeskripsikan dirimu, keahlian utama, dan tujuan karir (min. 80 karakter)
        </p>
        <textarea
          id="cv-aboutMe"
          rows={4}
          placeholder="Contoh: Saya adalah siswa SMK jurusan TKJ yang memiliki keahlian di bidang jaringan komputer dan administrasi sistem Linux. Berpengalaman PKL di PT Telkom selama 3 bulan. Siap berkontribusi dan terus belajar di lingkungan kerja yang profesional."
          className={`form-input resize-none ${errors.aboutMe ? 'error' : ''}`}
          {...register('aboutMe', {
            required: 'Profil singkat wajib diisi',
            minLength: { value: 80, message: 'Minimal 80 karakter' },
          })}
          onChange={updateCvData}
        />
        {errors.aboutMe && (
          <p className="text-xs text-danger mt-1 flex items-center gap-1">
            <AlertCircle size={11} />{errors.aboutMe.message}
          </p>
        )}
      </div>

      {/* Summary before generate */}
      <div className="bg-muted rounded-2xl p-4 flex flex-col gap-2">
        <h4 className="text-xs font-bold text-foreground mb-1">Ringkasan CV</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Nama:</span>
            <span className="ml-1 font-semibold text-foreground">{cvData.fullName || '—'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Jurusan:</span>
            <span className="ml-1 font-semibold text-foreground">{cvData.major ? cvData.major.split('(')[1]?.replace(')', '') || cvData.major : '—'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Hard Skills:</span>
            <span className="ml-1 font-semibold text-foreground">{(cvData.hardSkills || []).length} dipilih</span>
          </div>
          <div>
            <span className="text-muted-foreground">Soft Skills:</span>
            <span className="ml-1 font-semibold text-foreground">{(cvData.softSkills || []).length} dipilih</span>
          </div>
        </div>
      </div>
    </div>
  );
}