'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  X, MapPin, Briefcase, GraduationCap, Clock, Users, CheckCircle2,
  Upload, Send, ChevronDown, Star, LogIn, Lock,
} from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

interface ApplyFormData {
  fullName: string;
  nis: string;
  kelas: string;
  major: string;
  phone: string;
  email: string;
  motivation: string;
  cvFile: FileList;
}

export default function ApplyDrawer({
  vacancy,
  onClose,
}: {
  vacancy: {
    id: string;
    title: string;
    company: string;
    companyLogo: string;
    location: string;
    type: string;
    majors: string[];
    salary: string;
    deadline: string;
    daysLeft: number;
    qualifications: string[];
    description: string;
    quota: number;
    quotaUsed: number;
    benefits: string[];
  };
  onClose: () => void;
}) {
  const supabase = createClient();
  const [tab, setTab] = useState<'detail' | 'apply'>('detail');
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

  // Cek Status Login & Auto-Fill Data User
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
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
      // 1. Upload file CV ke Supabase Storage (Bucket: 'cvs')
      if (data.cvFile && data.cvFile.length > 0) {
        const file = data.cvFile[0];
        const fileExt = file.name.split('.').pop() || 'pdf';
        const fileName = `${Date.now()}_${data.nis}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `resumes/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('cvs')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw new Error('Gagal unggah berkas CV: ' + uploadError.message);
        }

        // Ambil Public URL
        const { data: publicUrlData } = supabase.storage
          .from('cvs')
          .getPublicUrl(filePath);

        cvPublicUrl = publicUrlData.publicUrl;
      }

      // 2. Insert data pelamar ke tabel Supabase 'pelamar'
      const { error: insertError } = await supabase.from('pelamar').insert([
        {
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

      if (insertError) {
        throw new Error(insertError.message);
      }

      toast.success(`Lamaran untuk "${vacancy.title}" berhasil dikirim! Tim BKK akan menghubungi kamu.`);
      reset();
      onClose();
    } catch (err: any) {
      toast.error(`Gagal mengirim lamaran: ${err.message || 'Terjadi kesalahan sistem'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const urgencyClass =
    vacancy.daysLeft <= 5
      ? 'badge-deadline-urgent'
      : vacancy.daysLeft <= 14
      ? 'badge-deadline-soon'
      : 'badge-deadline-ok';

  return (
    <div className="fixed inset-0 z-[200] flex">
      <div className="drawer-overlay absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
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

        <div className="flex-1 overflow-y-auto">
          {tab === 'detail' ? (
            <div className="px-6 py-5 flex flex-col gap-5">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  vacancy.type === 'PKL' ? 'badge-pkl' : vacancy.type === 'Kerja' ? 'badge-kerja' : 'badge-keduanya'
                }`}>
                  {vacancy.type}
                </span>
                {vacancy.majors?.map((maj) => (
                  <span key={`drawer-maj-${maj}`} className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    maj === 'TKJ' ? 'badge-tkj' : maj === 'TAV' ? 'badge-tav' : 'badge-tkr'
                  }`}>
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
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Lokasi</p>
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
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Kuota</p>
                  <div className="flex items-center gap-1">
                    <Users size={11} className="text-primary shrink-0" />
                    <p className="text-xs font-semibold text-foreground tabular">
                      {(vacancy.quota || 0) - (vacancy.quotaUsed || 0)} slot tersisa
                    </p>
                  </div>
                </div>
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Deadline</p>
                  <div className="flex items-center gap-1">
                    <Clock size={11} className="text-primary shrink-0" />
                    <p className="text-xs font-semibold text-foreground">{vacancy.deadline}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Deskripsi Pekerjaan</h4>
                <p className="text-sm text-foreground leading-relaxed">{vacancy.description}</p>
              </div>

              {/* Qualifications */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Persyaratan</h4>
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
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Fasilitas & Benefit</h4>
                <div className="flex flex-wrap gap-2">
                  {vacancy.benefits?.map((b) => (
                    <span key={`benefit-${vacancy.id}-${b}`} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-primary/8 text-primary font-medium">
                      <Star size={10} />
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA to apply tab */}
              <button
                onClick={() => setTab('apply')}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all active:scale-95 mt-2"
              >
                Lamar Sekarang →
              </button>
            </div>
          ) : (
            /* TAB FORM LAMARAN */
            !checkingAuth && !user ? (
              /* Tampilan Jika Belum Login */
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
            ) : (
              /* Form Lamaran Utama */
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
                  {errors.fullName && (
                    <p className="text-xs text-danger mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                {/* NIS */}
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
                    {errors.nis && (
                      <p className="text-xs text-danger mt-1">{errors.nis.message}</p>
                    )}
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
                    {errors.kelas && (
                      <p className="text-xs text-danger mt-1">{errors.kelas.message}</p>
                    )}
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
                  {errors.major && (
                    <p className="text-xs text-danger mt-1">{errors.major.message}</p>
                  )}
                </div>

                {/* Phone + Email */}
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
                    {errors.phone && (
                      <p className="text-xs text-danger mt-1">{errors.phone.message}</p>
                    )}
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
                    {errors.email && (
                      <p className="text-xs text-danger mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Motivation */}
                <div>
                  <label htmlFor="apply-motivation" className="block text-xs font-semibold text-foreground mb-1.5">
                    Motivasi Melamar <span className="text-danger">*</span>
                  </label>
                  <p className="text-[11px] text-muted-foreground mb-1.5">Ceritakan mengapa kamu tertarik dengan posisi ini (min. 50 karakter)</p>
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
                  {errors.motivation && (
                    <p className="text-xs text-danger mt-1">{errors.motivation.message}</p>
                  )}
                </div>

                {/* CV Upload */}
                <div>
                  <label htmlFor="apply-cv" className="block text-xs font-semibold text-foreground mb-1.5">
                    Upload CV (PDF)
                  </label>
                  <p className="text-[11px] text-muted-foreground mb-1.5">Format PDF, maks. 2MB. Belum punya CV?{' '}
                    <a href="/cv-builder" className="text-primary hover:underline font-medium">Buat CV di sini</a>
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
                      accept=".pdf"
                      className="hidden"
                      {...register('cvFile')}
                    />
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  style={{ minWidth: '160px' }}
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
            )
          )}
        </div>
      </div>
    </div>
  );
}