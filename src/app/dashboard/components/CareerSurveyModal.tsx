'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Target, Building, MapPin, Sparkles, HelpCircle, Bell } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface SurveyFormInput {
  career_plan: 'KERJA' | 'PKL' | 'KULIAH' | 'WIRAUSAHA';
  target_position: string;
  target_company_or_campus: string;
  target_location: string;
  status_counseling: 'SIAP' | 'PERLU_KONSELING' | 'BUTUH_LOKER';
}

export default function CareerSurveyModal({
  userId,
  studentProfile,
  onSuccess,
}: {
  userId: string;
  studentProfile: { name: string; kelas: string; major: string; phone: string };
  onSuccess: () => void;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SurveyFormInput>();

  const selectedPlan = watch('career_plan', 'KERJA');

  const onSubmit = async (data: SurveyFormInput) => {
    setLoading(true);
    const { error } = await supabase.from('student_surveys').upsert({
      user_id: userId,
      student_name: studentProfile.name,
      kelas: studentProfile.kelas,
      major: studentProfile.major,
      phone: studentProfile.phone,
      ...data,
      updated_at: new Date().toISOString(),
    });

    setLoading(false);

    if (error) {
      toast.error('Gagal menyimpan pemetaan minat!');
      console.error(error);
    } else {
      toast.success('Terima kasih! Rencana kamu telah dicatat oleh Guru BK.');
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Pemetaan Minat Pasca Lulus / PKL</h3>
            <p className="text-xs text-slate-500">Bantu Guru BK BKK memetakan karir impianmu</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Pilih Rencana */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Rencana Utama Kamu
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'KERJA', label: '💼 Kerja Langsung' },
                { id: 'PKL', label: '🏬 Cari Tempat PKL' },
                { id: 'KULIAH', label: '🎓 Lanjut Kuliah' },
                { id: 'WIRAUSAHA', label: '🚀 Wirausaha / Bisnis' },
              ].map((plan) => (
                <label
                  key={plan.id}
                  className={`flex items-center justify-center p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-primary bg-primary/5 text-primary shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    value={plan.id}
                    {...register('career_plan', { required: true })}
                    className="sr-only"
                  />
                  {plan.label}
                </label>
              ))}
            </div>
          </div>

          {/* Posisi Impian */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Target size={14} className="text-primary" />
              {selectedPlan === 'KULIAH' ? 'Jurusan Impian' : 'Posisi / Bidang Impian'}
            </label>
            <input
              type="text"
              placeholder={selectedPlan === 'KULIAH' ? 'Contoh: Teknik Informatika' : 'Contoh: Web Developer, Teknisi, Admin'}
              {...register('target_position', { required: 'Wajib diisi' })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary"
            />
            {errors.target_position && <span className="text-[10px] text-red-500 mt-0.5">Wajib diisi</span>}
          </div>

          {/* Perusahaan / Kampus Impian */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Building size={14} className="text-primary" />
              {selectedPlan === 'KULIAH' ? 'Target Kampus' : 'Target Perusahaan / Industri'}
            </label>
            <input
              type="text"
              placeholder={selectedPlan === 'KULIAH' ? 'Contoh: Universitas Negeri Malang' : 'Contoh: PT Telkom, Paragon, Bengkel Lokal'}
              {...register('target_company_or_campus')}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Target Lokasi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin size={14} className="text-primary" />
              Target Lokasi Kerja / PKL
            </label>
            <input
              type="text"
              placeholder="Contoh: Malang / Kepanjen / Surabaya / Luar Negeri"
              {...register('target_location', { required: 'Wajib diisi' })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Status Bantuan BK */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <HelpCircle size={14} className="text-primary" />
              Apakah Butuh Bantuan Guru BK?
            </label>
            <select
              {...register('status_counseling')}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary bg-white"
            >
              <option value="SIAP">Siap Melamar & Sudah Punya Tujuan</option>
              <option value="BUTUH_LOKER">Butuh Rekomendasi Lowongan / Tempat PKL</option>
              <option value="PERLU_KONSELING">Masih Bingung & Perlu Sesi Konseling BK</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading ? 'Menyimpan...' : 'Simpan Minat Karir Saya'}
          </button>
        </form>
      </div>
    </div>
  );
}