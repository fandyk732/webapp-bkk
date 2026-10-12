'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  Building2, MapPin, ChevronRight, Loader2, X, Globe, 
  Briefcase, CheckCircle2, Gift, Sparkles 
} from 'lucide-react';

export default function CompanyGrid() {
  const supabase = createClient();
  const [mitra, setMitra] = useState<any[]>([]);
  const [selectedMajor, setSelectedMajor] = useState<string>('Semua');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMitra, setSelectedMitra] = useState<any | null>(null);

  useEffect(() => {
    async function fetchMitra() {
      setLoading(true);
      // Fetch seluruh kolom detail mitra
      const { data, error } = await supabase
        .from('mitra_industri')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMitra(data);
      }
      setLoading(false);
    }

    fetchMitra();
  }, []);

  const filteredMitra = mitra.filter((item) => {
    if (selectedMajor === 'Semua') return true;
    return item.jurusan && item.jurusan.includes(selectedMajor);
  });

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Mitra Industri</h2>
          <p className="text-slate-500 text-sm">
            {filteredMitra.length} perusahaan mitra aktif
          </p>
        </div>

        {/* Filter Jurusan */}
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          {['Semua', 'TKJ', 'TAV', 'TKR'].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMajor(m)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedMajor === m
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={24} />
        </div>
      ) : filteredMitra.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <Building2 className="mx-auto text-slate-400 mb-2" size={32} />
          <p className="text-slate-600 font-medium">Belum ada mitra industri terdaftar</p>
          <p className="text-slate-400 text-xs mt-1">Tambahkan data melalui Admin Panel BKK</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMitra.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {item.logo ? (
                    <img
                      src={item.logo}
                      alt={item.nama}
                      className="w-12 h-12 object-contain rounded-xl border p-1"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 font-bold rounded-xl flex items-center justify-center border border-blue-100">
                      {item.nama?.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{item.nama}</h3>
                    <p className="text-slate-500 text-xs flex items-center gap-1">
                      <MapPin size={12} /> {item.lokasi || 'Malang'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 my-3">
                  <span className="text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {item.sektor || 'Industri'}
                  </span>
                  {item.jurusan?.map((j: string) => (
                    <span
                      key={j}
                      className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                    >
                      {j}
                    </span>
                  ))}
                </div>

                {/* Deskripsi Singkat di Card */}
                {item.deskripsi && (
                  <p className="text-xs text-slate-500 line-clamp-2 my-2 leading-relaxed">
                    {item.deskripsi}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-50 flex justify-end">
                <button 
                  onClick={() => setSelectedMitra(item)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-all"
                >
                  Lihat Detail <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* POP-UP MODAL DETAIL MITRA INDUSTRI UNTUK SISWA */}
      {selectedMitra && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Header Modal */}
            <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                {selectedMitra.logo ? (
                  <img
                    src={selectedMitra.logo}
                    alt={selectedMitra.nama}
                    className="w-16 h-16 object-contain rounded-2xl border p-1.5 bg-white shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 font-black rounded-2xl flex items-center justify-center border border-blue-100 text-xl shrink-0">
                    {selectedMitra.nama?.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{selectedMitra.nama}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-2.5 mt-0.5">
                    <span className="flex items-center gap-1"><MapPin size={12} className="text-blue-600" /> {selectedMitra.lokasi || 'Malang'}</span>
                    <span>•</span>
                    <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">{selectedMitra.sektor || 'Industri'}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMitra(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Badges Program & Jurusan */}
            <div className="flex flex-wrap items-center gap-2">
              {selectedMitra.program_kemitraan?.map((p: string) => (
                <span key={p} className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-xl flex items-center gap-1">
                  <Sparkles size={12} /> {p === 'PKL' ? 'Tempat PKL' : p === 'KERJA' ? 'Rekrutmen Kerja' : p}
                </span>
              ))}
              {selectedMitra.jurusan?.map((j: string) => (
                <span key={j} className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
                  Jurusan {j}
                </span>
              ))}
            </div>

            {/* Deskripsi Profil */}
            {selectedMitra.deskripsi && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tentang Perusahaan</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedMitra.deskripsi}</p>
              </div>
            )}

            {/* Jobdesk & Gambaran Pekerjaan */}
            {selectedMitra.jobdesk_overview && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Briefcase size={15} className="text-blue-600" /> Gambaran Pekerjaan / Kegiatan Siswa:
                </h4>
                <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pl-5 bg-blue-50/40 p-3 rounded-xl border border-blue-50">
                  {selectedMitra.jobdesk_overview}
                </div>
              </div>
            )}

            {/* Grid Kualifikasi & Benefit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedMitra.kualifikasi_umum && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600" /> Kualifikasi & Persyaratan:
                  </h4>
                  <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedMitra.kualifikasi_umum}
                  </div>
                </div>
              )}

              {selectedMitra.fasilitas_benefit && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Gift size={15} className="text-amber-600" /> Fasilitas & Benefit:
                  </h4>
                  <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-amber-50/40 p-3 rounded-xl border border-amber-100/50">
                    {selectedMitra.fasilitas_benefit}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal Action */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              {selectedMitra.website ? (
                <a
                  href={selectedMitra.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
                >
                  <Globe size={14} /> Kunjungi Website Perusahaan
                </a>
              ) : (
                <span className="text-[11px] text-slate-400">Kerjasama Resmi BKK SMK Al Kaaffah</span>
              )}

              <button
                onClick={() => setSelectedMitra(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}