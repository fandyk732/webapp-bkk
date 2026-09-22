'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  User, BookOpen, Wrench, Target, ChevronRight, ChevronLeft,
  Download, Printer, CheckCircle2, AlertCircle, Plus, X, Eye,
} from 'lucide-react';
import CVPreview from './CVPreview';

export interface CVData {
  // Step 1: Personal
  fullName: string;
  nis: string;
  kelas: string;
  major: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  religion: string;
  address: string;
  phone: string;
  email: string;
  // Step 2: Education
  sdName: string;
  sdYear: string;
  smpName: string;
  smpYear: string;
  smkName: string;
  smkYear: string;
  certifications: string;
  // Step 3: Skills & Experience
  hardSkills: string[];
  softSkills: string[];
  pklCompany: string;
  pklPosition: string;
  pklDuration: string;
  pklDescription: string;
  workExperience: string;
  // Step 4: Target
  targetPosition: string;
  targetType: string;
  targetMajor: string;
  aboutMe: string;
}

const STEPS = [
  { id: 1, label: 'Data Diri', icon: User },
  { id: 2, label: 'Pendidikan', icon: BookOpen },
  { id: 3, label: 'Keahlian', icon: Wrench },
  { id: 4, label: 'Target', icon: Target },
];

const HARD_SKILL_OPTIONS = [
  'Jaringan Komputer', 'Linux Administration', 'Windows Server', 'Cisco Routing',
  'Fiber Optik', 'CCTV Installation', 'Web Development', 'Database MySQL',
  'Elektronika Dasar', 'Solder & PCB', 'Audio Video System', 'Osciloscope',
  'Mekanik Otomotif', 'Diagnosa Engine OBD', 'Kelistrikan Kendaraan', 'AC Mobil',
  'Microsoft Office', 'Desain Grafis', 'Python Dasar', 'IoT Dasar',
];

const SOFT_SKILL_OPTIONS = [
  'Kerja Tim', 'Komunikasi', 'Problem Solving', 'Disiplin', 'Inisiatif',
  'Adaptasi', 'Manajemen Waktu', 'Kepemimpinan', 'Kreativitas', 'Teliti',
];

