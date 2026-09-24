import { User, BookOpen, Wrench, Target } from 'lucide-react';

export interface CVData {
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
  sdName: string;
  sdYear: string;
  smpName: string;
  smpYear: string;
  smkName: string;
  smkYear: string;
  certifications: string;
  hardSkills: string[];
  softSkills: string[];
  pklCompany: string;
  pklPosition: string;
  pklDuration: string;
  pklDescription: string;
  workExperience: string;
  targetPosition: string;
  targetType: string;
  targetMajor: string;
  aboutMe: string;
}

export const STEPS = [
  { id: 1, label: 'Data Diri', icon: User },
  { id: 2, label: 'Pendidikan', icon: BookOpen },
  { id: 3, label: 'Keahlian', icon: Wrench },
  { id: 4, label: 'Target', icon: Target },
];

export const HARD_SKILL_OPTIONS = [
  'Jaringan Komputer', 'Linux Administration', 'Windows Server', 'Cisco Routing',
  'Fiber Optik', 'CCTV Installation', 'Web Development', 'Database MySQL',
  'Elektronika Dasar', 'Solder & PCB', 'Audio Video System', 'Osciloscope',
  'Mekanik Otomotif', 'Diagnosa Engine OBD', 'Kelistrikan Kendaraan', 'AC Mobil',
  'Microsoft Office', 'Desain Grafis', 'Python Dasar', 'IoT Dasar',
];

export const SOFT_SKILL_OPTIONS = [
  'Kerja Tim', 'Komunikasi', 'Problem Solving', 'Disiplin', 'Inisiatif',
  'Adaptasi', 'Manajemen Waktu', 'Kepemimpinan', 'Kreativitas', 'Teliti',
];