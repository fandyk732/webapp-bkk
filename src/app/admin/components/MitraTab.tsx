'use client';

import React, { useState } from 'react';
import { 
  Plus, Trash2, Image as ImageIcon, Building2, Globe, Mail, 
  Briefcase, FileText, CheckCircle2, Gift, MapPin, Eye, Edit3, X
} from 'lucide-react';
import type { MitraForm } from '../types';

interface MitraTabProps {
  newMitra: MitraForm;
  setNewMitra: React.Dispatch<React.SetStateAction<MitraForm>>;
  handleAddMitra: (e: React.FormEvent) => void;
  handleMajorToggle: (major: string, isJob: boolean) => void;
  mitra: any[];
  handleDeleteMitra: (id: string) => void;
}

export default function MitraTab({
  newMitra,
  setNewMitra,
  handleAddMitra,
  handleMajorToggle,
  mitra,
  handleDeleteMitra,
}: MitraTabProps) {
  const [selectedMitraDetail, setSelectedMitraDetail] = useState<any | null>(null);

  const handleProgramToggle = (program: string) => {
    const currentPrograms = newMitra.program_kemitraan || [];
    if (currentPrograms.includes(program)) {
      setNewMitra({
        ...newMitra,
        program_kemitraan: currentPrograms.filter((p) => p !== program),
      });
    } else {
      setNewMitra({
        ...newMitra,
        program_kemitraan: [...currentPrograms, program],
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Form Tambah/Edit Mitra (7 Columns) */}
      <form 
        onSubmit={handleAddMitra} 
        className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="text-blue-600" size={20} />
              Kelola Profil Mitra Industri
            </h2>
            <p className="text-xs text-slate-500">
              Isi informasi detail agar siswa paham gambaran kerja/PKL di perusahaan ini
            </p>
          </div>
        </div>

        {/* Section 1: Informasi Umum */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            1. Informasi Perusahaan
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Nama Perusahaan *</label>
              <input
                type="text"
                placeholder="PT. Telkom Indonesia / Bengkel Agung"
                value={newMitra.nama}
                onChange={(e) => setNewMitra({ ...newMitra, nama: e.target.value })}
                className="w-full p-2.5 border rounded-xl text-xs focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Sektor / Bidang Industri</label>
              <input
                type="text"
                placeholder="e.g. IT & Software / Otomotif"
                value={newMitra.sektor}
                onChange={(e) => setNewMitra({ ...newMitra, sektor: e.target.value })}
                className="w-full p-2.5 border rounded-xl text-xs focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Kota / Lokasi</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Kepanjen, Kab. Malang"
                  value={newMitra.lokasi}
                  onChange={(e) => setNewMitra({ ...newMitra, lokasi: e.target.value })}
                  className="w-full p-2.5 pl-8 border rounded-xl text-xs focus:outline-none focus:border-blue-600"
                />
                <MapPin size={14} className="absolute left-2.5 top-3 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Periode MOU Kerja Sama</label>
              <input
                type="text"
                placeholder="2024 - 2027"
                value={newMitra.mou_year}
                onChange={(e) => setNewMitra({ ...newMitra, mou_year: e.target.value })}
                className="w-full p-2.5 border rounded-xl text-xs focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block">URL Logo Perusahaan (CDN/ImageKit)</label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://ik.imagekit.io/..."
                  value={newMitra.logo}
                  onChange={(e) => setNewMitra({ ...newMitra, logo: e.target.value })}
                  className="w-full p-2.5 pr-8 border rounded-xl text-xs focus:outline-none focus:border-blue-600"
                />
                <ImageIcon size={14} className="absolute right-2.5 top-3 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Website / Medsos Perusahaan</label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://perusahaan.com"
                  value={newMitra.website || ''}
                  onChange={(e) => setNewMitra({ ...newMitra, website: e.target.value })}
                  className="w-full p-2.5 pl-8 border rounded-xl text-xs focus:outline-none focus:border-blue-600"
                />
                <Globe size={14} className="absolute left-2.5 top-3 text-slate-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Deskripsi Singkat Profil Perusahaan</label>
            <textarea
              rows={2}
              placeholder="PT. Telkom merupakan perusahaan BUMN yang bergerak dibidang penyedia jasa telekomunikasi..."
              value={newMitra.deskripsi || ''}
              onChange={(e) => setNewMitra({ ...newMitra, deskripsi: e.target.value })}
              className="w-full p-2.5 border rounded-xl text-xs focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Section 2: Program & Jurusan Kerjasama */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            2. Skema & Jurusan Kerjasama
          </h3>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">Program Kerjasama Yang Terbuka:</label>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { id: 'PKL', label: '🏬 Tempat PKL / Magang' },
                { id: 'KERJA', label: '💼 Rekrutmen Lulusan (Kerja)' },
                { id: 'GURU_TAMU', label: '👨‍🏫 Guru Tamu Industri' },
                { id: 'BEASISWA', label: '🎓 Beasiswa / CSR' },
              ].map((p) => {
                const isChecked = (newMitra.program_kemitraan || []).includes(p.id);
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => handleProgramToggle(p.id)}
                    className={`px-3 py-1.5 rounded-xl border font-medium text-xs transition-all ${
                      isChecked
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">Jurusan Sekolah Yang Diterima:</label>
            <div className="flex gap-4 text-xs font-medium">
              {['TKJ', 'TAV', 'TKR'].map((m) => (
                <label key={m} className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={newMitra.jurusan.includes(m)}
                    onChange={() => handleMajorToggle(m, false)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>{m}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Gambaran Pekerjaan & Benefit */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            3. Gambaran Tugas & Syarat Siswa
          </h3>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1 block flex items-center gap-1">
              <Briefcase size={12} className="text-blue-600" /> Gambaran Jobdesk / Kegiatan Siswa
            </label>
            <textarea
              rows={3}
              placeholder="Siswa akan ditempatkan di divisi Network Maintenance, melakukan konfigurasi router, perbaikan jaringan fiber optic..."
              value={newMitra.jobdesk_overview || ''}
              onChange={(e) => setNewMitra({ ...newMitra, jobdesk_overview: e.target.value })}
              className="w-full p-2.5 border rounded-xl text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block flex items-center gap-1">
                <CheckCircle2 size={12} className="text-blue-600" /> Kualifikasi / Syarat Siswa
              </label>
              <textarea
                rows={3}
                placeholder="• Memahami dasar Mikrotik&#10;• Disiplin & siap kerja shift&#10;• Punya laptop sendiri"
                value={newMitra.kualifikasi_umum || ''}
                onChange={(e) => setNewMitra({ ...newMitra, kualifikasi_umum: e.target.value })}
                className="w-full p-2.5 border rounded-xl text-xs focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block flex items-center gap-1">
                <Gift size={12} className="text-blue-600" /> Fasilitas & Benefit
              </label>
              <textarea
                rows={3}
                placeholder="• Uang saku bulanan&#10;• Sertifikat Industri&#10;• Mess / Tempat tinggal gratis"
                value={newMitra.fasilitas_benefit || ''}
                onChange={(e) => setNewMitra({ ...newMitra, fasilitas_benefit: e.target.value })}
                className="w-full p-2.5 border rounded-xl text-xs focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          <Plus size={16} /> Simpan Mitra Industri
        </button>
      </form>

      {/* Daftar Mitra (5 Columns) */}
      <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 h-fit">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">
            Daftar Mitra ({mitra.length})
          </h2>
          <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            Terverifikasi
          </span>
        </div>

        <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {mitra.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">Belum ada data mitra terdaftar.</p>
          ) : (
            mitra.map((item) => (
              <div 
                key={item.id} 
                className="p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-white transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.logo ? (
                      <img src={item.logo} alt={item.nama} className="w-10 h-10 object-contain rounded-xl border bg-white p-1" />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-xs">
                        {item.nama?.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{item.nama}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin size={10} /> {item.lokasi || 'Malang'} • MOU: {item.mou_year || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedMitraDetail(item)}
                      title="Preview Detail"
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteMitra(item.id)} 
                      title="Hapus"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  <span className="text-[9px] font-medium bg-blue-100/60 text-blue-700 px-2 py-0.5 rounded-md">
                    {item.sektor || 'Industri'}
                  </span>
                  {item.jurusan?.map((j: string) => (
                    <span key={j} className="text-[9px] font-medium bg-slate-200/60 text-slate-700 px-1.5 py-0.5 rounded-md">
                      {j}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Preview Detail Mitra */}
      {selectedMitraDetail && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {selectedMitraDetail.logo && (
                  <img src={selectedMitraDetail.logo} alt="" className="w-12 h-12 object-contain border rounded-xl p-1" />
                )}
                <div>
                  <h3 className="font-bold text-base text-slate-900">{selectedMitraDetail.nama}</h3>
                  <p className="text-xs text-slate-500">{selectedMitraDetail.sektor} • {selectedMitraDetail.lokasi}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMitraDetail(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {selectedMitraDetail.deskripsi && (
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border">
                {selectedMitraDetail.deskripsi}
              </p>
            )}

            {selectedMitraDetail.jobdesk_overview && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Briefcase size={12} className="text-blue-600" /> Gambaran Pekerjaan / Kegiatan:
                </h4>
                <p className="text-xs text-slate-600 whitespace-pre-line pl-3">
                  {selectedMitraDetail.jobdesk_overview}
                </p>
              </div>
            )}

            {selectedMitraDetail.kualifikasi_umum && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-blue-600" /> Kualifikasi / Syarat:
                </h4>
                <p className="text-xs text-slate-600 whitespace-pre-line pl-3">
                  {selectedMitraDetail.kualifikasi_umum}
                </p>
              </div>
            )}

            {selectedMitraDetail.fasilitas_benefit && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Gift size={12} className="text-blue-600" /> Fasilitas & Benefit:
                </h4>
                <p className="text-xs text-slate-600 whitespace-pre-line pl-3">
                  {selectedMitraDetail.fasilitas_benefit}
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedMitraDetail(null)}
              className="w-full py-2.5 bg-slate-100 font-bold text-slate-700 rounded-xl text-xs hover:bg-slate-200 transition-all"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}