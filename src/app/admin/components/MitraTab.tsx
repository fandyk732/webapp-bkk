'use client';

import React from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form onSubmit={handleAddMitra} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3 h-fit">
        <h2 className="text-lg font-semibold text-slate-800">Tambah Mitra Industri</h2>
        
        <input
          type="text"
          placeholder="Nama Perusahaan *"
          value={newMitra.nama}
          onChange={(e) => setNewMitra({ ...newMitra, nama: e.target.value })}
          className="w-full p-2.5 border rounded-xl text-sm"
          required
        />

        <div className="relative">
          <input
            type="url"
            placeholder="URL Logo Perusahaan (ImageKit/CDN)"
            value={newMitra.logo}
            onChange={(e) => setNewMitra({ ...newMitra, logo: e.target.value })}
            className="w-full p-2.5 pr-9 border rounded-xl text-sm"
          />
          <ImageIcon size={16} className="absolute right-3 top-3.5 text-slate-400" />
        </div>

        <input
          type="text"
          placeholder="Sektor (e.g. Teknologi & Informasi)"
          value={newMitra.sektor}
          onChange={(e) => setNewMitra({ ...newMitra, sektor: e.target.value })}
          className="w-full p-2.5 border rounded-xl text-sm"
        />

        <input
          type="text"
          placeholder="Lokasi Kota"
          value={newMitra.lokasi}
          onChange={(e) => setNewMitra({ ...newMitra, lokasi: e.target.value })}
          className="w-full p-2.5 border rounded-xl text-sm"
        />

        <input
          type="text"
          placeholder="Periode MOU (e.g. 2024-2027)"
          value={newMitra.mou_year}
          onChange={(e) => setNewMitra({ ...newMitra, mou_year: e.target.value })}
          className="w-full p-2.5 border rounded-xl text-sm"
        />

        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Jurusan Kerjasama:</label>
          <div className="flex gap-3 text-sm">
            {['TKJ', 'TAV', 'TKR'].map((m) => (
              <label key={m} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newMitra.jurusan.includes(m)}
                  onChange={() => handleMajorToggle(m, false)}
                  className="rounded text-blue-600"
                />
                <span>{m}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Simpan Mitra
        </button>
      </form>

      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Daftar Mitra Industri ({mitra.length})</h2>
        <div className="divide-y">
          {mitra.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">Belum ada data mitra.</p>
          ) : (
            mitra.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.logo ? (
                    <img src={item.logo} alt={item.nama} className="w-10 h-10 object-contain rounded-lg border p-1" />
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs">
                      {item.nama?.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-800">{item.nama}</p>
                    <p className="text-xs text-slate-500">{item.sektor} • {item.lokasi} • MOU: {item.mou_year}</p>
                  </div>
                </div>
                <button onClick={() => handleDeleteMitra(item.id)} className="text-red-500 hover:text-red-700 p-2">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}