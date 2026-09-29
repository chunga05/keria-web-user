'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AnimatedHandbookProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  turnIndex: number;
  setTurnIndex: (val: number) => void;
  maxTurnIndex: number;
  isLoading: boolean;
  passportInfo: any;
  leftProject: any;
  rightProject: any;
  leftIdx: number;
  rightIdx: number;
  handlePrev: (e: React.MouseEvent) => void;
  handleNext: (e: React.MouseEvent) => void;
}

export function AnimatedHandbook({
  isOpen,
  setIsOpen,
  turnIndex,
  setTurnIndex,
  maxTurnIndex,
  isLoading,
  passportInfo,
  leftProject,
  rightProject,
  leftIdx,
  rightIdx,
  handlePrev,
  handleNext,
}: AnimatedHandbookProps) {
  return (
    <motion.div
      className="relative z-20 w-[35%] aspect-[792/1070] [perspective:4000px]"
      animate={{
        x: isOpen ? "50%" : "0%",
        scale: isOpen ? 1.05 : 1,
        rotateX: isOpen ? 2 : 0,
        rotateY: isOpen ? -2 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 85,
        damping: 18,
        mass: 1.1,
      }}
    >
      {/* ===================================================
          A. RUỘT SỔ MỞ
          =================================================== */}
      <motion.div
        className="absolute top-0 left-[-100%] w-[200%] h-full select-none origin-center"
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
          rotateX: isOpen ? 0 : -8,
          rotateY: isOpen ? 0 : 10,
          scale: isOpen ? 1 : 0.92,
        }}
        transition={{
          type: "spring",
          stiffness: 85,
          damping: 18,
          delay: isOpen ? 0.1 : 0,
        }}
        style={{
          pointerEvents: isOpen ? "auto" : "none",
          filter: isOpen ? "drop-shadow(0 35px 60px rgba(0,0,0,0.5))" : "none",
        }}
      >
        <Image
          src="/images/handbook/openbook.png"
          alt="Open Book Inside"
          fill
          className="w-full h-full object-contain pointer-events-none"
        />

        {/* NÚT ĐÓNG SỔ */}
        <button
          onClick={() => {
            setIsOpen(false);
            setTurnIndex(0);
          }}
          className="absolute top-[4%] left-[10%] z-40 px-[1%] py-[0.5%] rounded-full bg-white/80 hover:bg-white text-[0.8vw] font-bold text-gray-700 shadow-sm transition-all"
        >
          Đóng sổ ✕
        </button>

        {/* NÚT LẬT TRANG */}
        {turnIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -left-[4%] -translate-y-1/2 z-40 w-[6%] aspect-square rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-[#0086ff] hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-[50%] h-[50%]" />
          </button>
        )}

        {turnIndex < maxTurnIndex && (
          <button
            onClick={handleNext}
            className="absolute top-1/2 -right-[4%] -translate-y-1/2 z-40 w-[6%] aspect-square rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-[#0086ff] hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight className="w-[50%] h-[50%]" />
          </button>
        )}

        {/* SỐ TRANG GÓC DƯỚI */}
        <div className="absolute bottom-[3%] left-1/2 -translate-x-1/2 z-30 px-[2%] py-[0.5%] rounded-full bg-black/40 text-white text-[0.7vw] font-bold backdrop-blur-xs">
          {turnIndex === 0
            ? "Trang bìa & Passport"
            : `Lượt trang ${turnIndex} / ${maxTurnIndex}`}
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-[4%] py-[1.5%] shadow-lg text-[0.8vw] font-bold text-gray-600">
              Đang mở sổ tay...
            </div>
          </div>
        )}

        {/* LƯỢT 0: PASSPORT */}
        {turnIndex === 0 && (
          <>
            {/* TRANG TRÁI */}
            <div className="absolute top-[8%] left-[13%] w-[35%] h-[88%] rounded-[14px] overflow-hidden drop-shadow-sm pointer-events-none z-10">
              <Image src="/images/handbook/page1.png" alt="Page 1" fill className="w-full h-full object-contain" />
              <div className="absolute top-[40%] left-[12%] w-[76%] aspect-[430/190]">
                <Image src="/images/handbook/title.png" alt="Title" fill className="w-full h-full object-contain drop-shadow" />
              </div>
            </div>

            {/* TRANG PHẢI (Thông tin User) */}
            <div className="absolute top-[8%] right-[13.3%] w-[35%] h-[88%] rounded-[14px] overflow-hidden drop-shadow-sm z-10 p-[6%] flex flex-col justify-between">
              <Image src="/images/handbook/page2.png" alt="Page 2" fill className="w-full h-full object-contain pointer-events-none -z-10" />
              
              <div className="relative w-full h-[54%]">
                <div className="absolute top-[15%] -left-[12%] w-[65%] aspect-[3/4] bg-white p-[3%] rounded shadow-md -rotate-5">
                  <div className="relative w-full h-full overflow-hidden rounded-[2px]">
                    <Image src="/images/handbook/anhbia.jpg" alt="Anime Character" fill className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="absolute top-[5%] left-[34%] w-[18%] aspect-square pointer-events-none z-20 rotate-6">
                  <Image src="/images/handbook/crown.png" alt="Crown" fill className="w-full h-full object-contain" />
                </div>
                <div className="absolute -top-[7%] -left-[27%] w-[30%] aspect-[1/2] pointer-events-none z-20">
                  <Image src="/images/handbook/ghim.png" alt="Clip" fill className="w-full h-full object-contain drop-shadow-sm" />
                </div>
                <div className="absolute bottom-[3%] -left-[18%] w-[17%] aspect-square pointer-events-none z-20">
                  <Image src="/images/handbook/heart.png" alt="Heart" fill className="w-full h-full object-contain drop-shadow-sm" />
                </div>
                <div className="absolute top-[15%] right-[-29%] w-[22%] aspect-square pointer-events-none z-20 rotate-12 drop-shadow-sm">
                  <Image src="/images/handbook/vientrang.png" alt="Border" fill className="w-full h-full object-contain" />
                </div>
                <div className="absolute top-[34%] right-[-10%] w-[65%] flex flex-col items-start gap-[2%] z-10">
                  <div className="relative w-full aspect-[260/100]">
                    <Image src="/images/handbook/smalltitle.png" alt="KERIA" fill className="w-full h-full object-contain" />
                  </div>
                  <div className="relative z-10 left-[7%] -mt-[14%] ml-[1%] w-[85%] aspect-[240/60] drop-shadow-sm">
                    <Image src="/images/handbook/pawport.png" alt="PAWPORT" fill className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="absolute bottom-[-5%] right-[1%] w-[45%] aspect-square pointer-events-none z-20">
                  <Image src="/images/handbook/arrow.png" alt="Arrow" fill className="w-full h-full object-contain drop-shadow-sm" />
                </div>
              </div>

              {/* THÔNG TIN */}
              <div className="absolute left-[13%] bottom-[17%] w-[75%] flex flex-col gap-[6%] px-[2%] pb-[2%]">
                <div className="flex flex-col">
                  <span className="text-[0.8vw] text-gray-700 tracking-tight">Tên/Nickname</span>
                  <div className="w-full bg-white/80 rounded px-[4%] py-[2%] text-[1vw] font-semibold text-gray-800 shadow-sm border border-black/5 flex items-center truncate">
                    {passportInfo?.nickname}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.8vw] text-gray-700 tracking-tight">Ngày khởi hành</span>
                  <div className="w-full bg-white/80 rounded px-[4%] py-[2%] text-[1vw] font-semibold text-gray-800 shadow-sm border border-black/5 flex items-center truncate">
                    {passportInfo?.departureDate}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.8vw] text-gray-700 tracking-tight">Địa bàn hoạt động</span>
                  <div className="w-full bg-white/80 rounded px-[4%] py-[2%] text-[1vw] font-semibold text-gray-800 shadow-sm border border-black/5 flex items-center truncate">
                    {passportInfo?.location}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* LƯỢT > 0: TRANG DỰ ÁN */}
        {turnIndex > 0 && (
          <>
            {/* TRANG TRÁI */}
            <div className="absolute top-[8%] left-[13%] w-[35%] h-[88%] rounded-[14px] overflow-hidden drop-shadow-sm z-10 p-[6%] flex flex-col justify-between">
              <Image src="/images/handbook/page3.png" alt="Left Page" fill className="w-full h-full object-contain pointer-events-none -z-10" />
              <div className="relative z-10 text-center border-b border-pink-300/60 pb-[2%] mt-[15%]">
                <span className="text-[0.8vw] font-black uppercase tracking-wider text-[#ff5596]">
                  {leftProject ? `DỰ ÁN: ${leftProject.title}` : 'TRANG CÒN TRỐNG'}
                </span>
                <p className="text-[0.65vw] text-gray-400 font-semibold mt-[2%]">Trang {leftIdx + 1}</p>
              </div>
              
              {/* STAMPS TRÁI */}
              <div className="relative z-10 flex-1 mt-[5%] overflow-y-auto px-[2%] flex flex-col justify-start">
                {leftProject && leftProject.ownedStamps?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-y-[8%] gap-x-[4%] items-start justify-items-center">
                    {leftProject.ownedStamps.map((stamp: any) => (
                      <div key={stamp.id} className="flex flex-col items-center group cursor-pointer w-full">
                        <div className="relative w-[65%] aspect-[4/3] -rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-transform duration-300 drop-shadow-md">
                          <Image src={stamp.stamp_image_url || '/images/handbook/stamp.png'} alt={stamp.stage_name} fill sizes="15vw" className="object-contain" unoptimized={!!stamp.stamp_image_url?.startsWith('http')} />
                        </div>
                        <span className="text-[0.65vw] font-black uppercase text-gray-700 mt-[4%] tracking-tight text-center truncate w-[90%]">{stamp.stage_name}</span>
                      </div>
                    ))}
                  </div>
                ) : leftProject ? (
                  <div className="text-center py-[10%]">
                    <p className="text-[0.8vw] font-bold text-gray-400">Chưa thu thập được dấu nào</p>
                  </div>
                ) : (
                  <div className="text-center py-[10%] flex flex-col items-center justify-start">
                    <div className="w-[15%] aspect-square rounded-full border-[0.15vw] border-dashed border-pink-300 flex items-center justify-center text-pink-300 mb-[4%] font-bold text-[1.2vw]">+</div>
                    <p className="text-[0.75vw] font-bold text-pink-400 uppercase tracking-wider">Trang còn trống</p>
                  </div>
                )}
              </div>
            </div>

            {/* TRANG PHẢI */}
            <div className="absolute top-[8%] right-[13.3%] w-[35%] h-[88%] rounded-[14px] overflow-hidden drop-shadow-sm z-10 p-[6%] flex flex-col justify-between">
              <Image src="/images/handbook/page4.png" alt="Right Page" fill className="w-full h-full object-contain pointer-events-none -z-10" />
              <div className="relative z-10 text-center border-b border-blue-300/60 pb-[2%] mt-[15%]">
                <span className="text-[0.8vw] font-black uppercase tracking-wider text-[#0086ff]">
                  {rightProject ? `DỰ ÁN: ${rightProject.title}` : rightProject === null ? 'TRANG CÒN TRỐNG' : 'HOÀN THÀNH SỔ'}
                </span>
                <p className="text-[0.65vw] text-gray-400 font-semibold mt-[2%]">{rightProject === undefined ? 'KẾT THÚC' : `Trang ${rightIdx + 1}`}</p>
              </div>

              {/* STAMPS PHẢI */}
              <div className="relative z-10 flex-1 mt-[5%] overflow-y-auto px-[2%] flex flex-col justify-start">
                {rightProject && rightProject.ownedStamps?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-y-[8%] gap-x-[4%] items-start justify-items-center">
                    {rightProject.ownedStamps.map((stamp: any) => (
                      <div key={stamp.id} className="flex flex-col items-center group cursor-pointer w-full">
                        <div className="relative w-[65%] aspect-[4/3] -rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-transform duration-300 drop-shadow-md">
                          <Image src={stamp.stamp_image_url || '/images/handbook/stamp.png'} alt={stamp.stage_name} fill sizes="15vw" className="object-contain" unoptimized={!!stamp.stamp_image_url?.startsWith('http')} />
                        </div>
                        <span className="text-[0.65vw] font-black uppercase text-gray-700 mt-[4%] tracking-tight text-center truncate w-[90%]">{stamp.stage_name}</span>
                      </div>
                    ))}
                  </div>
                ) : rightProject !== null && rightProject !== undefined ? (
                  <div className="text-center py-[10%]">
                    <p className="text-[0.8vw] font-bold text-gray-400">Chưa thu thập được dấu nào</p>
                  </div>
                ) : rightProject === null ? (
                  <div className="text-center py-[10%] flex flex-col items-center justify-start">
                    <div className="w-[15%] aspect-square rounded-full border-[0.15vw] border-dashed border-[#0086ff]/40 flex items-center justify-center text-[#0086ff]/60 mb-[4%] font-bold text-[1.2vw]">+</div>
                    <p className="text-[0.75vw] font-bold text-[#0086ff]/80 uppercase tracking-wider">Trang còn trống</p>
                  </div>
                ) : (
                  <div className="text-center py-[15%] flex flex-col items-center justify-start">
                    <p className="text-[1vw] font-black text-[#0086ff] uppercase tracking-wider">Cảm ơn bạn!</p>
                    <p className="text-[0.7vw] text-gray-500 mt-[4%] w-[80%]">Cảm ơn bạn đã đồng hành cùng Keria trong mọi chặng đường.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* GÁY SỔ */}
        <div className="absolute top-[7%] left-1/2 -translate-x-1/2 w-[7.6%] h-[90%] pointer-events-none z-20">
          <Image src="/images/handbook/midgap.png" alt="Spine" fill className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
        </div>
      </motion.div>

      {/* =====================================================
          B. CÁNH BÌA TRƯỚC (Framer Motion Lật Bìa)
          ===================================================== */}
      <motion.div
        onClick={() => setIsOpen(true)}
        className="group relative z-10 w-full h-full origin-left cursor-pointer drop-shadow-[15px_25px_40px_rgba(0,0,0,0.35)]"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{
          rotateY: isOpen ? -160 : 0,
          opacity: isOpen ? 0 : 1,
        }}
        whileHover={!isOpen ? {
          rotateY: -10,
          rotateX: 2,
          scale: 1.02,
        } : {}}
        whileTap={!isOpen ? { scale: 0.98 } : {}}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 15,
        }}
      >
        <div className="absolute inset-0 z-50 rounded-[14px] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-tr from-white/0 via-white/30 to-white/0 skew-x-[-30deg] transition-transform duration-[1200ms] ease-out group-hover:translate-x-[150%]" />
        </div>

        <div className="absolute top-[33%] right-[-14%] w-[47%] aspect-[360/600] pointer-events-none z-0">
          <Image src="/images/handbook/mockhoa.png" alt="Keychain" fill className="w-full h-full object-contain" />
        </div>

        <div className="relative z-10 w-full h-full">
          <Image src="/images/handbook/handbook.png" alt="Handbook Cover" fill priority className="w-full h-full object-contain pointer-events-none" />
        </div>

        <div className="absolute top-[17%] left-[18%] w-[50%] aspect-square z-20 pointer-events-none">
          <div className="absolute inset-[15%] rounded-[16px] overflow-hidden">
            <Image src="/images/handbook/anhbia.jpg" alt="Idol Cover" fill className="w-full h-full object-cover object-top" />
          </div>
          <div className="absolute inset-0 pointer-events-none">
            <Image src="/images/handbook/khunganh.png" alt="Frame" fill className="w-full h-full object-contain" />
          </div>
          <div className="absolute top-[-30%] left-[-25%] w-[75%] aspect-[320/560] pointer-events-none z-30 -rotate-6">
            <Image src="/images/handbook/ruybang.png" alt="Ribbon" fill className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="absolute bottom-[30%] left-[20%] w-[60%] aspect-[430/190] z-20 transition-transform duration-300 ease-out group-hover:scale-105 active:scale-95">
          <Image src="/images/handbook/title.png" alt="Title" fill className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] group-hover:drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all duration-300" />
        </div>
      </motion.div>

    </motion.div>
  );
}