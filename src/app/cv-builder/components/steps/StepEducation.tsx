'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CVData } from '../cv-constants';

interface StepEducationProps {
  register: UseFormRegister<CVData>;
  errors: FieldErrors<CVData>;
  updateCvData: () => void;
}

export default function StepEducation({ register, errors, updateCvData }: StepEducationProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* SD */}
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Sekolah Dasar (SD)</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label htmlFor="cv-sdName" className="block text-xs font-semibold text-foreground mb-1.5">
              Nama Sekolah <span className="text-danger">*</span>
            </label>
            <input
              id="cv-sdName"
              type="text"
              placeholder="SDN / MI ..."
              className={`form-input ${errors.sdName ? 'error' : ''}`}
              {...register('sdName', { required: 'Nama SD wajib diisi' })}
              onChange={updateCvData}
            />
            {errors.sdName && (
              <p className="text-xs text-danger mt-1">{errors.sdName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="cv-sdYear" className="block text-xs font-semibold text-foreground mb-1.5">
              Tahun Lulus <span className="text-danger">*</span>
            </label>
            <input
              id="cv-sdYear"
              type="text"
              placeholder="2019"
              maxLength={4}
              className={`form-input ${errors.sdYear ? 'error' : ''}`}
              {...register('sdYear', { required: 'Tahun lulus wajib diisi' })}
              onChange={updateCvData}
            />
            {errors.sdYear && (
              <p className="text-xs text-danger mt-1">{errors.sdYear.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* SMP */}
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Sekolah Menengah Pertama (SMP/MTs)</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label htmlFor="cv-smpName" className="block text-xs font-semibold text-foreground mb-1.5">
              Nama Sekolah <span className="text-danger">*</span>
            </label>
            <input
              id="cv-smpName"
              type="text"
              placeholder="SMP / MTs ..."
              className={`form-input ${errors.smpName ? 'error' : ''}`}
              {...register('smpName', { required: 'Nama SMP wajib diisi' })}
              onChange={updateCvData}
            />
            {errors.smpName && (
              <p className="text-xs text-danger mt-1">{errors.smpName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="cv-smpYear" className="block text-xs font-semibold text-foreground mb-1.5">
              Tahun Lulus <span className="text-danger">*</span>
            </label>
            <input
              id="cv-smpYear"
              type="text"
              placeholder="2022"
              maxLength={4}
              className={`form-input ${errors.smpYear ? 'error' : ''}`}
              {...register('smpYear', { required: 'Tahun lulus wajib diisi' })}
              onChange={updateCvData}
            />
            {errors.smpYear && (
              <p className="text-xs text-danger mt-1">{errors.smpYear.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* SMK */}
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">SMK (Saat Ini)</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label htmlFor="cv-smkName" className="block text-xs font-semibold text-foreground mb-1.5">
              Nama Sekolah
            </label>
            <input
              id="cv-smkName"
              type="text"
              className="form-input bg-muted/50"
              readOnly
              {...register('smkName')}
            />
          </div>
          <div>
            <label htmlFor="cv-smkYear" className="block text-xs font-semibold text-foreground mb-1.5">
              Tahun Lulus
            </label>
            <input
              id="cv-smkYear"
              type="text"
              placeholder="2026"
              maxLength={4}
              className="form-input"
              {...register('smkYear')}
              onChange={updateCvData}
            />
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div>
        <label htmlFor="cv-certifications" className="block text-xs font-semibold text-foreground mb-1.5">
          Sertifikasi & Prestasi
        </label>
        <p className="text-[11px] text-muted-foreground mb-1.5">
          Tuliskan sertifikasi kompetensi, lomba, atau penghargaan yang pernah diraih
        </p>
        <textarea
          id="cv-certifications"
          rows={3}
          placeholder="Contoh:&#10;- Sertifikat Uji Kompetensi Keahlian (UKK) TKJ — 2026&#10;- Juara 2 LKS Jaringan Komputer Kabupaten Malang — 2025"
          className="form-input resize-none"
          {...register('certifications')}
          onChange={updateCvData}
        />
      </div>
    </div>
  );
}