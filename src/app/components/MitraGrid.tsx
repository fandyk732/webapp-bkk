'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Building2, MapPin, ChevronRight, Loader2 } from 'lucide-react';

export default function CompanyGrid() {
  const supabase = createClient();
  const [mitra, setMitra] = useState<any[]>([]);
  const [selectedMajor, setSelectedMajor] = useState<string>('Semua');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMitra() {
      setLoading(true);
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
              </div>

              <div className="pt-3 border-t border-slate-50 flex justify-end">
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  Lihat Detail <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}