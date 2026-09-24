'use client';

import React from 'react';
import { Trash2, FileText, MessageSquare } from 'lucide-react';

interface ApplicationsTabProps {
  applicants: any[];
  handleUpdateApplicantStatus: (id: string, status: string) => void;
  handleDeleteApplicant: (id: string) => void;
}

export default function ApplicationsTab({
  applicants,
  handleUpdateApplicantStatus,
  handleDeleteApplicant,
}: ApplicationsTabProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Daftar Pelamar PKL & Lowongan Kerja</h2>
          <p className="text-xs text-slate-500">Masuk secara realtime dari form pendaftaran siswa / alumni</p>
        </div>
        <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          Total: {applicants.length} Pelamar
        </span>
      </div>

      {applicants.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">Belum ada data lamaran yang masuk.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Nama Pelamar</th>
                <th className="p-3">Posisi & Perusahaan</th>
                <th className="p-3">Tipe</th>
                <th className="p-3">Jurusan / NISN</th>
                <th className="p-3">Kontak & CV</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {applicants.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 text-xs text-slate-400 whitespace-nowrap">
                    {new Date(a.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-slate-800">{a.nama_lengkap}</p>
                    {a.catatan && (
                      <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">{a.catatan}</p>
                    )}
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-slate-800">{a.posisi_dilamar}</p>
                    <p className="text-xs text-slate-400">{a.nama_perusahaan}</p>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      a.tipe_lamaran === 'PKL' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {a.tipe_lamaran}
                    </span>
                  </td>
                  <td className="p-3 text-xs whitespace-nowrap">
                    <p className="font-semibold text-slate-800">{a.jurusan}</p>
                    <p className="text-slate-400">NISN: {a.nisn || '-'}</p>
                  </td>
                  <td className="p-3 text-xs space-y-1.5 whitespace-nowrap">
                    <a 
                      href={`https://wa.me/${a.no_whatsapp?.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold hover:underline block"
                    >
                      <MessageSquare size={13} /> WhatsApp
                    </a>
                    {a.link_cv && a.link_cv.trim() !== '' ? (
                      <a 
                        href={a.link_cv} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:underline block"
                      >
                        <FileText size={13} /> Lihat CV (PDF)
                      </a>
                    ) : (
                      <p className="text-slate-400 text-[11px] italic">Tidak ada CV</p>
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <select
                      value={a.status || 'Menunggu Review'}
                      onChange={(e) => handleUpdateApplicantStatus(a.id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border appearance-none cursor-pointer ${
                        a.status === 'Diterima' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        a.status === 'Ditolak' ? 'bg-red-50 text-red-800 border-red-200' :
                        'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      <option value="Menunggu Review">Menunggu Review</option>
                      <option value="Diterima">Diterima</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleDeleteApplicant(a.id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}