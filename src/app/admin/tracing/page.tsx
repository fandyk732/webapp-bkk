'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Filter, MessageCircle, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

interface StudentSurvey {
  id: string;
  student_name: string;
  kelas: string;
  major: string;
  phone: string;
  career_plan: 'KERJA' | 'PKL' | 'KULIAH' | 'WIRAUSAHA';
  target_position: string;
  target_company_or_campus: string;
  target_location: string;
  status_counseling: 'SIAP' | 'PERLU_KONSELING' | 'BUTUH_LOKER';
  updated_at: string;
}

export default function AdminTracingPage() {
  const supabase = createClient();
  const [surveys, setSurveys] = useState<StudentSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('ALL');
  const [filterCounseling, setFilterCounseling] = useState('ALL');

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('student_surveys')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setSurveys(data || []);
    }
    setLoading(false);
  };

  // Filter Data
  const filteredSurveys = surveys.filter((s) => {
    const matchesSearch =
      s.student_name.toLowerCase().includes(search.toLowerCase()) ||
      s.major.toLowerCase().includes(search.toLowerCase()) ||
      s.kelas.toLowerCase().includes(search.toLowerCase());

    const matchesPlan = filterPlan === 'ALL' || s.career_plan === filterPlan;
    const matchesCounseling = filterCounseling === 'ALL' || s.status_counseling === filterCounseling;

    return matchesSearch && matchesPlan && matchesCounseling;
  });

  // Fungsi Kirim WA Otomatis untuk Guru BK
  const handleSendWA = (student: StudentSurvey) => {
    const cleanPhone = student.phone ? student.phone.replace(/^0/, '62') : '';
    let message = '';

    if (student.status_counseling === 'PERLU_KONSELING') {
      message = `Halo ${student.student_name}, saya Guru BK BKK SMK Al Kaaffah. Saya lihat di sistem kamu masih bingung untuk rencana ${student.career_plan}. Yuk luangkan waktu untuk konsultasi di ruang BK.`;
    } else {
      message = `Halo ${student.student_name}, terkait target kamu untuk ${student.career_plan} (${student.target_position} di ${student.target_company_or_campus || 'perusahaan target'}), ada info lowongan/informasi terbaru dari BKK nih. Boleh kita diskusikan?`;
    }

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Monitoring & Tracing Minat Siswa</h1>
        <p className="text-xs text-slate-500 mt-1">
          Pantau target karir, lokasi impian, dan kebutuhan konseling siswa secara real-time.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama siswa, kelas, jurusan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-primary"
          />
        </div>

        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
        >
          <option value="ALL">Semua Rencana Karir</option>
          <option value="KERJA">💼 Kerja</option>
          <option value="PKL">🏬 PKL</option>
          <option value="KULIAH">🎓 Kuliah</option>
          <option value="WIRAUSAHA">🚀 Wirausaha</option>
        </select>

        <select
          value={filterCounseling}
          onChange={(e) => setFilterCounseling(e.target.value)}
          className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
        >
          <option value="ALL">Semua Status Konseling</option>
          <option value="PERLU_KONSELING">🔴 Perlu Konseling BK</option>
          <option value="BUTUH_LOKER">🟡 Butuh Rekomendasi Loker</option>
          <option value="SIAP">🟢 Siap / Mandiri</option>
        </select>
      </div>

      {/* Tabel Monitoring */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Siswa</th>
                <th className="p-4">Rencana</th>
                <th className="p-4">Target Posisi & Perusahaan/Kampus</th>
                <th className="p-4">Lokasi Target</th>
                <th className="p-4">Status BK</th>
                <th className="p-4 text-center">Aksi (WA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Memuat data monitoring...</td>
                </tr>
              ) : filteredSurveys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Belum ada data survey yang cocok.</td>
                </tr>
              ) : (
                filteredSurveys.map((survey) => (
                  <tr key={survey.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Nama & Kelas */}
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{survey.student_name}</div>
                      <div className="text-[10px] text-slate-500">{survey.kelas} — {survey.major}</div>
                    </td>

                    {/* Rencana */}
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        survey.career_plan === 'KERJA' ? 'bg-blue-50 text-blue-600' :
                        survey.career_plan === 'PKL' ? 'bg-purple-50 text-purple-600' :
                        survey.career_plan === 'KULIAH' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {survey.career_plan}
                      </span>
                    </td>

                    {/* Target Posisi */}
                    <td className="p-4">
                      <div className="font-semibold text-slate-700">{survey.target_position}</div>
                      <div className="text-[10px] text-slate-500">{survey.target_company_or_campus || '-'}</div>
                    </td>

                    {/* Lokasi */}
                    <td className="p-4 text-slate-600 font-medium">
                      📍 {survey.target_location}
                    </td>

                    {/* Status Konseling */}
                    <td className="p-4">
                      {survey.status_counseling === 'PERLU_KONSELING' && (
                        <span className="flex items-center gap-1 text-red-600 font-bold text-[11px] bg-red-50 px-2.5 py-1 rounded-lg w-fit">
                          <AlertCircle size={13} /> Perlu Konseling
                        </span>
                      )}
                      {survey.status_counseling === 'BUTUH_LOKER' && (
                        <span className="flex items-center gap-1 text-amber-600 font-bold text-[11px] bg-amber-50 px-2.5 py-1 rounded-lg w-fit">
                          <HelpCircle size={13} /> Butuh Loker/PKL
                        </span>
                      )}
                      {survey.status_counseling === 'SIAP' && (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px] bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">
                          <CheckCircle2 size={13} /> Siap / Mandiri
                        </span>
                      )}
                    </td>

                    {/* Tombol Aksi Chat WA */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleSendWA(survey)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-[11px] font-semibold hover:bg-emerald-700 transition-all shadow-sm"
                        title="Hubungi Siswa via WA"
                      >
                        <MessageCircle size={13} /> Hubungi BK
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}