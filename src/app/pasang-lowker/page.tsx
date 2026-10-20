'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // 👈 Import createClient dari client

export default function PasangLowkerPage() {
  const supabase = createClient(); // 👈 Inisialisasi client supabase di sini

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    company: '',
    company_logo: '',
    type: 'Kerja',
    majors: [] as string[],
    location: '',
    salary: '',
    deadline: '',
    description: '',
    quota: 1,
    qualifications: '',
    benefits: '',
    contact_person: '',
  });

  const handleMajorToggle = (m: string) => {
    setForm((prev) => ({
      ...prev,
      majors: prev.majors.includes(m)
        ? prev.majors.filter((item) => item !== m)
        : [...prev.majors, m],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('lowongan_kerja').insert([
        {
          title: form.title,
          company: form.company,
          company_logo: form.company_logo || null,
          type: form.type,
          majors: form.majors,
          location: form.location,
          salary: form.salary || '-',
          deadline: form.deadline,
          description: form.description,
          quota: Number(form.quota),
          qualifications: form.qualifications ? form.qualifications.split(',').map((s) => s.trim()) : [],
          benefits: form.benefits ? form.benefits.split(',').map((s) => s.trim()) : [],
          contact_person: form.contact_person,
          is_active: true,
          is_approved: false, // Menunggu approval Admin BKK
        },
      ]);

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      alert('Gagal mengirim lowongan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pasang Lowongan Pekerjaan / PKL</h1>
          <p className="text-sm text-slate-500 mt-1">
            Formulir khusus Perusahaan Rekanan & UMKM Mitra BKK Sekolah.
          </p>
        </div>

        {success ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm space-y-2">
            <p className="font-bold text-base">🎉 Lowongan Berhasil Terkirim!</p>
            <p>
              Terima kasih telah bermitra. Lowongan Anda sedang ditinjau oleh tim BKK dan akan ditayangkan di portal siswa setelah disetujui.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                setForm({
                  title: '',
                  company: '',
                  company_logo: '',
                  type: 'Kerja',
                  majors: [],
                  location: '',
                  salary: '',
                  deadline: '',
                  description: '',
                  quota: 1,
                  qualifications: '',
                  benefits: '',
                  contact_person: '',
                });
              }}
              className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold text-xs hover:bg-emerald-700 transition-colors"
            >
              + Pasang Lowongan Lain
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Nama Perusahaan / UMKM *</label>
              <input
                type="text"
                placeholder="Contoh: Bengkel Utama Motor / CV Media Tech"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Judul Posisi Lowongan *</label>
              <input
                type="text"
                placeholder="Contoh: Staff Admin / Mekanik / Junior Web Developer"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Tipe Skema *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full p-3 border rounded-xl text-sm bg-white focus:outline-none focus:border-blue-600"
                >
                  <option value="PKL">PKL / Magang</option>
                  <option value="Kerja">Kerja Kontrak / Tetap</option>
                  <option value="Keduanya">Keduanya</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Kuota Slot Kebutuhan *</label>
                <input
                  type="number"
                  min={1}
                  placeholder="Jumlah orang"
                  value={form.quota}
                  onChange={(e) => setForm({ ...form, quota: Number(e.target.value) })}
                  className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Gaji / Uang Saku (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Rp 1.500.000 / Negosiasi"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Batas Akhir Pendaftaran *</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Lokasi Penempatan *</label>
                <input
                  type="text"
                  placeholder="Contoh: Kepanjen, Malang"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Kontak WhatsApp / Email HRD *</label>
                <input
                  type="text"
                  placeholder="Contoh: 081234567890 (Pak Budi)"
                  value={form.contact_person}
                  onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                  className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Target Jurusan Siswa:</label>
              <div className="flex gap-4 text-sm">
                {['TKJ', 'TAV', 'TKR'].map((m) => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.majors.includes(m)}
                      onChange={() => handleMajorToggle(m)}
                      className="rounded text-blue-600 w-4 h-4"
                    />
                    <span>{m}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Kualifikasi Khusus (Pisahkan Koma)</label>
              <input
                type="text"
                placeholder="Contoh: Pria/Wanita, Usia Max 20th, Menguasai Crimp Kabel"
                value={form.qualifications}
                onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Deskripsi / Detail Pekerjaan</label>
              <textarea
                placeholder="Tuliskan deskripsi singkat mengenai tugas kerja..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-3 border rounded-xl text-sm h-24 focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Mengirim Data...' : 'Kirim Lowongan Pekerjaan'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}