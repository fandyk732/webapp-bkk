'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

import AdminHeader from './components/AdminHeader';
import StatsTab from './components/StatsTab';
import MitraTab from './components/MitraTab';
import VacanciesTab from './components/VacanciesTab';
import ApplicationsTab from './components/ApplicationsTab';
import type { StatsData, MitraForm, JobForm } from './types';

export default function AdminDashboard() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'stats' | 'mitra' | 'vacancies' | 'applications'>('stats');
  const [loading, setLoading] = useState(true);

  // Database States
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [mitra, setMitra] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);

  // Stats State
  const [statsData, setStatsData] = useState<StatsData>({
    mitraAktif: 0,
    lowonganTerbuka: 0,
    slotPKL: 0,
    tingkatPenempatan: '0.0',
    totalPelamar: 0
  });

  // Form States - Mitra (Sudah disesuaikan dengan interface MitraForm terbaru)
  const [newMitra, setNewMitra] = useState<MitraForm>({
    nama: '',
    logo: '',
    sektor: 'Teknologi & Informasi',
    lokasi: 'Malang',
    jurusan: ['TKJ'],
    mou_year: '2024-2027',
    kerjasama_sejak: 2024,
    status: 'Aktif',
    deskripsi: '',
    website: '',
    email_hrd: '',
    program_kemitraan: ['PKL', 'KERJA'],
    jobdesk_overview: '',
    kualifikasi_umum: '',
    fasilitas_benefit: ''
  });

  // Form States - Lowongan
  const [newJob, setNewJob] = useState<JobForm>({
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
      // Direct query ke nama tabel persis sesuai Supabase
      const [
        { data: vacData },
        { data: mitraData },
        { data: applicantsData },
        { data: surveyData }
      ] = await Promise.all([
        supabase.from('lowongan_kerja').select('*').order('created_at', { ascending: false }),
        supabase.from('mitra_industri').select('*').order('created_at', { ascending: false }),
        supabase.from('pelamar').select('*').order('created_at', { ascending: false }),
        supabase.from('student_surveys').select('career_plan')
      ]);

      setVacancies(vacData || []);
      setMitra(mitraData || []);
      setApplicants(applicantsData || []);

      // Hitung ringkasan statistik secara konsisten
      const activeJobs = (vacData || []).filter((v) => v.is_active !== false);
      const pklQuota = (surveyData || []).filter((s) => s.career_plan === 'PKL').length;
      const totalSurvey = (surveyData || []).length;
      const siswaSiap = (surveyData || []).filter((s) => s.career_plan === 'KERJA' || s.career_plan === 'PKL').length;
      const placementRate = totalSurvey > 0 ? ((siswaSiap / totalSurvey) * 100).toFixed(1) : '0.0';

      setStatsData({
        mitraAktif: (mitraData || []).length,
        lowonganTerbuka: activeJobs.length,
        slotPKL: pklQuota,
        tingkatPenempatan: placementRate,
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
      setNewMitra({
        nama: '',
        logo: '',
        sektor: 'Teknologi & Informasi',
        lokasi: 'Malang',
        jurusan: ['TKJ'],
        mou_year: '2024-2027',
        kerjasama_sejak: 2024,
        status: 'Aktif',
        deskripsi: '',
        website: '',
        email_hrd: '',
        program_kemitraan: ['PKL', 'KERJA'],
        jobdesk_overview: '',
        kualifikasi_umum: '',
        fasilitas_benefit: ''
      });
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
        
        <AdminHeader 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          loading={loading} 
          onRefresh={loadAllData} 
          onLogout={handleLogout} 
          mitraCount={mitra.length} 
          vacanciesCount={vacancies.length} 
          applicantsCount={applicants.length} 
        />

        {loading && (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-100">
            <Loader2 className="animate-spin text-blue-600 mr-2" size={24} />
            <span className="text-sm font-medium text-slate-600">Proses sinkronisasi data...</span>
          </div>
        )}

        {!loading && activeTab === 'stats' && <StatsTab statsData={statsData} />}

        {!loading && activeTab === 'mitra' && (
          <MitraTab 
            newMitra={newMitra} 
            setNewMitra={setNewMitra} 
            handleAddMitra={handleAddMitra} 
            handleMajorToggle={handleMajorToggle} 
            mitra={mitra} 
            handleDeleteMitra={handleDeleteMitra} 
          />
        )}

        {!loading && activeTab === 'vacancies' && (
          <VacanciesTab 
            newJob={newJob} 
            setNewJob={setNewJob} 
            handleAddJob={handleAddJob} 
            handleMajorToggle={handleMajorToggle} 
            vacancies={vacancies} 
            handleToggleJobStatus={handleToggleJobStatus} 
            handleDeleteJob={handleDeleteJob} 
          />
        )}

        {!loading && activeTab === 'applications' && (
          <ApplicationsTab 
            applicants={applicants} 
            handleUpdateApplicantStatus={handleUpdateApplicantStatus} 
            handleDeleteApplicant={handleDeleteApplicant} 
          />
        )}

      </div>
    </div>
  );
}