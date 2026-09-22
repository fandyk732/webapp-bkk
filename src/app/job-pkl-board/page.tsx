import { createClient } from '@/utils/supabase/server';
import JobBoardClient from './components/JobBoardClient';

export const metadata = {
  title: 'Papan Lowongan PKL & Kerja | SMK Al Kaaffah Kepanjen',
  description: 'Cari lowongan PKL dan kerja untuk jurusan TKJ, TAV, dan TKR.',
};

export const revalidate = 60; // Set 0 dulu saat testing dev agar tidak ter-cache

export default async function JobPKLBoardPage() {
  const supabase = await createClient();

  const { data: vacancies, error } = await supabase
    .from('lowongan_kerja')
    .select('id, title, company, company_logo, location, type, majors, salary, deadline, is_active, qualifications, description, quota, quota_used, benefits')
    .eq('is_active', true)
    .order('deadline', { ascending: true });

  if (error) {
    console.error('Error fetching vacancies:', error);
  }

  const formattedVacancies = (vacancies || []).map((v) => {
    const today = new Date();
    const deadlineDate = new Date(v.deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    return {
      id: v.id,
      title: v.title,
      company: v.company,
      companyLogo: v.company_logo || '',
      location: v.location,
      type: v.type,
      majors: v.majors || [],
      salary: v.salary,
      deadline: v.deadline,
      daysLeft,
      isActive: v.is_active,
      qualifications: v.qualifications || [],
      description: v.description || '',
      quota: v.quota || 0,
      quotaUsed: v.quota_used || 0,
      benefits: v.benefits || [],
    };
  });

  return <JobBoardClient initialVacancies={formattedVacancies} />;
}