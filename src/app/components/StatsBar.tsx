import React from 'react';
import { Building2, Briefcase, Users, TrendingUp } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

export default async function StatsBar() {
  const supabase = await createClient();

  // Semua query independen dijalankan paralel (Promise.all) alih-alih
  // sequential await satu-satu — mengurangi total latency dari ~6x round-trip
  // jadi ~1x round-trip (dibatasi query terlambat, bukan jumlah query).
  const [
    { count: totalLowongan },
    { data: pklVacancies },
    { count: totalMitra },
    { count: totalAlumni },
    { count: totalTerserap },
  ] = await Promise.all([
    // 1. Total lowongan aktif
    supabase.from('lowongan_kerja').select('*', { count: 'exact', head: true }).eq('is_active', true),
    // 2. Data kuota PKL dari lowongan aktif
    supabase
      .from('lowongan_kerja')
      .select('quota, quota_used')
      .eq('is_active', true)
      .in('type', ['PKL', 'Keduanya']),
    // 3. Total Mitra Industri — dihitung dari tabel mitra_industri langsung
    //    (sebelumnya salah: dihitung dari unique `company` di lowongan_kerja,
    //    yang bisa beda jumlah dengan yang sebenarnya tampil di MitraGrid).
    //    `head: true` supaya cuma narik count, bukan seluruh baris.
    supabase.from('mitra_industri').select('*', { count: 'exact', head: true }).eq('status', 'Aktif'),
    // 4. Total alumni
    supabase.from('alumni').select('*', { count: 'exact', head: true }),
    // 5. Alumni yang sudah terserap kerja
    supabase
      .from('alumni')
      .select('*', { count: 'exact', head: true })
      .neq('status_penempatan', 'Belum Bekerja'),
  ]);

  const totalKuotaPkl = (pklVacancies || []).reduce(
    (acc, curr) => acc + Math.max(0, (curr.quota || 0) - (curr.quota_used || 0)),
    0
  );

  // Hitung persentase (Default ke 0 jika data alumni masih kosong)
  const placementRate = totalAlumni && totalAlumni > 0
    ? ((totalTerserap || 0) / totalAlumni * 100).toFixed(1)
    : '0.0';

  const stats = [
    {
      id: 'stat-mitra',
      label: 'Mitra Industri Aktif',
      value: totalMitra || 0,
      unit: 'perusahaan',
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: 'Terverifikasi BKK',
      trendPositive: true,
    },
    {
      id: 'stat-lowongan',
      label: 'Lowongan Terbuka',
      value: totalLowongan || 0,
      unit: 'posisi',
      icon: Briefcase,
      color: 'text-success',
      bgColor: 'bg-success/10',
      trend: 'Aktif Minggu Ini',
      trendPositive: true,
    },
    {
      id: 'stat-kuota',
      label: 'Kuota PKL Tersedia',
      value: totalKuotaPkl,
      unit: 'slot',
      icon: Users,
      color: 'text-tav',
      bgColor: 'bg-tav/10',
      trend: 'Semester Ganjil 2026',
      trendPositive: true,
    },
    {
      id: 'stat-placement',
      label: 'Tingkat Penempatan',
      value: placementRate, // Sekarang sudah 100% dinamis dari DB!
      unit: '%',
      icon: TrendingUp,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      trend: 'Lulusan Terakhir',
      trendPositive: true,
    },
  ];

  return (
    <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 -mt-6 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-card border border-border rounded-2xl p-4 lg:p-5 card-elevated"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                <stat.icon size={18} className={stat.color} />
              </div>
            </div>
            <div className="tabular">
              <span className={`text-2xl lg:text-3xl font-extrabold ${stat.color}`}>
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground ml-1 font-medium">{stat.unit}</span>
            </div>
            <p className="text-xs font-semibold text-foreground mt-1">{stat.label}</p>
            <p className={`text-[10px] mt-1 font-medium ${stat.trendPositive ? 'text-success' : 'text-warning'}`}>
              {stat.trend}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}