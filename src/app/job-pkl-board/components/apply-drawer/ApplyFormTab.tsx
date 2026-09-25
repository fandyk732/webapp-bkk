'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Upload, Send, ChevronDown, LogIn, Lock } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import type { VacancyItem, ApplyFormData } from './types';

interface ApplyFormTabProps {
  vacancy: VacancyItem;
  onClose: () => void;
}

// Batas & aturan berkas CV — divalidasi di client sebagai first line of defense.
// CATATAN: ini TIDAK menggantikan pembatasan di sisi Supabase Storage (file size limit,
// allowed MIME types di bucket policy). Validasi client selalu bisa dilewati lewat
// devtools/panggilan API langsung — lihat rls-recommendations.sql untuk hardening sisi server.
const MAX_CV_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_CV_TYPE = 'application/pdf';

function generateSecureFileName(originalName: string): string {
  const fileExt = (originalName.split('.').pop() || 'pdf').toLowerCase();
  // Pakai UUID acak — JANGAN embed data siswa (NIS/NISN) ke dalam path file publik.
  const randomId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  return `${randomId}.${fileExt}`;
}

export default function ApplyFormTab({ vacancy, onClose }: ApplyFormTabProps) {
  const supabase = createClient();
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ApplyFormData>();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setCheckingAuth(false);

      if (user) {
        if (user.user_metadata?.full_name) {
          setValue('fullName', user.user_metadata.full_name);
        }
        if (user.email) {
          setValue('email', user.email);
        }
      }
    };

    checkUser();
  }, [supabase, setValue]);

  const selectedCvFile = watch('cvFile');

  const onSubmit = async (data: ApplyFormData) => {
    if (!user) {
      toast.error('Kamu harus login terlebih dahulu untuk melamar!');
      return;
    }

    setSubmitting(true);
    let cvPublicUrl = '';

    try {
      // 1. Upload Berkas CV (jika melampirkan file)
      if (data.cvFile && data.cvFile.length > 0) {
        const file = data.cvFile[0];

        if (file.type !== ALLOWED_CV_TYPE) {
          throw new Error('Berkas CV harus berformat PDF.');
        }
        if (file.size > MAX_CV_SIZE_BYTES) {
          throw new Error('Ukuran berkas CV maksimal 2MB.');
        }

        const fileName = generateSecureFileName(file.name);
        const filePath = `resumes/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('cvs')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: ALLOWED_CV_TYPE,
          });

        if (uploadError) throw new Error('Gagal unggah berkas CV: ' + uploadError.message);

        const { data: publicUrlData } = supabase.storage.from('cvs').getPublicUrl(filePath);
        cvPublicUrl = publicUrlData.publicUrl;
      }

      // 2. Simpan Data Pelamar ke Tabel pelamar (Sertakan user_id untuk RLS)
      const { error: insertError } = await supabase.from('pelamar').insert([
        {
          user_id: user.id, // Wajib untuk RLS Supabase
          lowongan_id: vacancy.id,
          posisi_dilamar: vacancy.title,
          nama_perusahaan: vacancy.company,
          tipe_lamaran: vacancy.type,
          nama_lengkap: data.fullName,
          nisn: data.nis,
          jurusan: data.major,
          no_whatsapp: data.phone,
          link_cv: cvPublicUrl,
          catatan: `[Kelas ${data.kelas}] Motivasi: ${data.motivation}`,
          status: 'Menunggu Review',
        },
      ]);

      if (insertError) throw new Error(insertError.message);

      // 3. Tambah quota_used (+1)
      try {
        const currentQuotaUsed = Number(vacancy.quotaUsed || 0);
        await supabase
          .from('lowongan_kerja')
          .update({ quota_used: currentQuotaUsed + 1 })
          .eq('id', vacancy.id);
      } catch (quotaErr) {
        console.warn('Gagal mengupdate quota_used:', quotaErr);
      }

      // 4. Tampilkan Toast Sukses & Tutup Form Drawer
      toast.success(
        `Lamaran untuk "${vacancy.title}" berhasil dikirim! Tim BKK akan menghubungi kamu.`
      );
      reset();
      onClose();
    } catch (err: any) {
      console.error('Submit Error:', err);
      toast.error(`Gagal mengirim lamaran: ${err.message || 'Terjadi kesalahan sistem'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return <div className="p-8 text-center text-xs text-muted-foreground">Memeriksa status login...</div>;
  }

  if (!user) {
    return (
      <div className="px-6 py-12 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shadow-sm">
          <Lock size={28} />
        </div>
        <div>
          <h4 className="font-bold text-base text-foreground">Login Diperlukan</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Kamu harus masuk/login terlebih dahulu dengan akun Google untuk dapat melamar posisi ini.
          </p>
        </div>
        <Link
          href="/login"
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm active:scale-95 mt-2"
        >
          <LogIn size={16} />
          Masuk dengan Google
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 flex flex-col gap-4">
      <div className="p-3 bg-primary/8 border border-primary/15 rounded-xl">
        <p className="text-xs text-primary font-medium">
          Melamar untuk: <span className="font-bold">{vacancy.title}</span> di {vacancy.company}
        </p>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="apply-fullName" className="block text-xs font-semibold text-foreground mb-1.5">
          Nama Lengkap <span className="text-danger">*</span>
        </label>
        <input
          id="apply-fullName"
          type="text"
          placeholder="Contoh: Ahmad Rizky Pratama"
          className={`form-input ${errors.fullName ? 'error' : ''}`}
          {...register('fullName', { required: 'Nama lengkap wajib diisi' })}
        />
        {errors.fullName && <p className="text-xs text-danger mt-1">{errors.fullName.message}</p>}
      </div>

      {/* NIS & Kelas */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="apply-nis" className="block text-xs font-semibold text-foreground mb-1.5">
            NIS / NISN <span className="text-danger">*</span>
          </label>
          <input
            id="apply-nis"
            type="text"
            placeholder="1234567890"
            className={`form-input ${errors.nis ? 'error' : ''}`}
            {...register('nis', {
              required: 'NIS wajib diisi',
              pattern: { value: /^\d{8,12}$/, message: 'NIS tidak valid' },
            })}
          />
          {errors.nis && <p className="text-xs text-danger mt-1">{errors.nis.message}</p>}
        </div>
        <div>
          <label htmlFor="apply-kelas" className="block text-xs font-semibold text-foreground mb-1.5">
            Kelas <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <select
              id="apply-kelas"
              className={`form-input appearance-none pr-8 ${errors.kelas ? 'error' : ''}`}
              {...register('kelas', { required: 'Kelas wajib dipilih' })}
            >
              <option value="">Pilih</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>
              <option value="Alumni">Alumni</option>
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          {errors.kelas && <p className="text-xs text-danger mt-1">{errors.kelas.message}</p>}
        </div>
      </div>

      {/* Major */}
      <div>
        <label htmlFor="apply-major" className="block text-xs font-semibold text-foreground mb-1.5">
          Jurusan <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <select
            id="apply-major"
            className={`form-input appearance-none pr-8 ${errors.major ? 'error' : ''}`}
            {...register('major', { required: 'Jurusan wajib dipilih' })}
          >
            <option value="">Pilih Jurusan</option>
            <option value="TKJ">TKJ — Teknik Komputer & Jaringan</option>
            <option value="TAV">TAV — Teknik Audio Video</option>
            <option value="TKR">TKR — Teknik Kendaraan Ringan</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
        {errors.major && <p className="text-xs text-danger mt-1">{errors.major.message}</p>}
      </div>

      {/* Phone & Email */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="apply-phone" className="block text-xs font-semibold text-foreground mb-1.5">
            No. HP / WA <span className="text-danger">*</span>
          </label>
          <input
            id="apply-phone"
            type="tel"
            placeholder="08xxxxxxxxxx"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            {...register('phone', {
              required: 'No. HP wajib diisi',
              pattern: { value: /^08\d{8,12}$/, message: 'Format tidak valid' },
            })}
          />
          {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="apply-email" className="block text-xs font-semibold text-foreground mb-1.5">
            Email
          </label>
          <input
            id="apply-email"
            type="email"
            placeholder="nama@email.com"
            className="form-input bg-muted/50 cursor-not-allowed"
            readOnly
            {...register('email', {
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid' },
            })}
          />
          {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
        </div>
      </div>

      {/* Motivation */}
      <div>
        <label htmlFor="apply-motivation" className="block text-xs font-semibold text-foreground mb-1.5">
          Motivasi Melamar <span className="text-danger">*</span>
        </label>
        <p className="text-[11px] text-muted-foreground mb-1.5">
          Ceritakan mengapa kamu tertarik dengan posisi ini (min. 50 karakter)
        </p>
        <textarea
          id="apply-motivation"
          rows={3}
          placeholder="Saya tertarik melamar karena..."
          className={`form-input resize-none ${errors.motivation ? 'error' : ''}`}
          {...register('motivation', {
            required: 'Motivasi wajib diisi',
            minLength: { value: 50, message: 'Minimal 50 karakter' },
          })}
        />
        {errors.motivation && <p className="text-xs text-danger mt-1">{errors.motivation.message}</p>}
      </div>

      {/* CV Upload */}
      <div>
        <label htmlFor="apply-cv" className="block text-xs font-semibold text-foreground mb-1.5">
          Upload CV (PDF)
        </label>
        <p className="text-[11px] text-muted-foreground mb-1.5">
          Format PDF, maks. 2MB. Belum punya CV?{' '}
          <a href="/cv-builder" className="text-primary hover:underline font-medium">
            Buat CV di sini
          </a>
        </p>
        <label
          htmlFor="apply-cv"
          className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/4 transition-all group"
        >
          <Upload size={16} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors truncate">
            {selectedCvFile && selectedCvFile.length > 0
              ? selectedCvFile[0].name
              : 'Klik untuk pilih file CV (PDF)'}
          </span>
          <input
            id="apply-cv"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            {...register('cvFile', {
              validate: {
                isPdf: (files) => {
                  if (!files || files.length === 0) return true;
                  return files[0].type === ALLOWED_CV_TYPE || 'Berkas harus berformat PDF';
                },
                maxSize: (files) => {
                  if (!files || files.length === 0) return true;
                  return files[0].size <= MAX_CV_SIZE_BYTES || 'Ukuran berkas maksimal 2MB';
                },
              },
            })}
          />
        </label>
        {errors.cvFile && <p className="text-xs text-danger mt-1">{errors.cvFile.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        {submitting ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Mengirim Lamaran...
          </>
        ) : (
          <>
            <Send size={15} />
            Kirim Lamaran
          </>
        )}
      </button>

      <p className="text-[11px] text-muted-foreground text-center">
        Data lamaran akan diproses oleh Tim BKK SMK Al Kaaffah Kepanjen
      </p>
    </form>
  );
}