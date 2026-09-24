'use client';

import React from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import type { JobForm } from '../types';

interface VacanciesTabProps {
  newJob: JobForm;
  setNewJob: React.Dispatch<React.SetStateAction<JobForm>>;
  handleAddJob: (e: React.FormEvent) => void;
  handleMajorToggle: (major: string, isJob: boolean) => void;
  vacancies: any[];
  handleToggleJobStatus: (id: string, currentStatus: boolean) => void;
  handleDeleteJob: (id: string) => void;
}

export default function VacanciesTab({
  newJob,
  setNewJob,
  handleAddJob,
  handleMajorToggle,
  vacancies,
  handleToggleJobStatus,
  handleDeleteJob,
}: VacanciesTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form onSubmit={handleAddJob} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3 h-fit">
        <h2 className="text-lg font-semibold text-slate-800">Tambah Lowongan Baru</h2>
        
        <input
          type="text"
          placeholder="Judul Posisi *"
          value={newJob.title}
          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
          className="w-full p-2.5 border rounded-xl text-sm"
          required
        />

        <input
          type="text"
          placeholder="Nama Perusahaan *"
          value={newJob.company}
          onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
          className="w-full p-2.5 border rounded-xl text-sm"
          required
        />

        <div className="relative">
          <input
            type="url"
            placeholder="URL Logo Perusahaan (ImageKit/CDN)"
            value={newJob.company_logo}
            onChange={(e) => setNewJob({ ...newJob, company_logo: e.target.value })}
            className="w-full p-2.5 pr-9 border rounded-xl text-sm"
          />
          <ImageIcon size={16} className="absolute right-3 top-3.5 text-slate-400" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            value={newJob.type}
            onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
            className="w-full p-2.5 border rounded-xl text-sm"
          >
            <option value="PKL">PKL</option>
            <option value="Kerja">Kerja</option>
            <option value="Keduanya">Keduanya</option>
          </select>
          <input
            type="number"
            placeholder="Kuota Slot"
            value={newJob.quota}
            onChange={(e) => setNewJob({ ...newJob, quota: Number(e.target.value) })}
            className="w-full p-2.5 border rounded-xl text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Gaji / Uang Saku"
            value={newJob.salary}
            onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
            className="w-full p-2.5 border rounded-xl text-sm"
          />
          <input
            type="date"
            value={newJob.deadline}
            onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
            className="w-full p-2.5 border rounded-xl text-sm"
          />
        </div>

        <input
          type="text"
          placeholder="Lokasi (e.g. Malang, Remote)"
          value={newJob.location}
          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
          className="w-full p-2.5 border rounded-xl text-sm"
        />

        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Target Jurusan:</label>
          <div className="flex gap-3 text-sm">
            {['TKJ', 'TAV', 'TKR'].map((m) => (
              <label key={m} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newJob.majors.includes(m)}
                  onChange={() => handleMajorToggle(m, true)}
                  className="rounded text-blue-600"
                />
                <span>{m}</span>
              </label>
            ))}
          </div>
        </div>

        <input
          type="text"
          placeholder="Kualifikasi (Pisahkan koma)"
          value={newJob.qualifications}
          onChange={(e) => setNewJob({ ...newJob, qualifications: e.target.value })}
          className="w-full p-2.5 border rounded-xl text-sm"
        />

        <input
          type="text"
          placeholder="Fasilitas/Benefits (Pisahkan koma)"
          value={newJob.benefits}
          onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
          className="w-full p-2.5 border rounded-xl text-sm"
        />

        <textarea
          placeholder="Deskripsi Pekerjaan"
          value={newJob.description}
          onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
          className="w-full p-2.5 border rounded-xl text-sm h-20"
        />

        <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Terbitkan Lowongan
        </button>
      </form>

      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Daftar Lowongan ({vacancies.length})</h2>
        <div className="divide-y">
          {vacancies.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">Belum ada lowongan.</p>
          ) : (
            vacancies.map((job) => (
              <div key={job.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company} className="w-10 h-10 object-contain rounded-lg border p-1" />
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs">
                      {job.company?.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-800">{job.title}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        job.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {job.is_active ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{job.company} • <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">{job.type}</span> • Slot: {(job.quota || 0) - (job.quota_used || 0)}/{job.quota}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggleJobStatus(job.id, job.is_active)} className="text-xs px-2.5 py-1 border rounded-lg hover:bg-slate-50">
                    {job.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button onClick={() => handleDeleteJob(job.id)} className="text-red-500 hover:text-red-700 p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}