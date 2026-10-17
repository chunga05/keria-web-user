'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionModal({ isOpen, onClose }: InstructionModalProps) {
  // Dùng ref để track lần đầu mount — tránh animation giật khi load trang
  const hasOpenedOnce = useRef(false);
  if (isOpen) hasOpenedOnce.current = true;

  // Đóng bằng phím Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Chưa mở lần nào → không render gì (tiết kiệm tài nguyên lần đầu)
  if (!hasOpenedOnce.current) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6
        transition-all duration-200
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`
          relative z-10 w-full max-w-lg md:max-w-xl max-h-[85vh] sm:max-h-[88vh] flex flex-col rounded-[22px] sm:rounded-[28px] bg-white
          shadow-[0_20px_50px_rgba(0,0,0,0.25)]
          transition-transform duration-200
          ${isOpen ? 'scale-100' : 'scale-95'}
        `}
      >
        {/* Tag PAWPORT đè mép trên — nằm ngoài container cuộn nên KHÔNG bị cắt bởi overflow */}
        <div className="absolute -top-5 sm:-top-7 left-1/2 -translate-x-1/2 w-36 sm:w-44 md:w-48 aspect-[320/110] drop-shadow-md pointer-events-none z-20">
          <Image
            src="/images/handbook/pinkpaw.png"
            alt="PAWPORT Banner"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Nút đóng (X) góc phải */}
        <button
          onClick={onClose}
          aria-label="Đóng hướng dẫn"
          className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-30 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gray-100/80 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Header cố định */}
        <div className="pt-7 sm:pt-9 px-6 sm:px-10 pb-2 text-center shrink-0">
          <h2 className="text-sm sm:text-base md:text-xl font-black tracking-wide text-black px-4 sm:px-6">
            <span className="text-[#0091FF]">★ </span>
            HƯỚNG DẪN SỬ DỤNG SỔ TAY
            <span className="text-[#0091FF]"> ★</span>
          </h2>
        </div>

        {/* Nội dung chi tiết - cuộn mượt mà */}
        <div className="overflow-y-auto px-5 sm:px-8 md:px-10 pb-6 sm:pb-8 flex-1 space-y-3 sm:space-y-4 text-xs sm:text-sm leading-relaxed text-gray-700 font-medium">
          <p>
            Chào mừng bạn đến với Pawport – cuốn sổ tay hành trình lưu giữ mọi dấu mốc và kỷ niệm của bạn cùng DearKeriaVN! Để trải nghiệm sổ tay một cách mượt mà nhất, hãy đọc nhanh hướng dẫn bên dưới nhé:
          </p>

          <div className="bg-blue-50/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-100">
            <p className="font-bold text-gray-900 mb-2 text-xs sm:text-sm">
              Mỗi dự án/chặng sự kiện sẽ có những con dấu kỷ niệm riêng:
            </p>
            <ul className="space-y-2 sm:space-y-2.5">
              <li className="flex items-start gap-2 sm:gap-2.5">
                <span className="text-sm sm:text-base shrink-0 mt-0.5">🗳️</span>
                <span>
                  <strong className="text-gray-900">Bước 1:</strong> Tìm đúng <span className="font-bold text-[#0091FF]">[Tên chặng/Dự án]</span> bạn đã tham gia.
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-2.5">
                <span className="text-sm sm:text-base shrink-0 mt-0.5">📤</span>
                <span>
                  <strong className="text-gray-900">Bước 2:</strong> Bấm nút <span className="font-bold text-[#0091FF]">[Tải ảnh lên]</span> để gửi hình ảnh chứng tỏ bạn đã hoàn thành nhiệm vụ.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-sm sm:text-base shrink-0 mt-0.5">⌛</span>
                <span>
                  <strong className="text-gray-900">Bước 3:</strong> Chờ Ban Quản Trị duyệt dấu.
                </span>
              </li>
            </ul>
          </div>

          <div className="p-2.5 sm:p-3 bg-pink-50/70 rounded-xl border border-pink-100 text-[11px] sm:text-xs leading-normal">
            <span className="font-bold text-[#FF5A9E]">Lưu ý về Bảo mật: </span>
            Ảnh của bạn chỉ dùng để Mod đối soát và sẽ xóa hoàn toàn khỏi hệ thống ngay sau khi duyệt, hoàn toàn không lưu trữ lại dữ liệu cá nhân.
          </div>
        </div>

      </div>
    </div>
  );
}