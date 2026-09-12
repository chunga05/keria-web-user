'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronDown } from 'lucide-react';
import { useProjectStages } from '@/hooks/useProjectStages';
import { supabase } from '@/lib/supabase';

// ==========================================
// 1. INTERFACE
// ==========================================
interface ChangItem {
  id: number;
  title: string;
  subTitle: string;
  time: string;
  stampImg: string;
  status: 'chua_mo' | 'tu_choi' | 'da_nhan';
  statusText: string;
  ribbonBg: string;
  buttonText?: string;
  bgColor: string;
}

interface ProjectOption {
  id: number;
  title: string;
}

export interface NhanDauModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: number;
}

// ==========================================
// 2. HÀM CHUYỂN ĐỔI DATA DB -> UI
// ==========================================
const mapStageToUI = (
  stage: {
    id: number;
    project_id: number;
    stage_order: number;
    stage_name: string;
    stamp_image_url?: string | null;
  },
  index: number
): ChangItem => {
  const statusList = ['chua_mo', 'tu_choi', 'da_nhan'] as const;
  const status = statusList[index % statusList.length];

  let statusText = 'CHƯA MỞ';
  let ribbonBg = 'bg-[#ff5596]';
  let bgColor = 'bg-[#0086ff]';
  let buttonText: string | undefined = 'TẢI ẢNH LÊN';

  if (status === 'tu_choi') {
    statusText = 'ĐÃ BỊ TỪ CHỐI';
    ribbonBg = 'bg-[#0070e0]';
    bgColor = 'bg-[#091e42]';
    buttonText = 'THỬ LẠI';
  }

  if (status === 'da_nhan') {
    statusText = 'ĐÃ NHẬN';
    ribbonBg = 'bg-[#0070e0]';
    bgColor = 'bg-[#f4418e]';
    buttonText = undefined;
  }

  return {
    id: stage.id,
    title: stage.stage_name || 'TÊN CHẶNG',
    subTitle: 'Con dấu dự án',
    time: 'Chưa cập nhật',
    stampImg: stage.stamp_image_url || '/images/handbook/stamp.png',
    status,
    statusText,
    ribbonBg,
    buttonText,
    bgColor,
  };
};