export default function CVBuilderClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [cvData, setCvData] = useState<Partial<CVData>>({
    hardSkills: [],
    softSkills: [],
    smkName: 'SMK Al Kaaffah Kepanjen',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [hardSkillInput, setHardSkillInput] = useState('');
  const [softSkillInput, setSoftSkillInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
  } = useForm<CVData>({
    defaultValues: {
      smkName: 'SMK Al Kaaffah Kepanjen',
      hardSkills: [],
      softSkills: [],
    },
  });

  const updateCvData = () => {
    const values = getValues();
    setCvData((prev) => ({
      ...prev,
      ...values,
      hardSkills: prev.hardSkills || [],
      softSkills: prev.softSkills || [],
    }));
  };

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof CVData)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['fullName', 'nis', 'kelas', 'major', 'birthPlace', 'birthDate', 'gender', 'address', 'phone'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['sdName', 'sdYear', 'smpName', 'smpYear'];
    } else if (currentStep === 3) {
      fieldsToValidate = [];
    }

    const valid = await trigger(fieldsToValidate);
    if (valid) {
      updateCvData();
      setCurrentStep((s) => Math.min(4, s + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    updateCvData();
    setCurrentStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onFinalSubmit = (data: CVData) => {
    const finalData = {
      ...data,
      hardSkills: cvData.hardSkills || [],
      softSkills: cvData.softSkills || [],
    };
    setCvData(finalData);
    setShowPreview(true);
    toast.success('CV berhasil dibuat! Klik tombol Download untuk mengunduh.');
  };

  const toggleSkill = (skill: string, type: 'hard' | 'soft') => {
    setCvData((prev) => {
      const key = type === 'hard' ? 'hardSkills' : 'softSkills';
      const current = prev[key] || [];
      return {
        ...prev,
        [key]: current.includes(skill)
          ? current.filter((s) => s !== skill)
          : [...current, skill],
      };
    });
  };

  const addCustomSkill = (type: 'hard' | 'soft') => {
    const input = type === 'hard' ? hardSkillInput : softSkillInput;
    if (!input.trim()) return;
    setCvData((prev) => {
      const key = type === 'hard' ? 'hardSkills' : 'softSkills';
      const current = prev[key] || [];
      if (current.includes(input.trim())) return prev;
      return { ...prev, [key]: [...current, input.trim()] };
    });
    if (type === 'hard') setHardSkillInput('');
    else setSoftSkillInput('');
  };

  const completionPercent = Math.round(((currentStep - 1) / 4) * 100);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
      {/* Page Header */}
      <div className="mb-8 text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold text-foreground">Generator CV BKK</h1>
        <p className="text-muted-foreground text-sm mt-2">
          Buat CV standar BKK SMK Al Kaaffah Kepanjen dalam 4 langkah mudah. Isi data sekali, unduh CV siap kirim.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="max-w-2xl mx-auto mb-8">
        {/* Progress Bar */}
        <div className="quota-bar-track mb-5">
          <div
            className="quota-bar-fill"
            style={{
              width: `${completionPercent}%`,
              backgroundColor: 'var(--primary)',
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            return (
              <React.Fragment key={`step-indicator-${step.id}`}>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isCompleted ? 'step-completed' : isActive ? 'step-active' : 'step-inactive'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={16} className="text-white" />
                    ) : (
                      <step.icon size={15} className={isActive ? 'text-white' : 'text-muted-foreground'} />
                    )}
                  </div>
                  <span className={`text-[11px] font-semibold hidden sm:block ${
                    isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-success' : 'bg-border'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Form Panel */}
        <div className="flex-1 min-w-0">
          <form onSubmit={handleSubmit(onFinalSubmit)}>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Step Header */}
              <div className="px-6 py-5 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    {React.createElement(STEPS[currentStep - 1].icon, { size: 17, className: 'text-primary' })}
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-foreground">
                      Langkah {currentStep}: {STEPS[currentStep - 1].label}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {currentStep === 1 && 'Isi informasi pribadi untuk header CV'}
                      {currentStep === 2 && 'Riwayat pendidikan formal dan sertifikasi'}
                      {currentStep === 3 && 'Pilih keahlian dan pengalaman PKL/kerja'}
                      {currentStep === 4 && 'Tentukan target posisi dan tulis profil singkat'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6">
                {/* ─── STEP 1: Data Diri ─── */}
                {currentStep === 1 && (
                  <div className="flex flex-col gap-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="cv-fullName" className="block text-xs font-semibold text-foreground mb-1.5">
                        Nama Lengkap <span className="text-danger">*</span>
                      </label>
                      <input
                        id="cv-fullName"
                        type="text"
                        placeholder="Contoh: Ahmad Rizky Pratama"
                        className={`form-input ${errors.fullName ? 'error' : ''}`}
                        {...register('fullName', { required: 'Nama lengkap wajib diisi' })}
                        onChange={updateCvData}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-danger mt-1 flex items-center gap-1">
                          <AlertCircle size={11} />{errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* NIS + Kelas */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="cv-nis" className="block text-xs font-semibold text-foreground mb-1.5">
                          NIS <span className="text-danger">*</span>
                        </label>
                        <input
                          id="cv-nis"
                          type="text"
                          placeholder="Nomor Induk Siswa"
                          className={`form-input ${errors.nis ? 'error' : ''}`}
                          {...register('nis', { required: 'NIS wajib diisi' })}
                          onChange={updateCvData}
                        />
                        {errors.nis && (
                          <p className="text-xs text-danger mt-1">{errors.nis.message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="cv-kelas" className="block text-xs font-semibold text-foreground mb-1.5">
                          Kelas <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="cv-kelas"
                            className={`form-input appearance-none pr-8 ${errors.kelas ? 'error' : ''}`}
                            {...register('kelas', { required: 'Kelas wajib dipilih' })}
                            onChange={updateCvData}
                          >
                            <option value="">Pilih Kelas</option>
                            <option value="XI TKJ 1">XI TKJ 1</option>
                            <option value="XI TKJ 2">XI TKJ 2</option>
                            <option value="XI TAV">XI TAV</option>
                            <option value="XI TKR 1">XI TKR 1</option>
                            <option value="XI TKR 2">XI TKR 2</option>
                            <option value="XII TKJ 1">XII TKJ 1</option>
                            <option value="XII TKJ 2">XII TKJ 2</option>
                            <option value="XII TAV">XII TAV</option>
                            <option value="XII TKR 1">XII TKR 1</option>
                            <option value="XII TKR 2">XII TKR 2</option>
                            <option value="Alumni">Alumni</option>
                          </select>
                          <ChevronRight size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rotate-90" />
                        </div>
                        {errors.kelas && (
                          <p className="text-xs text-danger mt-1">{errors.kelas.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Major */}
                    <div>
                      <label htmlFor="cv-major" className="block text-xs font-semibold text-foreground mb-1.5">
                        Program Keahlian (Jurusan) <span className="text-danger">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="cv-major"
                          className={`form-input appearance-none pr-8 ${errors.major ? 'error' : ''}`}
                          {...register('major', { required: 'Jurusan wajib dipilih' })}
                          onChange={updateCvData}
                        >
                          <option value="">Pilih Jurusan</option>
                          <option value="Teknik Komputer dan Jaringan (TKJ)">Teknik Komputer dan Jaringan (TKJ)</option>
                          <option value="Teknik Audio Video (TAV)">Teknik Audio Video (TAV)</option>
                          <option value="Teknik Kendaraan Ringan (TKR)">Teknik Kendaraan Ringan (TKR)</option>
                        </select>
                        <ChevronRight size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rotate-90" />
                      </div>
                      {errors.major && (
                        <p className="text-xs text-danger mt-1">{errors.major.message}</p>
                      )}
                    </div>

                    {/* Birth Place + Date */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="cv-birthPlace" className="block text-xs font-semibold text-foreground mb-1.5">
                          Tempat Lahir <span className="text-danger">*</span>
                        </label>
                        <input
                          id="cv-birthPlace"
                          type="text"
                          placeholder="Contoh: Malang"
                          className={`form-input ${errors.birthPlace ? 'error' : ''}`}
                          {...register('birthPlace', { required: 'Tempat lahir wajib diisi' })}
                          onChange={updateCvData}
                        />
                        {errors.birthPlace && (
                          <p className="text-xs text-danger mt-1">{errors.birthPlace.message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="cv-birthDate" className="block text-xs font-semibold text-foreground mb-1.5">
                          Tanggal Lahir <span className="text-danger">*</span>
                        </label>
                        <input
                          id="cv-birthDate"
                          type="date"
                          className={`form-input ${errors.birthDate ? 'error' : ''}`}
                          {...register('birthDate', { required: 'Tanggal lahir wajib diisi' })}
                          onChange={updateCvData}
                        />
                        {errors.birthDate && (
                          <p className="text-xs text-danger mt-1">{errors.birthDate.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Gender + Religion */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="cv-gender" className="block text-xs font-semibold text-foreground mb-1.5">
                          Jenis Kelamin <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="cv-gender"
                            className={`form-input appearance-none pr-8 ${errors.gender ? 'error' : ''}`}
                            {...register('gender', { required: 'Jenis kelamin wajib dipilih' })}
                            onChange={updateCvData}
                          >
                            <option value="">Pilih</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                          </select>
                          <ChevronRight size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rotate-90" />
                        </div>
                        {errors.gender && (
                          <p className="text-xs text-danger mt-1">{errors.gender.message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="cv-religion" className="block text-xs font-semibold text-foreground mb-1.5">
                          Agama
                        </label>
                        <div className="relative">
                          <select
                            id="cv-religion"
                            className="form-input appearance-none pr-8"
                            {...register('religion')}
                            onChange={updateCvData}
                          >
                            <option value="Islam">Islam</option>
                            <option value="Kristen">Kristen</option>
                            <option value="Katolik">Katolik</option>
                            <option value="Hindu">Hindu</option>
                            <option value="Buddha">Buddha</option>
                          </select>
                          <ChevronRight size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rotate-90" />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label htmlFor="cv-address" className="block text-xs font-semibold text-foreground mb-1.5">
                        Alamat Lengkap <span className="text-danger">*</span>
                      </label>
                      <textarea
                        id="cv-address"
                        rows={2}
                        placeholder="Jl. ..., RT/RW, Desa/Kelurahan, Kecamatan, Kabupaten/Kota"
                        className={`form-input resize-none ${errors.address ? 'error' : ''}`}
                        {...register('address', { required: 'Alamat wajib diisi' })}
                        onChange={updateCvData}
                      />
                      {errors.address && (
                        <p className="text-xs text-danger mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    {/* Phone + Email */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="cv-phone" className="block text-xs font-semibold text-foreground mb-1.5">
                          No. HP / WA <span className="text-danger">*</span>
                        </label>
                        <input
                          id="cv-phone"
                          type="tel"
                          placeholder="08xxxxxxxxxx"
                          className={`form-input ${errors.phone ? 'error' : ''}`}
                          {...register('phone', {
                            required: 'No. HP wajib diisi',
                            pattern: { value: /^08\d{8,12}$/, message: 'Format tidak valid' },
                          })}
                          onChange={updateCvData}
                        />
                        {errors.phone && (
                          <p className="text-xs text-danger mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="cv-email" className="block text-xs font-semibold text-foreground mb-1.5">
                          Email
                        </label>
                        <input
                          id="cv-email"
                          type="email"
                          placeholder="nama@email.com"
                          className="form-input"
                          {...register('email', {
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid' },
                          })}
                          onChange={updateCvData}
                        />
                        {errors.email && (
                          <p className="text-xs text-danger mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── STEP 2: Pendidikan ─── */}
                {currentStep === 2 && (
                  <div className="flex flex-col gap-5">
                    {/* SD */}
                    <div>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Sekolah Dasar (SD)</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label htmlFor="cv-sdName" className="block text-xs font-semibold text-foreground mb-1.5">
                            Nama Sekolah <span className="text-danger">*</span>
                          </label>
                          <input
                            id="cv-sdName"
                            type="text"
                            placeholder="SDN / MI ..."
                            className={`form-input ${errors.sdName ? 'error' : ''}`}
                            {...register('sdName', { required: 'Nama SD wajib diisi' })}
                            onChange={updateCvData}
                          />
                          {errors.sdName && (
                            <p className="text-xs text-danger mt-1">{errors.sdName.message}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="cv-sdYear" className="block text-xs font-semibold text-foreground mb-1.5">
                            Tahun Lulus <span className="text-danger">*</span>
                          </label>
                          <input
                            id="cv-sdYear"
                            type="text"
                            placeholder="2019"
                            maxLength={4}
                            className={`form-input ${errors.sdYear ? 'error' : ''}`}
                            {...register('sdYear', { required: 'Tahun lulus wajib diisi' })}
                            onChange={updateCvData}
                          />
                          {errors.sdYear && (
                            <p className="text-xs text-danger mt-1">{errors.sdYear.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* SMP */}
                    <div>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Sekolah Menengah Pertama (SMP/MTs)</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label htmlFor="cv-smpName" className="block text-xs font-semibold text-foreground mb-1.5">
                            Nama Sekolah <span className="text-danger">*</span>
                          </label>
                          <input
                            id="cv-smpName"
                            type="text"
                            placeholder="SMP / MTs ..."
                            className={`form-input ${errors.smpName ? 'error' : ''}`}
                            {...register('smpName', { required: 'Nama SMP wajib diisi' })}
                            onChange={updateCvData}
                          />
                          {errors.smpName && (
                            <p className="text-xs text-danger mt-1">{errors.smpName.message}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="cv-smpYear" className="block text-xs font-semibold text-foreground mb-1.5">
                            Tahun Lulus <span className="text-danger">*</span>
                          </label>
                          <input
                            id="cv-smpYear"
                            type="text"
                            placeholder="2022"
                            maxLength={4}
                            className={`form-input ${errors.smpYear ? 'error' : ''}`}
                            {...register('smpYear', { required: 'Tahun lulus wajib diisi' })}
                            onChange={updateCvData}
                          />
                          {errors.smpYear && (
                            <p className="text-xs text-danger mt-1">{errors.smpYear.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* SMK */}
                    <div>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">SMK (Saat Ini)</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label htmlFor="cv-smkName" className="block text-xs font-semibold text-foreground mb-1.5">
                            Nama Sekolah
                          </label>
                          <input
                            id="cv-smkName"
                            type="text"
                            className="form-input bg-muted/50"
                            readOnly
                            {...register('smkName')}
                          />
                        </div>
                        <div>
                          <label htmlFor="cv-smkYear" className="block text-xs font-semibold text-foreground mb-1.5">
                            Tahun Lulus
                          </label>
                          <input
                            id="cv-smkYear"
                            type="text"
                            placeholder="2026"
                            maxLength={4}
                            className="form-input"
                            {...register('smkYear')}
                            onChange={updateCvData}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <label htmlFor="cv-certifications" className="block text-xs font-semibold text-foreground mb-1.5">
                        Sertifikasi & Prestasi
                      </label>
                      <p className="text-[11px] text-muted-foreground mb-1.5">
                        Tuliskan sertifikasi kompetensi, lomba, atau penghargaan yang pernah diraih
                      </p>
                      <textarea
                        id="cv-certifications"
                        rows={3}
                        placeholder="Contoh:&#10;- Sertifikat Uji Kompetensi Keahlian (UKK) TKJ — 2026&#10;- Juara 2 LKS Jaringan Komputer Kabupaten Malang — 2025"
                        className="form-input resize-none"
                        {...register('certifications')}
                        onChange={updateCvData}
                      />
                    </div>
                  </div>
                )}

                {/* ─── STEP 3: Keahlian & Pengalaman ─── */}
                {currentStep === 3 && (
                  <div className="flex flex-col gap-5">
                    {/* Hard Skills */}
                    <div>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Keahlian Teknis (Hard Skills)</h3>
                      <p className="text-[11px] text-muted-foreground mb-3">Pilih keahlian teknis yang kamu kuasai</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {HARD_SKILL_OPTIONS.map((skill) => {
                          const selected = (cvData.hardSkills || []).includes(skill);
                          return (
                            <button
                              key={`hard-skill-opt-${skill}`}
                              type="button"
                              onClick={() => toggleSkill(skill, 'hard')}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-100 ${
                                selected
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-muted text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                              }`}
                            >
                              {selected && <CheckCircle2 size={11} />}
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                      {/* Custom hard skill */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={hardSkillInput}
                          onChange={(e) => setHardSkillInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill('hard'))}
                          placeholder="Tambah keahlian lain..."
                          className="form-input flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => addCustomSkill('hard')}
                          className="px-3 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
                          aria-label="Tambah keahlian teknis"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                      {/* Selected hard skills */}
                      {(cvData.hardSkills || []).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {(cvData.hardSkills || []).map((skill) => (
                            <span key={`selected-hard-${skill}`} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/8 text-primary text-xs font-medium">
                              {skill}
                              <button
                                type="button"
                                onClick={() => toggleSkill(skill, 'hard')}
                                aria-label={`Hapus ${skill}`}
                              >
                                <X size={11} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Soft Skills */}
                    <div>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Keahlian Non-Teknis (Soft Skills)</h3>
                      <p className="text-[11px] text-muted-foreground mb-3">Pilih karakter dan kemampuan interpersonal</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {SOFT_SKILL_OPTIONS.map((skill) => {
                          const selected = (cvData.softSkills || []).includes(skill);
                          return (
                            <button
                              key={`soft-skill-opt-${skill}`}
                              type="button"
                              onClick={() => toggleSkill(skill, 'soft')}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-100 ${
                                selected
                                  ? 'bg-accent text-white border-accent' :'bg-muted text-muted-foreground border-border hover:border-accent/50 hover:text-foreground'
                              }`}
                            >
                              {selected && <CheckCircle2 size={11} />}
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={softSkillInput}
                          onChange={(e) => setSoftSkillInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill('soft'))}
                          placeholder="Tambah soft skill lain..."
                          className="form-input flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => addCustomSkill('soft')}
                          className="px-3 py-2 bg-accent/10 text-accent rounded-xl hover:bg-accent/20 transition-colors"
                          aria-label="Tambah soft skill"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>

                    {/* PKL Experience */}
                    <div>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Pengalaman PKL / Magang</h3>
                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="cv-pklCompany" className="block text-xs font-semibold text-foreground mb-1.5">
                              Nama Perusahaan / Instansi
                            </label>
                            <input
                              id="cv-pklCompany"
                              type="text"
                              placeholder="Contoh: CV Elektronik Jaya"
                              className="form-input"
                              {...register('pklCompany')}
                              onChange={updateCvData}
                            />
                          </div>
                          <div>
                            <label htmlFor="cv-pklPosition" className="block text-xs font-semibold text-foreground mb-1.5">
                              Posisi / Bidang
                            </label>
                            <input
                              id="cv-pklPosition"
                              type="text"
                              placeholder="Contoh: Teknisi Elektronik"
                              className="form-input"
                              {...register('pklPosition')}
                              onChange={updateCvData}
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="cv-pklDuration" className="block text-xs font-semibold text-foreground mb-1.5">
                            Durasi PKL
                          </label>
                          <input
                            id="cv-pklDuration"
                            type="text"
                            placeholder="Contoh: Januari – Maret 2025 (3 bulan)"
                            className="form-input"
                            {...register('pklDuration')}
                            onChange={updateCvData}
                          />
                        </div>
                        <div>
                          <label htmlFor="cv-pklDescription" className="block text-xs font-semibold text-foreground mb-1.5">
                            Deskripsi Kegiatan PKL
                          </label>
                          <textarea
                            id="cv-pklDescription"
                            rows={2}
                            placeholder="Contoh: Melakukan perbaikan perangkat elektronik, solder komponen, dan pengujian kualitas produk..."
                            className="form-input resize-none"
                            {...register('pklDescription')}
                            onChange={updateCvData}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Work Experience */}
                    <div>
                      <label htmlFor="cv-workExperience" className="block text-xs font-semibold text-foreground mb-1.5">
                        Pengalaman Kerja Lainnya
                      </label>
                      <p className="text-[11px] text-muted-foreground mb-1.5">Freelance, part-time, usaha, atau proyek mandiri</p>
                      <textarea
                        id="cv-workExperience"
                        rows={2}
                        placeholder="Contoh: Freelance instalasi jaringan WiFi untuk warnet di Kepanjen (2024)"
                        className="form-input resize-none"
                        {...register('workExperience')}
                        onChange={updateCvData}
                      />
                    </div>
                  </div>
                )}

                {/* ─── STEP 4: Target & Finalisasi ─── */}
                {currentStep === 4 && (
                  <div className="flex flex-col gap-4">
                    <div className="p-4 bg-primary/8 border border-primary/15 rounded-xl">
                      <p className="text-xs text-primary font-medium">
                        Langkah terakhir! Tentukan target lamaranmu dan tulis profil singkat untuk CV.
                      </p>
                    </div>

                    {/* Target Position */}
                    <div>
                      <label htmlFor="cv-targetPosition" className="block text-xs font-semibold text-foreground mb-1.5">
                        Posisi yang Dilamar <span className="text-danger">*</span>
                      </label>
                      <input
                        id="cv-targetPosition"
                        type="text"
                        placeholder="Contoh: Network Technician / Mekanik Kendaraan / Teknisi Audio Video"
                        className={`form-input ${errors.targetPosition ? 'error' : ''}`}
                        {...register('targetPosition', { required: 'Posisi target wajib diisi' })}
                        onChange={updateCvData}
                      />
                      {errors.targetPosition && (
                        <p className="text-xs text-danger mt-1">{errors.targetPosition.message}</p>
                      )}
                    </div>

                    {/* Target Type */}
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-2">
                        Jenis Lamaran <span className="text-danger">*</span>
                      </label>
                      <div className="flex gap-3">
                        {['PKL', 'Kerja', 'Keduanya'].map((type) => (
                          <label
                            key={`target-type-${type}`}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              value={type}
                              className="accent-primary"
                              {...register('targetType', { required: true })}
                              onChange={updateCvData}
                            />
                            <span className="text-sm text-foreground font-medium">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Target Major */}
                    <div>
                      <label htmlFor="cv-targetMajor" className="block text-xs font-semibold text-foreground mb-1.5">
                        Bidang Keahlian yang Ditonjolkan
                      </label>
                      <div className="relative">
                        <select
                          id="cv-targetMajor"
                          className="form-input appearance-none pr-8"
                          {...register('targetMajor')}
                          onChange={updateCvData}
                        >
                          <option value="">Pilih Bidang</option>
                          <option value="Teknik Komputer dan Jaringan">Teknik Komputer dan Jaringan</option>
                          <option value="Teknik Audio Video">Teknik Audio Video</option>
                          <option value="Teknik Kendaraan Ringan">Teknik Kendaraan Ringan</option>
                        </select>
                        <ChevronRight size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rotate-90" />
                      </div>
                    </div>

                    {/* About Me */}
                    <div>
                      <label htmlFor="cv-aboutMe" className="block text-xs font-semibold text-foreground mb-1.5">
                        Profil Singkat / Tentang Saya <span className="text-danger">*</span>
                      </label>
                      <p className="text-[11px] text-muted-foreground mb-1.5">
                        2–3 kalimat mendeskripsikan dirimu, keahlian utama, dan tujuan karir (min. 80 karakter)
                      </p>
                      <textarea
                        id="cv-aboutMe"
                        rows={4}
                        placeholder="Contoh: Saya adalah siswa SMK jurusan TKJ yang memiliki keahlian di bidang jaringan komputer dan administrasi sistem Linux. Berpengalaman PKL di PT Telkom selama 3 bulan. Siap berkontribusi dan terus belajar di lingkungan kerja yang profesional."
                        className={`form-input resize-none ${errors.aboutMe ? 'error' : ''}`}
                        {...register('aboutMe', {
                          required: 'Profil singkat wajib diisi',
                          minLength: { value: 80, message: 'Minimal 80 karakter' },
                        })}
                        onChange={updateCvData}
                      />
                      {errors.aboutMe && (
                        <p className="text-xs text-danger mt-1 flex items-center gap-1">
                          <AlertCircle size={11} />{errors.aboutMe.message}
                        </p>
                      )}
                    </div>

                    {/* Summary before generate */}
                    <div className="bg-muted rounded-2xl p-4 flex flex-col gap-2">
                      <h4 className="text-xs font-bold text-foreground mb-1">Ringkasan CV</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Nama:</span>
                          <span className="ml-1 font-semibold text-foreground">{cvData.fullName || '—'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Jurusan:</span>
                          <span className="ml-1 font-semibold text-foreground">{cvData.major ? cvData.major.split('(')[1]?.replace(')', '') || cvData.major : '—'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Hard Skills:</span>
                          <span className="ml-1 font-semibold text-foreground">{(cvData.hardSkills || []).length} dipilih</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Soft Skills:</span>
                          <span className="ml-1 font-semibold text-foreground">{(cvData.softSkills || []).length} dipilih</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={15} />
                  Sebelumnya
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95"
                  >
                    Selanjutnya
                    <ChevronRight size={15} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 bg-success text-white rounded-xl text-sm font-semibold hover:bg-success/90 transition-all active:scale-95"
                  >
                    <Eye size={15} />
                    Generate CV
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Live Preview Panel */}
        <div className="xl:w-[420px] 2xl:w-[480px] shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-foreground">Preview CV</h3>
              <span className="text-[11px] text-muted-foreground">Update otomatis saat kamu mengisi form</span>
            </div>
            <div className="cv-paper rounded-2xl overflow-hidden">
              <CVPreview data={cvData} />
            </div>
          </div>
        </div>
      </div>

      {/* Full CV Preview Modal */}
      {showPreview && (
        <CVPreviewModal data={cvData} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

function CVPreviewModal({
  data,
  onClose,
}: {
  data: Partial<CVData>;
  onClose: () => void;
}) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="drawer-overlay absolute inset-0" onClick={onClose} />
      <div className="relative bg-background rounded-3xl shadow-modal w-full max-w-3xl max-h-[95vh] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h3 className="font-bold text-base text-foreground">CV Siap Unduh</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl text-sm font-semibold hover:bg-border transition-colors"
            >
              <Printer size={15} />
              Cetak
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95"
            >
              <Download size={15} />
              Unduh PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
              aria-label="Tutup preview"
            >
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="cv-paper rounded-xl overflow-hidden">
            <CVPreview data={data} fullView />
          </div>
        </div>
      </div>
    </div>
  );
}