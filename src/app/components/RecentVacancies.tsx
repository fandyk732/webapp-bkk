'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Briefcase, MapPin, Calendar, Wallet, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function JobFeed() {
  const supabase = createClient();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const { data, error } = await supabase
        .from('lowongan_kerja')
        .select('id, title, company, type, majors, location, salary, deadline')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (!error && data) {
        setJobs(data);
      }
      setLoading(false);
    }

    fetchJobs();
  }, []);

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Lowongan Terbaru</h2>
          <p className="text-slate-500 text-sm">Dibuka dalam beberapa hari terakhir</p>
        </div>
        <Link
          href="/job-pkl-board"
          className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1"
        >
          Lihat Semua <ChevronRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={24} />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <Briefcase className="mx-auto text-slate-400 mb-2" size={32} />
          <p className="text-slate-600 font-medium">Belum ada lowongan pekerjaan aktif</p>
          <p className="text-slate-400 text-xs mt-1">
            Lowongan yang diterbitkan admin akan muncul di sini secara otomatis
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800 text-base">{job.title}</h3>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        BARU
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs">{job.company}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 my-3">
                  <span className="text-[10px] font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {job.type}
                  </span>
                  {job.majors?.map((m: string) => (
                    <span
                      key={m}
                      className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                    >
                      {m}
                    </span>
                  ))}
                </div>

                <div className="space-y-1 text-xs text-slate-500 my-3">
                  <p className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" /> {job.location || 'Malang'}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Wallet size={14} className="text-slate-400" /> {job.salary || 'Uang Saku'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-50 flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar size={13} /> Deadline: {job.deadline || '-'}
                </span>
                <Link
                  href="/job-pkl-board"
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  Lamar →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}