// ==========================================
// 3. COMPONENT CHÍNH
// ==========================================
export function NhanDauModal({
  isOpen,
  onClose,
  projectId,
}: NhanDauModalProps) {
  // State lưu danh sách dự án & ID dự án đang chọn nội bộ bên trong Modal
  const [projectList, setProjectList] = useState<ProjectOption[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<number | undefined>(projectId);

  // Tải danh sách các dự án đang hoạt động khi mở Modal
  useEffect(() => {
    if (!isOpen) return;

    const fetchProjectList = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title')
        .eq('is_active', true)
        .order('id', { ascending: false });

      if (data && data.length > 0) {
        setProjectList(data);
        // Nếu prop projectId truyền vào không có hoặc không khớp thì chọn dự án đầu tiên
        if (!projectId) {
          setActiveProjectId(data[0].id);
        } else {
          setActiveProjectId(projectId);
        }
      }

      if (error) {
        console.error('Lỗi tải danh sách dự án trong modal:', error.message);
      }
    };

    fetchProjectList();
  }, [isOpen, projectId]);

  // Nạp danh sách các chặng theo activeProjectId đang được chọn trên Dropdown
  const { stages, loading, error } = useProjectStages(
    isOpen && activeProjectId ? Number(activeProjectId) : undefined
  );

  if (!isOpen) return null;

  const displayStages = stages.map((stage, index) =>
    mapStageToUI(stage, index)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-[2vw]">
      {/* Nền backdrop mờ */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Container Modal */}
      <div className="relative z-10 w-[88vw] max-w-[1150px] max-h-[92vh] rounded-[2.2vw] bg-white px-[3.5vw] pt-[5vw] pb-[4vw] shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Banner PAWPORT */}
        <div className="absolute -top-[3.2vw] left-1/2 -translate-x-1/2 w-[22vw] max-w-[280px] min-w-[180px] aspect-[320/110] drop-shadow-lg pointer-events-none">
          <Image
            src="/images/handbook/pinkpaw.png"
            alt="PAWPORT Banner"
            fill
            sizes="(max-width: 768px) 40vw, 22vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Nút đóng */}
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-[1.5vw] right-[1.5vw] flex h-[2.8vw] w-[2.8vw] min-h-[32px] min-w-[32px] items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <X className="h-[60%] w-[60%]" />
        </button>

        {/* Tiêu đề */}
        <h2 className="mb-[1.5vw] text-center text-[2vw] text-[22px] font-black tracking-wider text-black">
          <span className="text-[#0086ff]">★ </span>
          NHẬN DẤU
          <span className="text-[#0086ff]"> ★</span>
        </h2>

        {/* DROPDOWN CHỌN PROJECT BÊN TRONG MODAL */}
        <div className="mb-[2vw] flex items-center justify-center gap-2">
          <div className="relative flex items-center">
            <select
              value={activeProjectId || ''}
              onChange={(e) => setActiveProjectId(Number(e.target.value))}
              className="appearance-none cursor-pointer rounded-full border-2 border-[#0086ff]/30 bg-blue-50/50 px-5 py-2 pr-10 text-xs font-bold text-[#0077D4] shadow-sm transition-all hover:border-[#0086ff] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0091FF]"
            >
              {projectList.length === 0 ? (
                <option value="">Đang tải danh sách dự án...</option>
              ) : (
                projectList.map((p) => (
                  <option key={p.id} value={p.id}>
                    Dự án: {p.title}
                  </option>
                ))
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[#0077D4]" />
          </div>
        </div>

        {/* Trạng thái Loading */}
        {loading && (
          <div className="py-[6vw] text-center">
            <div className="mx-auto mb-4 h-[3vw] w-[3vw] min-h-[32px] min-w-[32px] animate-spin rounded-full border-4 border-gray-200 border-t-[#0086ff]" />
            <p className="font-medium text-gray-500 text-[1.1vw] text-sm">Đang tải các chặng...</p>
          </div>
        )}

        {/* Trạng thái Lỗi */}
        {!loading && error && (
          <div className="py-[4vw] text-center">
            <p className="font-bold text-red-500 text-[1.2vw] text-base">Không thể tải danh sách chặng</p>
            <p className="mt-2 text-[0.95vw] text-xs text-gray-500">{error}</p>
          </div>
        )}

        {/* Trạng thái Trống */}
        {!loading && !error && displayStages.length === 0 && (
          <div className="py-[4vw] text-center">
            <p className="font-bold text-gray-500 text-[1.2vw] text-base">Chưa có chặng nào</p>
            <p className="mt-2 text-[0.95vw] text-xs text-gray-400">Dự án này chưa có chặng trong hệ thống.</p>
          </div>
        )}

        {/* Danh sách các chặng */}
        {/* Danh sách các chặng */}
        {!loading && !error && displayStages.length > 0 && (
          <div className="flex flex-col gap-5 overflow-y-auto px-2 py-2 flex-1">
            {displayStages.map((item) => (
              <div key={item.id} className="relative flex items-center w-full min-h-[130px]">
                
                {/* ==========================================
                    1. CON DẤU (STAMP)
                  ========================================== */}
                <div className="relative z-30 w-[24%] max-w-[200px] min-w-[140px] aspect-[4/3] -rotate-3 drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)] transition-transform hover:rotate-0 hover:scale-105 duration-300 pointer-events-none">
                  <Image
                    src={item.stampImg}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 25vw, 200px"
                    className="object-contain"
                    unoptimized={item.stampImg.startsWith('http')}
                  />
                </div>

                {/* ==========================================
                    2. THANH NGANG NỘI DUNG (CARD CONTAINER)
                  ========================================== */}
                <div
                  className={`relative z-10 flex-1 -ml-[8%] sm:-ml-[6%] overflow-hidden rounded-none ${item.bgColor} py-4 sm:py-5 pl-[12%] sm:pl-[10%] pr-6 sm:pr-8 text-white shadow-lg flex items-center justify-between min-h-[110px] sm:min-h-[125px]`}
                >
                  {/* Nền Caro Pattern */}
                  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    <Image
                      src="/images/handbook/pattern1.png"
                      alt=""
                      fill
                      sizes="80vw"
                      className="w-full h-full object-cover opacity-25 mix-blend-overlay scale-105"
                    />
                  </div>

                  {/* ==========================================
                      3. RIBBON GÓC PHẢI (CĂN CHUẨN KHÔNG MẤT CHỮ)
                    ========================================== */}
                  <div className="absolute top-0 right-0 w-28 sm:w-32 h-28 sm:h-32 overflow-hidden pointer-events-none z-20">
                    <div
                      className={`absolute top-[18px] sm:top-[22px] -right-[32px] sm:-right-[35px] w-[130px] sm:w-[150px] rotate-45 ${item.ribbonBg} border-y-2 border-white/90 py-0.5 text-center text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white shadow-md`}
                    >
                      {item.statusText}
                    </div>
                  </div>

                  {/* ==========================================
                      4. CỤM THÔNG TIN CHẶNG
                    ========================================== */}
                  <div className="relative z-10 space-y-0.5 sm:space-y-1">
                    <p className="text-xs sm:text-sm font-medium text-white/90 tracking-tight">
                      {item.subTitle}
                    </p>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-wide uppercase leading-none">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-white/95 pt-0.5">
                      Thời gian nhận dấu:{' '}
                      <span className="font-bold">{item.time}</span>
                    </p>
                  </div>

                  {/* ==========================================
                      5. NÚT HÀNH ĐỘNG (THU NHỎ VỪA VẶN)
                    ========================================== */}
                  <div className="relative z-10 shrink-0 ml-4 mr-6 sm:mr-8 flex items-center">
                    {item.buttonText && (
                      <button
                        type="button"
                        className="cursor-pointer rounded-none bg-[#ff5c98] px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-extrabold tracking-wider text-white shadow-md transition-all hover:bg-[#ff4387] active:scale-95 whitespace-nowrap text-center uppercase"
                      >
                        {item.buttonText}
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}