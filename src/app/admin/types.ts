export interface StatsData {
  mitraAktif: number;
  lowonganTerbuka: number;
  slotPKL: number;
  tingkatPenempatan: string;
  totalPelamar: number;
}

export interface MitraForm {
  nama: string;
  logo: string;
  sektor: string;
  lokasi: string;
  jurusan: string[];
  mou_year: string;
  kerjasama_sejak: number;
  status: string;
}

export interface JobForm {
  title: string;
  company: string;
  company_logo: string;
  type: string;
  majors: string[];
  location: string;
  salary: string;
  deadline: string;
  description: string;
  quota: number;
  qualifications: string;
  benefits: string;
}