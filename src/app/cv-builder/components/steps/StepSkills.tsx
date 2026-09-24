'use client';

import React, { useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { CheckCircle2, Plus, X } from 'lucide-react';
import { CVData, HARD_SKILL_OPTIONS, SOFT_SKILL_OPTIONS } from '../cv-constants';

interface StepSkillsProps {
  register: UseFormRegister<CVData>;
  cvData: Partial<CVData>;
  setCvData: React.Dispatch<React.SetStateAction<Partial<CVData>>>;
  updateCvData: () => void;
}

export default function StepSkills({ register, cvData, setCvData, updateCvData }: StepSkillsProps) {
  const [hardSkillInput, setHardSkillInput] = useState('');
  const [softSkillInput, setSoftSkillInput] = useState('');

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

  return (
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
                    ? 'bg-accent text-white border-accent'
                    : 'bg-muted text-muted-foreground border-border hover:border-accent/50 hover:text-foreground'
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
  );
}