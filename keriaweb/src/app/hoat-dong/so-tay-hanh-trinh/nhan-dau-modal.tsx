'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { X, ChevronDown, Loader2 } from 'lucide-react';
import { useProjectStages, FormattedStageItem } from '@/hooks/useProjectStages';
import {
  ProjectOption,
  validateSecureImage,
  fetchActiveProjects,
} from '@/hooks/nhanDauUtils';

export interface NhanDauModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: number;
}

export function NhanDauModal({ isOpen, onClose, projectId }: NhanDauModalProps) {
  const [projectList, setProjectList] = useState<ProjectOption[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<number | undefined>(projectId);
  const [selectedStage, setSelectedStage] = useState<FormattedStageItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track lần đầu mở để tránh render khi chưa cần
  const hasOpenedOnce = useRef(false);
  if (isOpen) hasOpenedOnce.current = true;

  // Cache cờ để không fetch lại khi modal đóng/mở lần sau
  const projectListLoaded = useRef(false);

  // Hook quản lý dữ liệu các chặng
  const { stages, loading, error, uploadingStageId, submitStageProof } =
    useProjectStages(isOpen && activeProjectId ? Number(activeProjectId) : undefined);

  // Nạp danh sách dự án — chỉ fetch 1 lần duy nhất
  useEffect(() => {
    if (!isOpen) return;
    if (projectListLoaded.current && projectList.length > 0) return;

    async function load() {
      const data = await fetchActiveProjects();
      if (data.length > 0) {
        setProjectList(data);
        setActiveProjectId((prev) => prev ?? projectId ?? data[0].id);
        projectListLoaded.current = true;
      }
    }

    load();
  }, [isOpen, projectId, projectList.length]);

  // Đóng bằng phím Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Kích hoạt chọn file
  const handleOpenUpload = (item: FormattedStageItem) => {
    setSelectedStage(item);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Nộp file minh chứng sau khi đã kiểm tra an toàn
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedStage) return;

    const checkResult = await validateSecureImage(file);
    if (!checkResult.valid) {
      alert(`⚠️ Cảnh báo an toàn:\n${checkResult.message}`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSelectedStage(null);
      return;
    }

    const isSuccess = await submitStageProof(selectedStage.id, file);
    if (isSuccess) {
      alert(`Đã gửi ảnh minh chứng cho "${selectedStage.title}". Vui lòng chờ duyệt!`);
    }
    setSelectedStage(null);
  };

  // Chưa mở lần nào → không render DOM (tiết kiệm tài nguyên)
  if (!hasOpenedOnce.current) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6
        transition-all duration-200
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className={`
          relative z-10 flex flex-col w-[96vw] sm:w-[90vw] md:w-[86vw] max-w-[1100px] max-h-[88vh] sm:max-h-[90vh]
          rounded-[22px] sm:rounded-[28px] bg-white px-3 sm:px-6 md:px-8 pt-7 sm:pt-9 md:pt-10 pb-5 sm:pb-7 shadow-2xl
          transition-transform duration-200
          ${isOpen ? 'scale-100' : 'scale-95'}
        `}
      >
        {/* Banner PAWPORT — nằm ngoài để không bị cắt */}
        <div className="absolute -top-5 sm:-top-7 md:-top-[2.8vw] left-1/2 -translate-x-1/2 w-36 sm:w-48 md:w-[22vw] max-w-[280px] aspect-[320/110] drop-shadow-lg pointer-events-none z-20">
          <Image
            src="/images/handbook/pinkpaw.png"
            alt="PAWPORT"
            fill
            sizes="(max-width: 768px) 45vw, 22vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Nút đóng */}
        <button
          onClick={onClose}
          aria-label="Đóng nhận dấu"
          className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-30 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gray-100/80 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Tiêu đề & Chọn dự án */}
        <div className="shrink-0 text-center">
          <h2 className="mb-1.5 sm:mb-2 text-base sm:text-xl md:text-2xl font-black tracking-wider text-black">
            <span className="text-[#0086ff]">★ </span>NHẬN DẤU<span className="text-[#0086ff]"> ★</span>
          </h2>

          <div className="mb-3 sm:mb-4 flex justify-center">
            <div className="relative">
              <select
                value={activeProjectId || ''}
                onChange={(e) => setActiveProjectId(Number(e.target.value))}
                className="appearance-none rounded-full border-2 border-[#0086ff]/30 bg-blue-50/50 px-4 sm:px-5 py-1 sm:py-1.5 pr-8 sm:pr-10 text-[11px] sm:text-xs font-bold text-[#0077D4] hover:bg-white focus:outline-none max-w-[85vw] truncate"
              >
                {projectList.map((p) => (
                  <option key={p.id} value={p.id}>
                    Dự án: {p.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#0077D4]" />
            </div>
          </div>
        </div>

        {/* Trạng thái Loading / Error / Empty */}
        {loading && (
          <div className="py-10 text-center text-gray-500">
            <Loader2 className="mx-auto mb-2 h-7 w-7 sm:h-8 sm:w-8 animate-spin text-[#0086ff]" />
            <p className="text-xs sm:text-sm">Đang tải các chặng...</p>
          </div>
        )}

        {!loading && error && (
          <div className="py-8 text-center text-red-500 text-xs sm:text-sm font-semibold">{error}</div>
        )}

        {!loading && !error && stages.length === 0 && (
          <div className="py-8 text-center text-gray-400 text-xs sm:text-sm">Chưa có chặng nào trong dự án này.</div>
        )}

        {/* Danh sách các chặng */}
        {!loading && !error && stages.length > 0 && (
          <div className="flex flex-1 flex-col gap-3.5 sm:gap-5 overflow-y-auto px-1 sm:px-3 py-2">
            {stages.map((item) => {
              const isUploading = uploadingStageId === item.id;

              return (
                <div key={item.id} className="relative flex w-full items-center">
                  {/* Con dấu */}
                  <div className="relative z-30 w-[22%] sm:w-[20%] md:w-[22%] max-w-[180px] min-w-[58px] sm:min-w-[110px] md:min-w-[140px] aspect-[4/3] -rotate-3 pointer-events-none shrink-0">
                    <Image
                      src={item.stampImg}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 70px, 180px"
                      className="object-contain"
                      unoptimized={item.stampImg.startsWith('http')}
                    />
                  </div>

                  {/* Thẻ chặng */}
                  <div
                    className={`relative z-10 flex flex-1 -ml-[6%] sm:-ml-[5%] min-h-[85px] sm:min-h-[110px] flex-col sm:flex-row items-start sm:items-center justify-between overflow-hidden rounded-xl sm:rounded-none ${item.bgColor} py-2.5 sm:py-4 pl-[8%] sm:pl-[8%] pr-3 sm:pr-8 text-white shadow-lg gap-2 sm:gap-4`}
                  >
                    {/* Pattern nền */}
                    <div className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay">
                      <Image src="/images/handbook/pattern1.png" alt="" fill className="object-cover" />
                    </div>

                    {/* Ribbon góc phải */}
                    <div className="absolute top-0 right-0 h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 overflow-hidden pointer-events-none z-20">
                      <div
                        className={`absolute top-[12px] -right-[26px] sm:top-[16px] sm:-right-[30px] md:top-[18px] md:-right-[32px] w-[100px] sm:w-[120px] md:w-[130px] rotate-45 ${item.ribbonBg} border-y sm:border-y-2 border-white/90 py-0.5 text-center text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-wider shadow-md`}
                      >
                        {item.statusText}
                      </div>
                    </div>

                    {/* Nội dung chặng */}
                    <div className="relative z-10 space-y-0.5 sm:space-y-1 pr-14 sm:pr-0">
                      <p className="text-[10px] sm:text-xs text-white/90">{item.subTitle}</p>
                      <h3 className="text-sm sm:text-lg md:text-2xl font-black uppercase leading-tight">{item.title}</h3>
                      <p className="text-[10px] sm:text-xs text-white/95">
                        Thời gian: <span className="font-bold">{item.time}</span>
                      </p>
                    </div>

                    {/* Nút thao tác */}
                    {item.buttonText && (
                      <div className="relative z-10 shrink-0 w-full sm:w-auto sm:ml-4 sm:mr-4 md:mr-6 flex items-center justify-end sm:justify-start">
                        <button
                          type="button"
                          disabled={item.isButtonDisabled || isUploading}
                          onClick={() => handleOpenUpload(item)}
                          className={`w-full sm:w-auto rounded-md sm:rounded-none px-3 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm font-extrabold uppercase shadow-md transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                            item.status === 'tu_choi'
                              ? 'bg-[#ef4444] hover:bg-[#dc2626]'
                              : item.status === 'da_gui'
                              ? 'bg-amber-500/80 cursor-not-allowed'
                              : 'bg-[#ff5c98] hover:bg-[#ff4387]'
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-white" />
                              <span>ĐANG TẢI...</span>
                            </>
                          ) : (
                            item.buttonText
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}