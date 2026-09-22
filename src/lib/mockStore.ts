export interface HeroStats {
  mitraAktif: number;
  lowonganTerbuka: number;
  slotPKL: number;
  tingkatPenempatan: number;
}

export interface MitraIndustri {
  id: string;
  name: string;
  logo: string;
  category: string;
  location: string;
  jurusan: string[];
  mouActive: boolean;
  mouYear: string;
}

export interface JobVacancy {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  type: 'PKL' | 'Kerja' | 'Keduanya';
  jurusan: string[];
  location: string;
  salary: string;
  deadline: string;
  description: string;
  requirements: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  jurusan: string;
  cvUrl: string;
  status: 'Pending' | 'Review' | 'Diterima' | 'Ditolak';
  appliedAt: string;
}

// Data Awal (Fallback)
const initialStats: HeroStats = {
  mitraAktif: 47,
  lowonganTerbuka: 33,
  slotPKL: 128,
  tingkatPenempatan: 91.4,
};

const initialMitra: MitraIndustri[] = [
  {
    id: 'm1',
    name: 'PT Telkom Indonesia',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150',
    category: 'Teknologi & Informasi',
    location: 'Malang',
    jurusan: ['TKJ'],
    mouActive: true,
    mouYear: '2024-2027',
  },
  {
    id: 'm2',
    name: 'PT Astra Honda Motor',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150',
    category: 'Otomotif & Manufaktur',
    location: 'Surabaya',
    jurusan: ['TKR', 'TAV'],
    mouActive: true,
    mouYear: '2023-2026',
  },
];

const initialVacancies: JobVacancy[] = [
  {
    id: 'j1',
    title: 'Teknisi Jaringan & Fiber Optik',
    companyName: 'PT Telkom Indonesia',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150',
    type: 'PKL',
    jurusan: ['TKJ'],
    location: 'Kab. Malang',
    salary: 'Uang Saku PKL',
    deadline: '25 Sept 2026',
    description: 'Membantu pemeliharaan infrastruktur jaringan dan konfigurasi router.',
    requirements: ['Siswa aktif TKJ', 'Memahami Dasar Mikrotik & Cisco', 'Disiplin'],
  },
  {
    id: 'j2',
    title: 'Junior Service Technician',
    companyName: 'PT Astra Honda Motor',
    companyLogo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150',
    type: 'Kerja',
    jurusan: ['TKR'],
    location: 'Surabaya',
    salary: 'UMR + Bonus',
    deadline: '10 Okt 2026',
    description: 'Melakukan perbaikan dan perawatan berkala kendaraan pelanggan.',
    requirements: ['Alumni SMK TKR', 'Memahami Mesin Injeksi', 'Punya SIM C'],
  },
];

// Helper Storage
export const getStoredData = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

export const setStoredData = <T>(key: string, data: T): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage-updated'));
  }
};

// API Mock Functions
export const mockDataService = {
  getStats: () => getStoredData('bkk_stats', initialStats),
  updateStats: (data: HeroStats) => setStoredData('bkk_stats', data),

  getMitra: () => getStoredData('bkk_mitra', initialMitra),
  saveMitra: (mitra: MitraIndustri[]) => setStoredData('bkk_mitra', mitra),

  getVacancies: () => getStoredData('bkk_vacancies', initialVacancies),
  saveVacancies: (vacancies: JobVacancy[]) => setStoredData('bkk_vacancies', vacancies),

  getApplications: () => getStoredData<JobApplication[]>('bkk_applications', []),
  addApplication: (app: Omit<JobApplication, 'id' | 'appliedAt' | 'status'>) => {
    const apps = getStoredData<JobApplication[]>('bkk_applications', []);
    const newApp: JobApplication = {
      ...app,
      id: 'app_' + Date.now(),
      status: 'Pending',
      appliedAt: new Date().toLocaleDateString('id-ID'),
    };
    setStoredData('bkk_applications', [newApp, ...apps]);
    return newApp;
  },
};