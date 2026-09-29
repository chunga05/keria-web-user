// hooks/useProjectStages.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentJwtUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export type StampStatus = 'chua_gui' | 'da_gui' | 'tu_choi' | 'da_nhan';

export interface ProjectStage {
  id: number;
  project_id: number;
  stage_order: number;
  stage_name: string;
  stamp_image_url?: string | null;
}

export interface FormattedStageItem {
  id: number;
  title: string;
  subTitle: string;
  time: string;
  stampImg: string;
  status: StampStatus;
  statusText: string;
  ribbonBg: string;
  buttonText?: string;
  isButtonDisabled: boolean;
  bgColor: string;
}

export const mapStageToUI = (
  stage: ProjectStage,
  userStatus: StampStatus = 'chua_gui'
): FormattedStageItem => {
  let statusText = 'CHƯA NHẬN';
  let ribbonBg = 'bg-[#ff5596]';
  let bgColor = 'bg-[#0086ff]';
  let buttonText: string | undefined = 'TẢI ẢNH LÊN';
  let isButtonDisabled = false;

  switch (userStatus) {
    case 'da_gui':
      statusText = 'ĐÃ GỬI';
      ribbonBg = 'bg-[#f59e0b]';
      bgColor = 'bg-[#0284c7]';
      buttonText = 'CHỜ DUYỆT';
      isButtonDisabled = true;
      break;

    case 'tu_choi':
      statusText = 'BỊ TỪ CHỐI';
      ribbonBg = 'bg-[#ef4444]';
      bgColor = 'bg-[#0f172a]';
      buttonText = 'THỬ LẠI';
      isButtonDisabled = false;
      break;

    case 'da_nhan':
      statusText = 'ĐÃ NHẬN';
      ribbonBg = 'bg-[#10b981]';
      bgColor = 'bg-[#ec4899]';
      buttonText = undefined;
      isButtonDisabled = true;
      break;

    case 'chua_gui':
    default:
      statusText = 'CHƯA NHẬN';
      ribbonBg = 'bg-[#ff5596]';
      bgColor = 'bg-[#0086ff]';
      buttonText = 'TẢI ẢNH LÊN';
      isButtonDisabled = false;
      break;
  }

  return {
    id: stage.id,
    title: stage.stage_name || 'TÊN CHẶNG',
    subTitle: 'Con dấu dự án',
    time: 'Chưa cập nhật',
    stampImg: stage.stamp_image_url || '/images/handbook/stamp.png',
    status: userStatus,
    statusText,
    ribbonBg,
    buttonText,
    isButtonDisabled,
    bgColor,
  };
};

export function useProjectStages(projectId?: number) {
  const [stages, setStages] = useState<ProjectStage[]>([]);
  const [userStageStatuses, setUserStageStatuses] = useState<Record<number, StampStatus>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingStageId, setUploadingStageId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkUser() {
      const currentUser = await getCurrentJwtUser();
      setCurrentUserId(currentUser?.id || null);
    }
    checkUser();
  }, []);

  const fetchStages = useCallback(async () => {
    if (!projectId) {
      setStages([]);
      setUserStageStatuses({});
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/stages`);
      if (!res.ok) throw new Error('Không thể lấy danh sách chặng');

      const stageData: ProjectStage[] = await res.json();
      setStages(stageData ?? []);

      const currentUser = await getCurrentJwtUser();
      const uid = currentUser?.id;

      if (uid && stageData.length > 0) {
        const stageIds = stageData.map((s) => s.id);

        // Lấy lịch sử yêu cầu từ bảng stamp_requests
        const { data: requests, error: reqError } = await supabase
          .from('stamp_requests')
          .select('stage_id, status, created_at')
          .eq('user_id', uid)
          .in('stage_id', stageIds)
          .order('created_at', { ascending: true }); // Bản ghi mới nhất sẽ ghi đè sau

        if (!reqError && requests) {
          const statusMap: Record<number, StampStatus> = {};
          requests.forEach((req: any) => {
            if (req.status === 'approved') statusMap[req.stage_id] = 'da_nhan';
            else if (req.status === 'pending') statusMap[req.stage_id] = 'da_gui';
            else if (req.status === 'rejected') statusMap[req.stage_id] = 'tu_choi';
          });
          setUserStageStatuses(statusMap);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi tải chặng');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  // Hàm upload ảnh và gửi vào bảng stamp_requests
  const submitStageProof = async (stageId: number, file: File) => {
    if (!currentUserId) {
      alert('Vui lòng đăng nhập trước khi nhận dấu!');
      return false;
    }

    setUploadingStageId(stageId);

    try {
      // 1. Gửi ảnh lên R2 qua server API
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload/r2', {
        method: 'POST',
        body: formData,
      });

      let data: any = {};
      const responseText = await res.text();
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { error: responseText };
      }

      if (!res.ok) {
        throw new Error(data?.error || `Upload lỗi: mã ${res.status}`);
      }

      const proofImageUrl = data.publicUrl;

      // 2. Chèn yêu cầu mới vào bảng stamp_requests với trạng thái 'pending'
      const { error: dbError } = await supabase
        .from('stamp_requests')
        .insert([
          {
            user_id: currentUserId,
            stage_id: stageId,
            evidence_image_url: proofImageUrl,
            status: 'pending',
          },
        ]);

      if (dbError) throw dbError;

      // 3. Đổi giao diện nút sang "ĐÃ GỬI"
      setUserStageStatuses((prev) => ({
        ...prev,
        [stageId]: 'da_gui',
      }));

      return true;
    } catch (err: any) {
      console.error('Lỗi nộp yêu cầu:', err);
      alert('Lỗi: ' + (err.message || 'Gửi yêu cầu thất bại'));
      return false;
    } finally {
      setUploadingStageId(null);
    }
  };

  const displayStages: FormattedStageItem[] = stages.map((stage) =>
    mapStageToUI(stage, userStageStatuses[stage.id] || 'chua_gui')
  );

  return {
    stages: displayStages,
    loading,
    error,
    uploadingStageId,
    submitStageProof,
    reload: fetchStages,
  };
}