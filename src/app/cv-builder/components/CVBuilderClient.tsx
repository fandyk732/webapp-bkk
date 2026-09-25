'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ChevronRight, ChevronLeft, Printer, CheckCircle2, Eye, X } from 'lucide-react';

import { CVData, STEPS } from './cv-constants';
import CVPreview from './CVPreview';
import StepPersonal from './steps/StepPersonal';
import StepEducation from './steps/StepEducation';
import StepSkills from './steps/StepSkills';
import StepTarget from './steps/StepTarget';

export default function CVBuilderClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [cvData, setCvData] = useState<Partial<CVData>>({
    hardSkills: [],
    softSkills: [],
    smkName: 'SMK Al Kaaffah Kepanjen',
  });
  const [showPreview, setShowPreview] = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues, trigger } = useForm<CVData>({
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
    toast.success('CV berhasil dibuat! Klik tombol "Cetak / Simpan sebagai PDF" untuk mengunduh.');
  };

  const completionPercent = Math.round(((currentStep - 1) / 4) * 100);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
      {/* Header */}
      <div className="mb-8 text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold text-foreground">Generator CV BKK</h1>
        <p className="text-muted-foreground text-sm mt-2">
          Buat CV standar BKK SMK Al Kaaffah Kepanjen dalam 4 langkah mudah.
        </p>
      </div>

      {/* Progress & Step Indicator */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="quota-bar-track mb-5">
          <div className="quota-bar-fill" style={{ width: `${completionPercent}%`, backgroundColor: 'var(--primary)' }} />
        </div>
        <div className="flex items-center justify-between">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            return (
              <React.Fragment key={`step-${step.id}`}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCompleted ? 'step-completed' : isActive ? 'step-active' : 'step-inactive'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={16} className="text-white" /> : <step.icon size={15} className={isActive ? 'text-white' : 'text-muted-foreground'} />}
                  </div>
                  <span className={`text-[11px] font-semibold hidden sm:block ${isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${currentStep > step.id ? 'bg-success' : 'bg-border'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Form & Live Preview */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <form onSubmit={handleSubmit(onFinalSubmit)}>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-border bg-muted/30 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  {React.createElement(STEPS[currentStep - 1].icon, { size: 17, className: 'text-primary' })}
                </div>
                <div>
                  <h2 className="font-bold text-base text-foreground">
                    Langkah {currentStep}: {STEPS[currentStep - 1].label}
                  </h2>
                </div>
              </div>

              <div className="px-6 py-6">
                {currentStep === 1 && <StepPersonal register={register} errors={errors} updateCvData={updateCvData} />}
                {currentStep === 2 && <StepEducation register={register} errors={errors} updateCvData={updateCvData} />}
                {currentStep === 3 && <StepSkills register={register} cvData={cvData} setCvData={setCvData} updateCvData={updateCvData} />}
                {currentStep === 4 && <StepTarget register={register} errors={errors} cvData={cvData} updateCvData={updateCvData} />}
              </div>

              <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-muted disabled:opacity-40"
                >
                  <ChevronLeft size={15} /> Sebelumnya
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90"
                  >
                    Selanjutnya <ChevronRight size={15} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 bg-success text-white rounded-xl text-sm font-semibold hover:bg-success/90"
                  >
                    <Eye size={15} /> Generate CV
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Live Preview Side */}
        <div className="xl:w-[420px] 2xl:w-[480px] shrink-0">
          <div className="sticky top-24">
            <h3 className="font-bold text-sm text-foreground mb-3">Preview CV</h3>
            <div className="cv-paper rounded-2xl overflow-hidden">
              <CVPreview data={cvData} />
            </div>
          </div>
        </div>
      </div>

      {showPreview && <CVPreviewModal data={cvData} onClose={() => setShowPreview(false)} />}
    </div>
  );
}

function CVPreviewModal({ data, onClose }: { data: Partial<CVData>; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="drawer-overlay absolute inset-0" onClick={onClose} />
      <div className="relative bg-background rounded-3xl shadow-modal w-full max-w-3xl max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h3 className="font-bold text-base text-foreground">CV Siap Unduh</h3>
          <div className="flex items-center gap-2">
            {/* Sebelumnya ada 2 tombol ("Cetak" & "Unduh PDF") yang manggil window.print()
                yang sama persis — digabung jadi 1 tombol yang jujur soal apa yang
                sebenarnya terjadi (browser print dialog, yang punya opsi "Save as PDF"
                di kebanyakan browser). PDF generation asli (tanpa dialog print) butuh
                library tambahan seperti jspdf/html2canvas yang belum ada di project ini. */}
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">
              <Printer size={15} /> Cetak / Simpan sebagai PDF
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted">
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