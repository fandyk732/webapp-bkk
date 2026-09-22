'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  Building2, 
  Briefcase, 
  Users, 
  BarChart3, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  MessageSquare,
  LogOut
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export default function AdminDashboard() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'stats' | 'mitra' | 'vacancies' | 'applications'>('stats');
  const [loading, setLoading] = useState(true);

  // Database States
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [mitra, setMitra] = useState<any[]>([]);
  const [alumni, setAlumni] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);

  // Stats State
  const [statsData, setStatsData] = useState({
    mitraAktif: 0,
    lowonganTerbuka: 0,
    slotPKL: 0,
    tingkatPenempatan: '0.0',
    totalPelamar: 0
  });

  // Form States - Mitra
  const [newMitra, setNewMitra] = useState({
    nama: '',
    logo: '',
    sektor: 'Teknologi & Informasi',
    lokasi: 'Malang',
    jurusan: ['TKJ'],
    mou_year: '2024-2027',
    kerjasama_sejak: 2024,
    status: 'Aktif'
  });

  // Form States - Lowongan
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    company_logo: '',
    type: 'PKL',
    majors: ['TKJ'],
    location: 'Malang',
    salary: 'Uang Saku',
    deadline: '2026-12-31',
    description: '',
    quota: 5,
    qualifications: 'Disiplin, Jujur, Pekerja keras',
    benefits: 'Sertifikat, Uang Makan'
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const { data: vacData } = await supabase.from('lowongan_kerja').select('*').order('created_at', { ascending: false });
      const { data: mitraData } = await supabase.from('mitra_industri').select('*').order('created_at', { ascending: false });
      const { data: alumniData } = await supabase.from('alumni').select('*');
      const { data: applicantsData } = await supabase.from('pelamar').select('*').order('created_at', { ascending: false });

      setVacancies(vacData || []);
      setMitra(mitraData || []);
      setAlumni(alumniData || []);
      setApplicants(applicantsData || []);

      const activeJobs = (vacData || []).filter((v) => v.is_active);
      const uniqueCompanies = new Set((vacData || []).map((v) => v.company)).size;
      const pklQuota = activeJobs
        .filter((v) => ['PKL', 'Keduanya'].includes(v.type))
        .reduce((acc, curr) => acc + Math.max(0, (curr.quota || 0) - (curr.quota_used || 0)), 0);

      const totalAlumni = (alumniData || []).length;
      const terserap = (alumniData || []).filter((a) => a.status_penempatan !== 'Belum Bekerja').length;

      setStatsData({
        mitraAktif: uniqueCompanies || (mitraData || []).length,
        lowonganTerbuka: activeJobs.length,
        slotPKL: pklQuota,
        tingkatPenempatan: totalAlumni > 0 ? ((terserap / totalAlumni) * 100).toFixed(1) : '0.0',
        totalPelamar: (applicantsData || []).length
      });
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handler Jurusan Checkbox
  const handleMajorToggle = (major: string, isJob: boolean) => {
    if (isJob) {
      const current = newJob.majors;
      const updated = current.includes(major) ? current.filter((m) => m !== major) : [...current, major];
      setNewJob({ ...newJob, majors: updated });
    } else {
      const current = newMitra.jurusan;
      const updated = current.includes(major) ? current.filter((m) => m !== major) : [...current, major];
      setNewMitra({ ...newMitra, jurusan: updated });
    }
  };

  // Submit Handlers
  const handleAddMitra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMitra.nama) return;

    const { error } = await supabase.from('mitra_industri').insert([
      {
        ...newMitra,
        kerjasama_sejak: Number(newMitra.mou_year.split('-')[0]) || 2024
      }
    ]);

    if (error) {
      alert('Gagal menambah mitra: ' + error.message);
    } else {
      alert('Mitra Industri berhasil disimpan!');
      setNewMitra({ ...newMitra, nama: '', logo: '' });
      loadAllData();
    }
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.company) return;

    const { error } = await supabase.from('lowongan_kerja').insert([
      {
        title: newJob.title,
        company: newJob.company,
        company_logo: newJob.company_logo,
        type: newJob.type,
        majors: newJob.majors,
        location: newJob.location,
        salary: newJob.salary,
        deadline: newJob.deadline,
        description: newJob.description,
        quota: Number(newJob.quota),
        quota_used: 0,
        is_active: true,
        qualifications: newJob.qualifications.split(',').map((q) => q.trim()),
        benefits: newJob.benefits.split(',').map((b) => b.trim())
      }
    ]);

    if (error) {
      alert('Gagal menambah lowongan: ' + error.message);
    } else {
      alert('Lowongan berhasil diterbitkan!');
      setNewJob({ ...newJob, title: '', company: '', company_logo: '', description: '' });
      loadAllData();
    }
  };

  const handleDeleteMitra = async (id: string) => {
    if (!confirm('Hapus mitra ini?')) return;
    await supabase.from('mitra_industri').delete().eq('id', id);
    loadAllData();
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Hapus lowongan ini?')) return;
    await supabase.from('lowongan_kerja').delete().eq('id', id);
    loadAllData();
  };

  const handleToggleJobStatus = async (id: string, currentStatus: boolean) => {
    await supabase.from('lowongan_kerja').update({ is_active: !currentStatus }).eq('id', id);
    loadAllData();
  };

  // Pelamar Handlers
  const handleUpdateApplicantStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('pelamar').update({ status }).eq('id', id);
    if (error) {
      alert('Gagal memperbarui status: ' + error.message);
    } else {
      loadAllData();
    }
  };

  const handleDeleteApplicant = async (id: string) => {
    if (!confirm('Hapus data pelamar ini?')) return;
    await supabase.from('pelamar').delete().eq('id', id);
    loadAllData();
  };

    const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Panel BKK</h1>
            <p className="text-sm text-slate-500">Manajemen Lowongan, Mitra, dan Pelamar Siswa (Database Connected)</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadAllData} className="p-2 border rounded-xl hover:bg-slate-100 transition-colors text-slate-600" title="Refresh Data">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <Link href="/" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
              <ArrowLeft size={16} /> Kembali ke Landing Page
            </Link>
          </div>
        </div>

                <div className="flex items-center gap-3">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors"
          >
            <LogOut size={14} /> Keluar Admin
          </button>
          
          <button onClick={loadAllData} className="p-2 border rounded-xl hover:bg-slate-100 text-slate-600">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'stats' ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 size={18} /> Ringkasan
          </button>
          <button
            onClick={() => setActiveTab('mitra')}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'mitra' ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 size={18} /> Mitra Industri ({mitra.length})
          </button>
          <button
            onClick={() => setActiveTab('vacancies')}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'vacancies' ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase size={18} /> Lowongan ({vacancies.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'applications' ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={18} /> Data Pelamar ({applicants.length})
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-100">
            <Loader2 className="animate-spin text-blue-600 mr-2" size={24} />
            <span className="text-sm font-medium text-slate-600">Proses sinkronisasi data...</span>
          </div>
        )}

        {/* TAB 1: RINGKASAN */}
        {!loading && activeTab === 'stats' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 max-w-3xl">
            <h2 className="text-lg font-semibold text-slate-800">Statistik Realtime Database</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-xs font-semibold text-blue-600">Mitra Industri</p>
                <p className="text-3xl font-black text-blue-900 mt-1">{statsData.mitraAktif}</p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-xs font-semibold text-emerald-600">Lowongan Terbuka</p>
                <p className="text-3xl font-black text-emerald-900 mt-1">{statsData.lowonganTerbuka}</p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xs font-semibold text-amber-600">Slot PKL Tersedia</p>
                <p className="text-3xl font-black text-amber-900 mt-1">{statsData.slotPKL}</p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                <p className="text-xs font-semibold text-purple-600">Total Pelamar Masuk</p>
                <p className="text-3xl font-black text-purple-900 mt-1">{statsData.totalPelamar}</p>
              </div>
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <p className="text-xs font-semibold text-indigo-600">Tingkat Penempatan</p>
                <p className="text-3xl font-black text-indigo-900 mt-1">{statsData.tingkatPenempatan}%</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MITRA INDUSTRI */}
        {!loading && activeTab === 'mitra' && (
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
        )}

        {/* TAB 3: LOWONGAN */}
        {!loading && activeTab === 'vacancies' && (
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
        )}

        {/* TAB 4: DATA PELAMAR */}
        {!loading && activeTab === 'applications' && (
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
        )}

      </div>
    </div>
  );
}