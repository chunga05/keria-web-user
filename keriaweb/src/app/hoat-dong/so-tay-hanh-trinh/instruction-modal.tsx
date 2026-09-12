'use client';

import Image from 'next/image';
import { X } from 'lucide-react';

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionModal({ isOpen, onClose }: InstructionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop mờ tối nhẹ */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl rounded-[28px] bg-white px-10 pt-14 pb-10 shadow-[0_20px_50px_rgba(0,0,0,0.25)] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Tag PAWPORT đè mép trên */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-48 aspect-[320/110] drop-shadow-md pointer-events-none">
          <Image
            src="/images/handbook/pinkpaw.png"
            alt="PAWPORT Banner"
            fill
            className="object-contain"
          />
        </div>

        {/* Nút đóng (X) góc phải */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tiêu đề chính */}
        <h2 className="mb-6 text-center text-xl font-bold tracking-wider text-black">
          <span className="text-[#0091FF]">★ </span>
          HƯỚNG DẪN SỬ DỤNG SỔ TAY
          <span className="text-[#0091FF]"> ★</span>
        </h2>

        {/* Nội dung chi tiết */}
        <div className="space-y-4 text-sm leading-relaxed text-gray-800 font-medium">
          <p>
            Chào mừng bạn đến với Pawport – cuốn sổ tay hành trình lưu giữ mọi dấu mốc và kỷ niệm của bạn cùng DearKeriaVN! Để trải nghiệm sổ tay một cách mượt mà nhất, hãy đọc nhanh hướng dẫn bên dưới nhé:
          </p>

          <div>
            <p className="font-semibold mb-2">
              Mỗi dự án/chặng sự kiện sẽ có những con con dấu kỷ niệm riêng:
            </p>
            <ul className="space-y-2 pl-1">
              <li className="flex items-center gap-2">
                <span>🗳️</span>
                <span>
                  <strong>Bước 1:</strong> Tìm đúng <span className="font-bold text-[#0091FF]">[Tên chặng/Dự án]</span> bạn đã tham gia.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>🗳️</span>
                <span>
                  <strong>Bước 2:</strong> Bấm nút <span className="font-bold text-[#0091FF]">[Tải ảnh lên]</span> để gửi hình ảnh chứng tỏ bạn đã hoàn thành nhiệm vụ.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>⌛</span>
                <span>
                  <strong>Bước 3:</strong> Chờ Ban Quản Trị duyệt dấu.
                </span>
              </li>
            </ul>
          </div>

          <p className="pt-2 text-xs leading-normal">
            <span className="font-bold text-[#FF5A9E]">Lưu ý về Bảo mật: </span>
            Ảnh của bạn chỉ dùng để Mod đối soát và sẽ xóa hoàn toàn khỏi hệ thống ngay sau khi duyệt, hoàn toàn không lưu trữ lại dữ liệu cá nhân.
          </p>
        </div>

      </div>
    </div>
  );
}