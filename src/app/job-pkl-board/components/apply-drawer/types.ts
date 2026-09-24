export interface VacancyItem {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  majors: string[];
  salary: string;
  deadline: string;
  daysLeft: number;
  qualifications: string[];
  description: string;
  quota: number;
  quotaUsed: number;
  benefits: string[];
}

export interface ApplyFormData {
  fullName: string;
  nis: string;
  kelas: string;
  major: string;
  phone: string;
  email: string;
  motivation: string;
  cvFile: FileList;
}