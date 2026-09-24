'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, X, MapPin, Clock, Briefcase, GraduationCap, Users, ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';

// Import ApplyDrawer dan type Vacancy dari sub-folder modular
import ApplyDrawer from './apply-drawer/ApplyDrawer';
import type { VacancyItem } from './apply-drawer/types';

interface JobBoardClientProps {
  initialVacancies?: VacancyItem[];
}

const ITEMS_PER_PAGE = 9;

export default function JobBoardClient({ initialVacancies = [] }: JobBoardClientProps) {
  const [search, setSearch] = useState('');
  const [filterMajor, setFilterMajor] = useState('Semua');
  const [filterType, setFilterType] = useState('Semua');
  const [filterLocation, setFilterLocation] = useState('Semua');
  const [sortBy, setSortBy] = useState('deadline');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVacancy, setSelectedVacancy] = useState<VacancyItem | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const vacancies = initialVacancies;

  const locations = ['Semua', 'Kepanjen, Kab. Malang', 'Malang, Jawa Timur', 'Malang Kota', 'Malang Raya', 'Bandung / Remote'];

  const filtered = useMemo(() => {
    let result = vacancies.filter((v) => {
      const searchOk =
        !search ||
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.company.toLowerCase().includes(search.toLowerCase());
      const majorOk = filterMajor === 'Semua' || v.majors.includes(filterMajor);
      const typeOk = filterType === 'Semua' || v.type === filterType;
      const locOk = filterLocation === 'Semua' || v.location === filterLocation;
      return searchOk && majorOk && typeOk && locOk;
    });

    if (sortBy === 'deadline') result = [...result].sort((a, b) => a.daysLeft - b.daysLeft);
    else if (sortBy === 'newest') result = [...result].sort((a, b) => b.id.localeCompare(a.id));
    else if (sortBy === 'quota') result = [...result].sort((a, b) => (b.quota - b.quotaUsed) - (a.quota - a.quotaUsed));

    return result;
  }, [search, filterMajor, filterType, filterLocation, sortBy, vacancies]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setSearch('');
    setFilterMajor('Semua');
    setFilterType('Semua');
    setFilterLocation('Semua');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    filterMajor !== 'Semua' || filterType !== 'Semua' || filterLocation !== 'Semua' || search;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-24 pb-12">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-foreground">Papan Lowongan PKL & Kerja</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {filtered.length} lowongan aktif dari mitra industri SMK Al Kaaffah Kepanjen
        </p>
      </div>

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari posisi, perusahaan..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-danger transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground font-medium outline-none focus:border-primary cursor-pointer"
            >
              <option value="deadline">Deadline Terdekat</option>
              <option value="newest">Terbaru</option>
              <option value="quota">Kuota Tersedia</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <SlidersHorizontal size={15} />
            Filter
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
          <div className="bg-card border border-border rounded-2xl p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Filter size={14} />
                Filter
              </h3>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-xs text-danger hover:underline font-medium">
                  Reset
                </button>
              )}
            </div>

            {/* Major Filter */}
            <div className="mb-5">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-2">Jurusan</p>
              <div className="flex flex-col gap-1">
                {['Semua', 'TKJ', 'TAV', 'TKR'].map((maj) => (
                  <button
                    key={`sidebar-maj-${maj}`}
                    onClick={() => {
                      setFilterMajor(maj);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-100 ${
                      filterMajor === maj ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{maj === 'Semua' ? 'Semua Jurusan' : maj}</span>
                    {filterMajor === maj && <CheckCircle2 size={13} className="text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="mb-5">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-2">Jenis</p>
              <div className="flex flex-col gap-1">
                {['Semua', 'PKL', 'Kerja', 'Keduanya'].map((type) => (
                  <button
                    key={`sidebar-type-${type}`}
                    onClick={() => {
                      setFilterType(type);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-100 ${
                      filterType === type ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{type === 'Semua' ? 'Semua Jenis' : type}</span>
                    {filterType === type && <CheckCircle2 size={13} className="text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-2">Lokasi</p>
              <div className="flex flex-col gap-1">
                {locations.map((loc) => (
                  <button
                    key={`sidebar-loc-${loc}`}
                    onClick={() => {
                      setFilterLocation(loc);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-100 text-left ${
                      filterLocation === loc ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="truncate">{loc === 'Semua' ? 'Semua Lokasi' : loc}</span>
                    {filterLocation === loc && <CheckCircle2 size={12} className="text-primary shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Vacancy Grid */}
        <div className="flex-1 min-w-0">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Briefcase size={40} className="text-muted-foreground mb-3" />
              <h3 className="font-bold text-foreground">Tidak ada lowongan ditemukan</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-4">Coba ubah filter atau kata kunci pencarian</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
                {paginated.map((vac) => (
                  <VacancyCard key={vac.id} vacancy={vac} onApply={() => setSelectedVacancy(vac)} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground tabular">
                    Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} dari {filtered.length} lowongan
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Halaman sebelumnya"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={`page-${page}`}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                          currentPage === page
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Halaman berikutnya"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[150] flex lg:hidden">
          <div className="drawer-overlay absolute inset-0" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative ml-auto w-72 h-full bg-card shadow-modal flex flex-col animate-slide-up overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
              <h3 className="font-bold text-sm text-foreground">Filter Lowongan</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 px-5 py-4 flex flex-col gap-6">
              {/* Major */}
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-2">Jurusan</p>
                <div className="flex flex-wrap gap-2">
                  {['Semua', 'TKJ', 'TAV', 'TKR'].map((maj) => (
                    <button
                      key={`mob-maj-${maj}`}
                      onClick={() => {
                        setFilterMajor(maj);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        filterMajor === maj
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border text-foreground hover:bg-muted'
                      }`}
                    >
                      {maj === 'Semua' ? 'Semua' : maj}
                    </button>
                  ))}
                </div>
              </div>
              {/* Type */}
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-2">Jenis</p>
                <div className="flex flex-wrap gap-2">
                  {['Semua', 'PKL', 'Kerja', 'Keduanya'].map((type) => (
                    <button
                      key={`mob-type-${type}`}
                      onClick={() => {
                        setFilterType(type);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        filterType === type
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border text-foreground hover:bg-muted'
                      }`}
                    >
                      {type === 'Semua' ? 'Semua' : type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 pb-6 flex gap-2">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Drawer */}
      {selectedVacancy && (
        <ApplyDrawer vacancy={selectedVacancy} onClose={() => setSelectedVacancy(null)} />
      )}
    </div>
  );
}

function VacancyCard({
  vacancy,
  onApply,
}: {
  vacancy: VacancyItem;
  onApply: () => void;
}) {
  const quotaFull = vacancy.quotaUsed >= vacancy.quota;
  const urgencyClass =
    vacancy.daysLeft <= 5
      ? 'badge-deadline-urgent'
      : vacancy.daysLeft <= 14
      ? 'badge-deadline-soon'
      : 'badge-deadline-ok';

  return (
    <div className="bg-card border border-border rounded-2xl p-5 card-elevated flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
          {vacancy.companyLogo ? (
            <AppImage
              src={vacancy.companyLogo}
              alt={`Logo ${vacancy.company}`}
              width={44}
              height={44}
              className="w-full h-full object-contain p-1"
              unoptimized
            />
          ) : (
            <span className="text-xs font-bold text-primary">
              {vacancy.company.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-2">{vacancy.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{vacancy.company}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            vacancy.type === 'PKL' ? 'badge-pkl' : vacancy.type === 'Kerja' ? 'badge-kerja' : 'badge-keduanya'
          }`}
        >
          {vacancy.type}
        </span>
        {vacancy.majors.map((maj) => (
          <span
            key={`card-${vacancy.id}-${maj}`}
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              maj === 'TKJ' ? 'badge-tkj' : maj === 'TAV' ? 'badge-tav' : 'badge-tkr'
            }`}
          >
            {maj}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <MapPin size={11} className="text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground truncate">{vacancy.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {vacancy.type === 'PKL' ? (
            <GraduationCap size={11} className="text-muted-foreground shrink-0" />
          ) : (
            <Briefcase size={11} className="text-muted-foreground shrink-0" />
          )}
          <span className="text-xs font-semibold text-foreground tabular">{vacancy.salary}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={11} className="text-muted-foreground shrink-0" />
          <span className={`text-xs font-medium ${quotaFull ? 'text-danger' : 'text-muted-foreground'}`}>
            {quotaFull ? 'Kuota penuh' : `${vacancy.quota - vacancy.quotaUsed} slot tersisa`}
          </span>
        </div>
      </div>

      {/* Qualifications count */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CheckCircle2 size={11} className="text-success shrink-0" />
        <span>{vacancy.qualifications.length} persyaratan</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
        <div className="flex items-center gap-1">
          <Clock size={11} className="text-muted-foreground" />
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${urgencyClass}`}>
            {vacancy.daysLeft <= 0 ? 'Hari Ini!' : vacancy.daysLeft <= 1 ? 'Besok!' : `${vacancy.daysLeft} hari`}
          </span>
        </div>
        <button
          onClick={onApply}
          disabled={quotaFull}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
            quotaFull
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {quotaFull ? (
            <>
              <AlertCircle size={12} />
              Penuh
            </>
          ) : (
            <>
              <Calendar size={12} />
              Lamar
            </>
          )}
        </button>
      </div>
    </div>
  );
}