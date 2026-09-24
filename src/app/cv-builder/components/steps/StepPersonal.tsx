'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { CVData } from '../cv-constants';

interface StepPersonalProps {
  register: UseFormRegister<CVData>;
  errors: FieldErrors<CVData>;
  updateCvData: () => void;
}

export default function StepPersonal({ register, errors, updateCvData }: StepPersonalProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Full Name */}
      <div>
        <label htmlFor="cv-fullName" className="block text-xs font-semibold text-foreground mb-1.5">
          Nama Lengkap <span className="text-danger">*</span>
        </label>
        <input
          id="cv-fullName"
          type="text"
          placeholder="Contoh: Ahmad Rizky Pratama"
          className={`form-input ${errors.fullName ? 'error' : ''}`}
          {...register('fullName', { required: 'Nama lengkap wajib diisi' })}
          onChange={updateCvData}
        />
        {errors.fullName && (
          <p className="text-xs text-danger mt-1 flex items-center gap-1">
            <AlertCircle size={11} />{errors.fullName.message}
          </p>
        )}
      </div>

      {/* NIS + Kelas */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="cv-nis" className="block text-xs font-semibold text-foreground mb-1.5">
            NIS <span className="text-danger">*</span>
          </label>
          <input
            id="cv-nis"
            type="text"
            placeholder="Nomor Induk Siswa"
            className={`form-input ${errors.nis ? 'error' : ''}`}
            {...register('nis', { required: 'NIS wajib diisi' })}
            onChange={updateCvData}
          />
          {errors.nis && (
            <p className="text-xs text-danger mt-1">{errors.nis.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="cv-kelas" className="block text-xs font-semibold text-foreground mb-1.5">
            Kelas <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <select
              id="cv-kelas"
              className={`form-input appearance-none pr-8 ${errors.kelas ? 'error' : ''}`}
              {...register('kelas', { required: 'Kelas wajib dipilih' })}
              onChange={updateCvData}
            >
              <option value="">Pilih Kelas</option>
              <option value="XI TKJ 1">XI TKJ 1</option>
              <option value="XI TKJ 2">XI TKJ 2</option>
              <option value="XI TAV">XI TAV</option>
              <option value="XI TKR 1">XI TKR 1</option>
              <option value="XI TKR 2">XI TKR 2</option>
              <option value="XII TKJ 1">XII TKJ 1</option>
              <option value="XII TKJ 2">XII TKJ 2</option>
              <option value="XII TAV">XII TAV</option>
              <option value="XII TKR 1">XII TKR 1</option>
              <option value="XII TKR 2">XII TKR 2</option>
              <option value="Alumni">Alumni</option>
            </select>
            <ChevronRight size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rotate-90" />
          </div>
          {errors.kelas && (
            <p className="text-xs text-danger mt-1">{errors.kelas.message}</p>
          )}
        </div>
      </div>

      {/* Major */}
      <div>
        <label htmlFor="cv-major" className="block text-xs font-semibold text-foreground mb-1.5">
          Program Keahlian (Jurusan) <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <select
            id="cv-major"
            className={`form-input appearance-none pr-8 ${errors.major ? 'error' : ''}`}
            {...register('major', { required: 'Jurusan wajib dipilih' })}
            onChange={updateCvData}
          >
            <option value="">Pilih Jurusan</option>
            <option value="Teknik Komputer dan Jaringan (TKJ)">Teknik Komputer dan Jaringan (TKJ)</option>
            <option value="Teknik Audio Video (TAV)">Teknik Audio Video (TAV)</option>
            <option value="Teknik Kendaraan Ringan (TKR)">Teknik Kendaraan Ringan (TKR)</option>
          </select>
          <ChevronRight size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rotate-90" />
        </div>
        {errors.major && (
          <p className="text-xs text-danger mt-1">{errors.major.message}</p>
        )}
      </div>

      {/* Birth Place + Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="cv-birthPlace" className="block text-xs font-semibold text-foreground mb-1.5">
            Tempat Lahir <span className="text-danger">*</span>
          </label>
          <input
            id="cv-birthPlace"
            type="text"
            placeholder="Contoh: Malang"
            className={`form-input ${errors.birthPlace ? 'error' : ''}`}
            {...register('birthPlace', { required: 'Tempat lahir wajib diisi' })}
            onChange={updateCvData}
          />
          {errors.birthPlace && (
            <p className="text-xs text-danger mt-1">{errors.birthPlace.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="cv-birthDate" className="block text-xs font-semibold text-foreground mb-1.5">
            Tanggal Lahir <span className="text-danger">*</span>
          </label>
          <input
            id="cv-birthDate"
            type="date"
            className={`form-input ${errors.birthDate ? 'error' : ''}`}
            {...register('birthDate', { required: 'Tanggal lahir wajib diisi' })}
            onChange={updateCvData}
          />
          {errors.birthDate && (
            <p className="text-xs text-danger mt-1">{errors.birthDate.message}</p>
          )}
        </div>
      </div>

      {/* Gender + Religion */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="cv-gender" className="block text-xs font-semibold text-foreground mb-1.5">
            Jenis Kelamin <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <select
              id="cv-gender"
              className={`form-input appearance-none pr-8 ${errors.gender ? 'error' : ''}`}
              {...register('gender', { required: 'Jenis kelamin wajib dipilih' })}
              onChange={updateCvData}
            >
              <option value="">Pilih</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <ChevronRight size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rotate-90" />
          </div>
          {errors.gender && (
            <p className="text-xs text-danger mt-1">{errors.gender.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="cv-religion" className="block text-xs font-semibold text-foreground mb-1.5">
            Agama
          </label>
          <div className="relative">
            <select
              id="cv-religion"
              className="form-input appearance-none pr-8"
              {...register('religion')}
              onChange={updateCvData}
            >
              <option value="Islam">Islam</option>
              <option value="Kristen">Kristen</option>
              <option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddha">Buddha</option>
            </select>
            <ChevronRight size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rotate-90" />
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="cv-address" className="block text-xs font-semibold text-foreground mb-1.5">
          Alamat Lengkap <span className="text-danger">*</span>
        </label>
        <textarea
          id="cv-address"
          rows={2}
          placeholder="Jl. ..., RT/RW, Desa/Kelurahan, Kecamatan, Kabupaten/Kota"
          className={`form-input resize-none ${errors.address ? 'error' : ''}`}
          {...register('address', { required: 'Alamat wajib diisi' })}
          onChange={updateCvData}
        />
        {errors.address && (
          <p className="text-xs text-danger mt-1">{errors.address.message}</p>
        )}
      </div>

      {/* Phone + Email */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="cv-phone" className="block text-xs font-semibold text-foreground mb-1.5">
            No. HP / WA <span className="text-danger">*</span>
          </label>
          <input
            id="cv-phone"
            type="tel"
            placeholder="08xxxxxxxxxx"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            {...register('phone', {
              required: 'No. HP wajib diisi',
              pattern: { value: /^08\d{8,12}$/, message: 'Format tidak valid' },
            })}
            onChange={updateCvData}
          />
          {errors.phone && (
            <p className="text-xs text-danger mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="cv-email" className="block text-xs font-semibold text-foreground mb-1.5">
            Email
          </label>
          <input
            id="cv-email"
            type="email"
            placeholder="nama@email.com"
            className="form-input"
            {...register('email', {
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid' },
            })}
            onChange={updateCvData}
          />
          {errors.email && (
            <p className="text-xs text-danger mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}