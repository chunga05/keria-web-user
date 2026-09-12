'use client';

import { useState } from 'react';
import Image from 'next/image';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { BookOpen, Award } from 'lucide-react';
import { InstructionModal } from './instruction-modal';
import { NhanDauModal } from './nhan-dau-modal';

export default function SoTayHanhTrinhPage() {
  const [isOpen, setIsOpen] = useState(false); // State lật mở sổ
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);
  const [isNhanDauOpen, setIsNhanDauOpen] = useState(false); // State mở Modal Nhận Dấu

  // ID dự án hiện tại của trang Sổ Tay (đặt cố định 13 để nạp chặng từ Supabase)
  const currentProjectId = 13;

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-[#7CB9E8]">
      {/* KHU VỰC CHỨA NỘI DUNG */}
      <section className="relative w-full h-full flex items-center justify-center">
        
        {/* LỚP NỀN TỦ ĐỒ */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/images/locker.png"
            alt="Locker Background"
            fill
            priority
            sizes="100vw"
            className="w-full h-full object-fill"
          />
        </div>

        {/* CÁC NÚT BẤM GÓC PHẢI */}
        <div className="absolute top-[5%] right-[5%] z-30 flex items-center gap-4">
          <InteractiveHoverButton
            text="Hướng Dẫn"
            hoverText="Xem ngay"
            icon={<BookOpen className="h-4 w-4" />}
            bgColor="#0091FF"
            expandColor="#0077D4"
            onClick={() => setIsInstructionOpen(true)}
          />

          <InteractiveHoverButton
            text="Nhận Dấu"
            hoverText="Check-in"
            icon={<Award className="h-4 w-4" />}
            bgColor="#FF69B4"
            expandColor="#E0559E"
            onClick={() => setIsNhanDauOpen(true)}
          />
        </div>

        {/* CÁC ELEMENT NGÔI SAO TRANG TRÍ */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* 1. Sao xanh đậm */}
          <div className="absolute top-[7%] left-[4%] w-[13%] aspect-square">
            <Image src="/images/element/darkblue.png" alt="Dark Blue Star" fill className="object-contain" />
          </div>

          {/* 2. Sao hồng nhạt kẻ ô to */}
          <div className="absolute top-[6%] right-[-2%] w-[18%] aspect-square">
            <Image src="/images/element/lightpink.png" alt="Light Pink Star" fill className="object-contain" />
          </div>

          {/* 3. Sao xanh nhạt caro */}
          <div className="absolute bottom-[5%] -left-[0.5%] w-[19%] aspect-square">
            <Image src="/images/element/lightblue.png" alt="Light Blue Star" fill className="object-contain" />
          </div>

          {/* 4. Sao hồng sen kẻ ô */}
          <div className="absolute bottom-[1%] -left-[0.5%] w-[12%] aspect-square">
            <Image src="/images/element/pink.png" alt="Pink Star" fill className="object-contain" />
          </div>

          {/* 5. Sao xanh dương */}
          <div className="absolute bottom-[8%] right-[5%] w-[12%] aspect-square">
            <Image src="/images/element/blue.png" alt="Blue Star" fill className="object-contain" />
          </div>
        </div>

        {/* CONTAINER CUỐN SỔ */}
        <div 
          className={`relative z-20 w-[35%] aspect-[792/1070] [perspective:2500px] transition-transform duration-1000 ease-in-out ${
            isOpen ? 'translate-x-[50%]' : 'translate-x-0'
          }`}
        >

          {/* A. PHẦN RUỘT SỔ MỞ 2 TRANG (OPEN BOOK) */}
          <div 
            onClick={() => setIsOpen(false)}
            className={`absolute top-0 left-[-100%] w-[200%] h-full transition-opacity duration-700 select-none ${
              isOpen 
                ? 'opacity-100 delay-200 pointer-events-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.4)] cursor-pointer' 
                : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* 1. Nền bìa da mở + còng */}
            <Image
              src="/images/handbook/openbook.png"
              alt="Open Book Inside"
              fill
              className="w-full h-full object-contain pointer-events-none"
            />

            {/* 2. Trang 1 bên trái */}
            <div className="absolute top-[8%] left-[13%] w-[35%] h-[88%] rounded-[14px] overflow-hidden drop-shadow-sm pointer-events-none z-10">
              <Image
                src="/images/handbook/page1.png"
                alt="Page 1"
                fill
                className="w-full h-full object-contain"
              />
              <div className="absolute top-[40%] left-[12%] w-[76%] aspect-[430/190]">
                <Image
                  src="/images/handbook/title.png"
                  alt="Theo Dấu Chân Cún"
                  fill
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
            </div>

            {/* 3. Trang 2 bên phải (KERIA PAWPORT) */}
            <div className="absolute top-[8%] right-[13.3%] w-[35%] h-[88%] rounded-[14px] overflow-hidden drop-shadow-sm z-10 p-[6%] flex flex-col justify-between">
              <Image
                src="/images/handbook/page2.png"
                alt="Page 2"
                fill
                className="w-full h-full object-contain pointer-events-none -z-10"
              />

              {/* Nửa trên: Ảnh thẻ + Phụ kiện + Title Pawport */}
              <div className="relative w-full h-[54%]">
                <div className="absolute top-[15%] -left-[12%] w-[65%] aspect-[3/4] bg-white p-[3%] rounded shadow-md -rotate-5">
                  <div className="relative w-full h-full overflow-hidden rounded-[2px]">
                    <Image
                      src="/images/handbook/anhbia.jpg"
                      alt="Anime Character"
                      fill
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="absolute top-[5%] left-[34%] w-[18%] aspect-square pointer-events-none z-20 rotate-6">
                  <Image
                    src="/images/handbook/crown.png"
                    alt="Crown"
                    fill
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="absolute -top-[7%] -left-[27%] w-[30%] aspect-[1/2] pointer-events-none z-20">
                  <Image
                    src="/images/handbook/ghim.png"
                    alt="Clip Star"
                    fill
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                </div>

                <div className="absolute bottom-[3%] -left-[18%] w-[17%] aspect-square pointer-events-none z-20">
                  <Image
                    src="/images/handbook/heart.png"
                    alt="Heart sticker"
                    fill
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                </div>

                <div className="absolute top-[15%] right-[-29%] w-[22%] aspect-square pointer-events-none z-20 rotate-12 drop-shadow-sm">
                  <Image
                    src="/images/handbook/vientrang.png"
                    alt="Star White Border"
                    fill
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="absolute top-[34%] right-[-10%] w-[65%] flex flex-col items-start gap-0.5 z-10">
                  <div className="relative w-full aspect-[260/100]">
                    <Image
                      src="/images/handbook/smalltitle.png"
                      alt="KERIA"
                      fill
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="relative z-10 left-[7%] -mt-[14%] ml-1 w-[85%] aspect-[240/60] drop-shadow-sm">
                    <Image
                      src="/images/handbook/pawport.png"
                      alt="PAWPORT"
                      fill
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="absolute bottom-[-5%] right-[1%] w-[45%] aspect-square pointer-events-none z-20">
                  <Image
                    src="/images/handbook/arrow.png"
                    alt="Arrow"
                    fill
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                </div>
              </div>

              {/* Nửa dưới: Form thông tin cá nhân Passport */}
              <div className="absolute left-[13%] bottom-[17%] w-[75%] flex flex-col gap-2 px-1 pb-2">  
                <div className="flex flex-col">
                  <span className="text-[13px] text-gray-700 tracking-tight">Tên/Nickname</span>
                  <div className="w-full bg-white/80 rounded px-2 py-1 text-[16px] font-semibold text-gray-800 shadow-sm border border-black/5 font-['SVN-BeCool'] antialiased">
                    Chani
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[13px] text-gray-700 tracking-tight">Ngày khởi hành</span>
                  <div className="w-full bg-white/80 rounded px-2 py-1 text-[16px] font-semibold text-gray-800 shadow-sm border border-black/5 font-['SVN-BeCool'] antialiased">
                    14/10/2026
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[13px] text-gray-700 tracking-tight">Địa bàn hoạt động</span>
                  <div className="w-full bg-white/80 rounded px-2 py-1 text-[16px] font-semibold text-gray-800 shadow-sm border border-black/5 font-['SVN-BeCool'] antialiased">
                    Hồ Chí Minh
                  </div>
                </div>

                <div className="w-full text-center mt-1">
                  <span className="text-[8px] font-medium text-gray-400">Passport by DearKeriaVN</span>
                </div>
              </div>
            </div>

            {/* 4. DẢI DA GÁY Ở GIỮA */}
            <div className="absolute top-[7%] left-1/2 -translate-x-1/2 w-[7.6%] h-[90%] pointer-events-none z-20">
              <Image
                src="/images/handbook/midgap.png"
                alt="Mid Gap Leather Spine"
                fill
                className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              />
            </div>
          </div>

          {/* B. CÁNH BÌA TRƯỚC */}
          <div
            onClick={() => setIsOpen(true)}
            style={{ transformOrigin: 'left center' }}
            className={`relative z-10 w-full h-full transition-all duration-1000 ease-in-out [transform-style:preserve-3d] ${
              isOpen
                ? '[transform:rotateY(-180deg)] opacity-0 pointer-events-none'
                : '[transform:rotateY(0deg)] opacity-100 drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)] cursor-pointer'
            }`}
          >
            <div className="absolute top-[3%] right-[-14%] w-[47%] aspect-[360/600] pointer-events-none z-0">
              <Image
                src="/images/handbook/mockhoa.png"
                alt="Keychain"
                fill
                className="w-full h-full object-contain"
              />
            </div>

            <div className="relative z-10 w-full h-full">
              <Image
                src="/images/handbook/handbook.png"
                alt="Handbook Cover"
                fill
                priority
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>

            <div className="absolute top-[17%] left-[18%] w-[50%] aspect-square z-20 pointer-events-none">
              <div className="absolute inset-[15%] rounded-[16px] overflow-hidden">
                <Image
                  src="/images/handbook/anhbia.jpg"
                  alt="Idol Cover"
                  fill
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="absolute inset-0 pointer-events-none">
                <Image
                  src="/images/handbook/khunganh.png"
                  alt="Photo Frame"
                  fill
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="absolute top-[-30%] left-[-25%] w-[75%] aspect-[320/560] pointer-events-none z-30 -rotate-6">
                <Image
                  src="/images/handbook/ruybang.png"
                  alt="Ribbon"
                  fill
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="absolute bottom-[30%] left-[20%] w-[60%] aspect-[430/190] z-20 cursor-pointer transition-transform duration-300 ease-out hover:scale-105 active:scale-95">
              <Image
                src="/images/handbook/title.png"
                alt="Theo Dấu Chân Cún Title"
                fill
                className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] hover:drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] transition-all duration-300"
              />
            </div>
          </div>

        </div>

      </section>

      {/* MODAL HƯỚNG DẪN */}
      <InstructionModal
        isOpen={isInstructionOpen}
        onClose={() => setIsInstructionOpen(false)}
      />

      {/* MODAL NHẬN DẤU: Đã map chuẩn state và ID 13 */}
      <NhanDauModal 
        isOpen={isNhanDauOpen} 
        onClose={() => setIsNhanDauOpen(false)} 
        projectId={currentProjectId} 
      />
    </main>
  );
}