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

  // Hook quản lý dữ liệu các chặng
  const { stages, loading, error, uploadingStageId, submitStageProof } =
    useProjectStages(isOpen && activeProjectId ? Number(activeProjectId) : undefined);

  // Nạp danh sách dự án khi modal mở
  useEffect(() => {
    if (!isOpen) return;

    async function load() {
      const data = await fetchActiveProjects();
      if (data.length > 0) {
        setProjectList(data);
        setActiveProjectId((prev) => prev ?? projectId ?? data[0].id);
      }
    }

    load();
  }, [isOpen, projectId]);

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

    // Kiểm tra an toàn file qua hàm đã tách
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-[2vw]">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex flex-col w-[88vw] max-w-[1150px] max-h-[92vh] rounded-[2.2vw] bg-white px-[3.5vw] pt-[5vw] pb-[4vw] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Banner PAWPORT */}
        <div className="absolute -top-[3.2vw] left-1/2 -translate-x-1/2 w-[22vw] max-w-[280px] min-w-[180px] aspect-[320/110] drop-shadow-lg pointer-events-none">
          <Image
            src="/images/handbook/pinkpaw.png"
            alt="PAWPORT"
            fill
            sizes="(max-width: 768px) 40vw, 22vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-[1.5vw] right-[1.5vw] flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tiêu đề & Chọn dự án */}
        <h2 className="mb-2 text-center text-xl sm:text-2xl font-black tracking-wider text-black">
          <span className="text-[#0086ff]">★ </span>NHẬN DẤU<span className="text-[#0086ff]"> ★</span>
        </h2>

        <div className="mb-4 flex justify-center">
          <div className="relative">
            <select
              value={activeProjectId || ''}
              onChange={(e) => setActiveProjectId(Number(e.target.value))}
              className="appearance-none rounded-full border-2 border-[#0086ff]/30 bg-blue-50/50 px-5 py-1.5 pr-10 text-xs font-bold text-[#0077D4] hover:bg-white focus:outline-none"
            >
              {projectList.map((p) => (
                <option key={p.id} value={p.id}>
                  Dự án: {p.title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0077D4]" />
          </div>
        </div>

        {/* Trạng thái Loading / Error / Empty */}
        {loading && (
          <div className="py-12 text-center text-gray-500">
            <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-[#0086ff]" />
            <p className="text-sm">Đang tải các chặng...</p>
          </div>
        )}

        {!loading && error && (
          <div className="py-8 text-center text-red-500 text-sm font-semibold">{error}</div>
        )}

        {!loading && !error && stages.length === 0 && (
          <div className="py-8 text-center text-gray-400 text-sm">Chưa có chặng nào trong dự án này.</div>
        )}

        {/* Danh sách các chặng */}
        {!loading && !error && stages.length > 0 && (
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-2 py-2">
            {stages.map((item) => {
              const isUploading = uploadingStageId === item.id;

              return (
                <div key={item.id} className="relative flex w-full min-h-[120px] items-center">
                  {/* Con dấu */}
                  <div className="relative z-30 w-[24%] max-w-[200px] min-w-[140px] aspect-[4/3] -rotate-3 pointer-events-none">
                    <Image
                      src={item.stampImg}
                      alt={item.title}
                      fill
                      sizes="200px"
                      className="object-contain"
                      unoptimized={item.stampImg.startsWith('http')}
                    />
                  </div>

                  {/* Thẻ chặng */}
                  <div
                    className={`relative z-10 flex flex-1 -ml-[8%] sm:-ml-[6%] min-h-[110px] items-center justify-between overflow-hidden ${item.bgColor} py-4 pl-[12%] sm:pl-[10%] pr-6 sm:pr-8 text-white shadow-lg`}
                  >
                    {/* Pattern nền */}
                    <div className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay">
                      <Image src="/images/handbook/pattern1.png" alt="" fill className="object-cover" />
                    </div>

                    {/* Ribbon góc phải */}
                    <div className="absolute top-0 right-0 h-28 w-28 overflow-hidden pointer-events-none z-20">
                      <div
                        className={`absolute top-[18px] -right-[32px] w-[130px] rotate-45 ${item.ribbonBg} border-y-2 border-white/90 py-0.5 text-center text-[10px] font-black tracking-wider shadow-md`}
                      >
                        {item.statusText}
                      </div>
                    </div>

                    {/* Nội dung chặng */}
                    <div className="relative z-10 space-y-1">
                      <p className="text-xs text-white/90">{item.subTitle}</p>
                      <h3 className="text-xl sm:text-2xl font-black uppercase leading-none">{item.title}</h3>
                      <p className="text-xs text-white/95">
                        Thời gian: <span className="font-bold">{item.time}</span>
                      </p>
                    </div>

                    {/* Nút thao tác */}
                    {item.buttonText && (
                      <div className="relative z-10 shrink-0 ml-4 mr-6 flex items-center">
                        <button
                          type="button"
                          disabled={item.isButtonDisabled || isUploading}
                          onClick={() => handleOpenUpload(item)}
                          className={`rounded-none px-5 py-2 text-xs sm:text-sm font-extrabold uppercase shadow-md transition-all flex items-center gap-2 ${
                            item.status === 'tu_choi'
                              ? 'bg-[#ef4444] hover:bg-[#dc2626]'
                              : item.status === 'da_gui'
                              ? 'bg-amber-500/80 cursor-not-allowed'
                              : 'bg-[#ff5c98] hover:bg-[#ff4387]'
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
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