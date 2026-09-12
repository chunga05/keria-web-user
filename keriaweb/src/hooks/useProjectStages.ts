'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface ProjectStage {
  id: number;
  project_id: number;
  stage_order: number;
  stage_name: string;
  stamp_image_url?: string | null;
}

export function useProjectStages(projectId?: number) {
console.log('👀 Giá trị projectId truyền vào useProjectStages:', projectId, typeof projectId);
console.trace('📍 Vết gọi modal từ file nào:');
  const [stages, setStages] = useState<ProjectStage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Kiểm tra sớm: Nếu chưa có projectId thì dọn sạch state và dừng
    if (!projectId) {
      setStages([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchStages = async () => {
      console.log('🔎 Đang lấy stages cho projectId:', projectId);

      setLoading(true);
      setError(null);

      // Ép Number(projectId) để đảm bảo khớp kiểu int trong Postgres
      const { data, error } = await supabase
        .from('project_stages')
        .select('id, project_id, stage_order, stage_name, stamp_image_url')
        .eq('project_id', Number(projectId))
        .order('stage_order', { ascending: true });

      console.log('📦 Data:', data);
      if (error) console.log('❌ Error:', error);

      if (error) {
        setError(error.message);
        setStages([]);
      } else {
        setStages(data ?? []);
      }

      setLoading(false);
    };

    fetchStages();
  }, [projectId]);

  return {
    stages,
    loading,
    error,
  };
}