import React from 'react';
import type { CVData } from './CVBuilderClient';
import { MapPin, Phone, Mail, GraduationCap, Briefcase, Wrench, User } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


export default function CVPreview({
  data,
  fullView = false,
}: {
  data: Partial<CVData>;
  fullView?: boolean;
}) {
  const isEmpty = !data.fullName && !data.major;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white min-h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <User size={28} className="text-muted-foreground" />
        </div>
        <h3 className="font-bold text-sm text-foreground">Preview CV</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
          Isi form di sebelah kiri untuk melihat preview CV kamu secara langsung
        </p>
      </div>
    );
  }

  const scale = fullView ? '' : 'text-[10px]';

  return (
    <div className={`bg-white ${fullView ? 'p-8' : 'p-5'} ${scale}`}>
      {/* CV Header */}
      <div className="border-b-2 pb-4 mb-4" style={{ borderColor: 'var(--primary)' }}>
        {/* BKK Header */}
        <div className="text-center mb-3">
          <div
            className={`font-extrabold text-white px-3 py-1.5 rounded-lg inline-block mb-1 ${fullView ? 'text-sm' : 'text-[9px]'}`}
            style={{ backgroundColor: 'var(--primary)' }}
          >
            CURRICULUM VITAE
          </div>
          <p className={`text-muted-foreground ${fullView ? 'text-xs' : 'text-[8px]'}`}>
            Bursa Kerja Khusus (BKK) SMK Al Kaaffah Kepanjen
          </p>
        </div>

        {/* Name & Identity */}
        <div className="text-center">
          <h1
            className={`font-extrabold text-foreground ${fullView ? 'text-2xl' : 'text-base'}`}
            style={{ letterSpacing: '-0.028em' }}
          >
            {data.fullName || 'Nama Lengkap'}
          </h1>
          <p className={`font-semibold mt-0.5 ${fullView ? 'text-sm' : 'text-[10px]'}`} style={{ color: 'var(--primary)' }}>
            {data.major || 'Program Keahlian'}
          </p>
          {data.targetPosition && (
            <p className={`text-muted-foreground mt-0.5 ${fullView ? 'text-xs' : 'text-[9px]'}`}>
              Target: {data.targetPosition}
            </p>
          )}
        </div>

        {/* Contact Row */}
        <div className={`flex flex-wrap justify-center gap-3 mt-3 ${fullView ? 'text-xs' : 'text-[8px]'}`}>
          {data.address && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <MapPin size={fullView ? 11 : 8} style={{ color: 'var(--primary)' }} />
              {data.address.split(',')[0]}
            </span>
          )}
          {data.phone && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Phone size={fullView ? 11 : 8} style={{ color: 'var(--primary)' }} />
              {data.phone}
            </span>
          )}
          {data.email && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Mail size={fullView ? 11 : 8} style={{ color: 'var(--primary)' }} />
              {data.email}
            </span>
          )}
        </div>
      </div>

      {/* Data Diri */}
      {(data.fullName || data.birthPlace) && (
        <CVSection title="DATA DIRI" icon={User} fullView={fullView}>
          <div className={`grid grid-cols-2 gap-x-4 gap-y-1 ${fullView ? 'text-sm' : 'text-[9px]'}`}>
            {data.fullName && <CVRow label="Nama Lengkap" value={data.fullName} />}
            {data.nis && <CVRow label="NIS" value={data.nis} />}
            {data.kelas && <CVRow label="Kelas" value={data.kelas} />}
            {data.major && <CVRow label="Jurusan" value={data.major} />}
            {(data.birthPlace || data.birthDate) && (
              <CVRow label="TTL" value={`${data.birthPlace || ''}${data.birthDate ? `, ${data.birthDate}` : ''}`} />
            )}
            {data.gender && <CVRow label="Jenis Kelamin" value={data.gender} />}
            {data.religion && <CVRow label="Agama" value={data.religion} />}
            {data.phone && <CVRow label="No. HP / WA" value={data.phone} />}
            {data.email && <CVRow label="Email" value={data.email} />}
            {data.address && (
              <div className="col-span-2">
                <CVRow label="Alamat" value={data.address} />
              </div>
            )}
          </div>
        </CVSection>
      )}

      {/* Profil Singkat */}
      {data.aboutMe && (
        <CVSection title="PROFIL SINGKAT" icon={User} fullView={fullView}>
          <p className={`text-foreground leading-relaxed ${fullView ? 'text-sm' : 'text-[9px]'}`}>
            {data.aboutMe}
          </p>
        </CVSection>
      )}

      {/* Pendidikan */}
      {(data.sdName || data.smpName || data.smkName) && (
        <CVSection title="RIWAYAT PENDIDIKAN" icon={GraduationCap} fullView={fullView}>
          <div className={`flex flex-col gap-1.5 ${fullView ? 'text-sm' : 'text-[9px]'}`}>
            {data.sdName && (
              <EducationRow school={data.sdName} year={data.sdYear} level="SD/MI" fullView={fullView} />
            )}
            {data.smpName && (
              <EducationRow school={data.smpName} year={data.smpYear} level="SMP/MTs" fullView={fullView} />
            )}
            {data.smkName && (
              <EducationRow school={data.smkName} year={data.smkYear} level="SMK" fullView={fullView} />
            )}
          </div>
          {data.certifications && (
            <div className={`mt-2 pt-2 border-t border-border ${fullView ? 'text-xs' : 'text-[8px]'}`}>
              <p className="font-semibold text-foreground mb-1">Sertifikasi & Prestasi:</p>
              <p className="text-muted-foreground whitespace-pre-line">{data.certifications}</p>
            </div>
          )}
        </CVSection>
      )}

      {/* Keahlian */}
      {((data.hardSkills && data.hardSkills.length > 0) || (data.softSkills && data.softSkills.length > 0)) && (
        <CVSection title="KEAHLIAN" icon={Wrench} fullView={fullView}>
          {data.hardSkills && data.hardSkills.length > 0 && (
            <div className="mb-2">
              <p className={`font-semibold text-foreground mb-1.5 ${fullView ? 'text-xs' : 'text-[8px]'}`}>Keahlian Teknis:</p>
              <div className="flex flex-wrap gap-1">
                {data.hardSkills.map((skill) => (
                  <span
                    key={`preview-hard-${skill}`}
                    className={`px-2 py-0.5 rounded font-medium ${fullView ? 'text-xs' : 'text-[8px]'}`}
                    style={{ backgroundColor: 'var(--tkj-bg)', color: 'var(--tkj)' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.softSkills && data.softSkills.length > 0 && (
            <div>
              <p className={`font-semibold text-foreground mb-1.5 ${fullView ? 'text-xs' : 'text-[8px]'}`}>Soft Skills:</p>
              <div className="flex flex-wrap gap-1">
                {data.softSkills.map((skill) => (
                  <span
                    key={`preview-soft-${skill}`}
                    className={`px-2 py-0.5 rounded font-medium ${fullView ? 'text-xs' : 'text-[8px]'}`}
                    style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning)' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CVSection>
      )}

      {/* Pengalaman */}
      {(data.pklCompany || data.workExperience) && (
        <CVSection title="PENGALAMAN" icon={Briefcase} fullView={fullView}>
          {data.pklCompany && (
            <div className={`mb-2 ${fullView ? 'text-sm' : 'text-[9px]'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{data.pklPosition || 'PKL'}</p>
                  <p className="text-muted-foreground">{data.pklCompany}</p>
                </div>
                {data.pklDuration && (
                  <span className="text-muted-foreground shrink-0 ml-2">{data.pklDuration}</span>
                )}
              </div>
              {data.pklDescription && (
                <p className={`text-muted-foreground mt-1 ${fullView ? 'text-xs' : 'text-[8px]'}`}>{data.pklDescription}</p>
              )}
            </div>
          )}
          {data.workExperience && (
            <p className={`text-muted-foreground ${fullView ? 'text-xs' : 'text-[8px]'}`}>{data.workExperience}</p>
          )}
        </CVSection>
      )}

      {/* Footer */}
      <div className={`mt-4 pt-3 border-t border-border text-center text-muted-foreground ${fullView ? 'text-xs' : 'text-[8px]'}`}>
        <p>Dokumen ini diterbitkan melalui BKK SMK Al Kaaffah Kepanjen — Portal Mitradudi</p>
        <p className="mt-0.5">Kepanjen, Kabupaten Malang, Jawa Timur</p>
      </div>
    </div>
  );
}

function CVSection({
  title,
  icon: Icon,
  children,
  fullView,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  fullView?: boolean;
}) {
  return (
    <div className="mb-4">
      <div
        className={`flex items-center gap-1.5 font-extrabold text-white px-2 py-1 rounded mb-2 ${fullView ? 'text-xs' : 'text-[8px]'}`}
        style={{ backgroundColor: 'var(--primary)' }}
      >
        <Icon size={fullView ? 11 : 8} />
        {title}
      </div>
      {children}
    </div>
  );
}

function CVRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1">
      <span className="text-muted-foreground shrink-0 w-24">{label}</span>
      <span className="text-muted-foreground shrink-0">:</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

function EducationRow({
  school,
  year,
  level,
  fullView,
}: {
  school: string;
  year?: string;
  level: string;
  fullView?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="font-semibold text-foreground">{school}</span>
        <span className={`ml-1.5 text-muted-foreground ${fullView ? 'text-xs' : 'text-[8px]'}`}>({level})</span>
      </div>
      {year && <span className="text-muted-foreground shrink-0">{year}</span>}
    </div>
  );
}