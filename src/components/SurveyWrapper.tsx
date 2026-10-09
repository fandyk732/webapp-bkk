'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import CareerSurveyModal from '@/app/dashboard/components/CareerSurveyModal';

export default function SurveyWrapper() {
  const supabase = createClient();
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    id: string;
    name: string;
    kelas: string;
    major: string;
    phone: string;
  } | null>(null);

  useEffect(() => {
    const checkSurveyStatus = async () => {
      // Dapatkan user session yang aktif
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Cek jika user sudah pernah mengisi survey
        const { data: surveyData } = await supabase
          .from('student_surveys')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        // Jika belum isi survey, tampilkan modal
        if (!surveyData) {
          setUserProfile({
            id: user.id,
            name: user.user_metadata?.full_name || user.user_metadata?.name || 'Siswa BKK',
            kelas: user.user_metadata?.kelas || 'XII',
            major: user.user_metadata?.major || 'Siswa',
            phone: user.user_metadata?.phone || '',
          });
          setShowSurveyModal(true);
        }
      }
    };

    checkSurveyStatus();
  }, []);

  if (!showSurveyModal || !userProfile) return null;

  return (
    <CareerSurveyModal
      userId={userProfile.id}
      studentProfile={{
        name: userProfile.name,
        kelas: userProfile.kelas,
        major: userProfile.major,
        phone: userProfile.phone,
      }}
      onSuccess={() => setShowSurveyModal(false)}
    />
  );
}