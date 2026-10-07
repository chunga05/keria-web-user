"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import TeamName from './TeamName';

const tabsData = [
  {
    id: 'worlds',
    label: 'Worlds',
    title: 'QUÁN QUÂN',
    subtitle: 'CHUNG KẾT THẾ GIỚI 2023',
    description: 'Vượt qua một năm đầy biến động nhiều khó khăn, Keria lần đầu tiên nâng cao chiếc cúp World danh giá ngay tại sân nhà, khởi đầu cho một hành trình rực rỡ chinh phục Summoner đỉnh cao của Quái Vật Thiên Tài.',
    tag: 'WORLDS'
  },
  {
    id: 'asiad',
    label: 'ASIAD',
    title: 'HUY CHƯƠNG VÀNG',
    subtitle: 'ASIAD 19 HÀNG CHÂU',
    description: 'Cùng đội tuyển quốc gia Hàn Quốc, Keria đã xuất sắc giành tấm huy chương vàng danh giá tại Á vận hội Hàng Châu.',
    tag: 'ASIAD'
  },
  {
    id: 'lck',
    label: 'LCK',
    title: 'VÔ ĐỊCH',
    subtitle: 'LCK MÙA XUÂN 2022',
    description: 'Thành tích vô địch LCK với kỷ lục bất bại 18-0 cùng tập thể T1, đồng thời đạt vô số danh hiệu trong nước khác.',
    tag: 'LCK'
  },
  {
    id: 'soty',
    label: 'SOTY',
    subLabel: '(Support of the Year)',
    title: 'SUPPORT OF THE YEAR',
    subtitle: 'LCK AWARDS',
    description: 'Nhiều năm liền được vinh danh là Hỗ trợ xuất sắc nhất năm của LCK, khẳng định vị thế số một ở vai trò của mình.',
    tag: 'SOTY'
  },
  {
    id: 'other',
    label: 'Danh hiệu',
    subLabel: 'khác',
    title: 'CÁC DANH HIỆU KHÁC',
    subtitle: 'MVP, ALL-PRO TEAMS...',
    description: 'Thường xuyên góp mặt trong Đội hình tiêu biểu của LCK các mùa giải, giành MVP và nhiều giải thưởng cá nhân danh giá khác.',
    tag: 'KHÁC'
  }
];

export default function AchievementsInfo() {
  const [activeIdx, setActiveIdx] = useState(0);

  const activeData = tabsData[activeIdx];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % tabsData.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + tabsData.length) % tabsData.length);
  };

  return (
    <section className="w-full bg-[#f4f5f6] pt-12 pb-24 px-4 md:px-8 flex justify-center relative z-20">
      <div className="max-w-[1000px] w-full mt-10">
        {/* Tabs Container */}
        <div className="w-full overflow-x-auto pb-4 -mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x">
          <div className="flex items-end pl-0 pt-8 relative z-10 w-full min-w-[500px] md:min-w-0 px-2 md:px-0">
            {tabsData.map((tab, index) => {
              const isActive = index === activeIdx;
              const isLast = index === tabsData.length - 1;
              
              // Chỉ tab được chọn mới dùng hình xanh đậm, các tab khác dùng hình gốc
              const imgSrc = isActive ? '/images/thanh-tich/tabs/tab-active.png?v=2' : '/images/thanh-tich/tabs/tab-inactive.png?v=2';
              
              // Tab đang chọn sẽ nhô cao lên, các tab khác nằm thấp hơn (Không dùng z-index)
              const transformY = isActive ? 'translate-y-[0px] md:translate-y-[5px]' : 'translate-y-[15px] md:translate-y-[25px]';

              // Push text left because the "tall" part of the tab is on the left
              const paddingX = isActive
              ? 'pl-0 pr-12 sm:pr-16 md:pl-0 md:pr-35'
              : 'pl-0 pr-12 sm:pr-16 md:pl-0 md:pr-32';
              // Slight push up to center in the visible area above the white paper
              const paddingB = isActive ? 'pb-[10px] md:pb-[15px]' : 'pb-[15px] md:pb-[25px]';

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveIdx(index)}
                  className={`
                    relative flex flex-col justify-end items-center flex-1
                    transition-all duration-300 ease-out origin-bottom font-bold
                    select-none group ${isLast ? '' : '-mr-6 sm:-mr-10 md:-mr-[90px]'}
                    ${transformY}
                  `}
                >
                  <div className="relative w-full h-auto">
                  <img
                    src={imgSrc}
                    alt="tab shape"
                    className="w-full h-auto block"
                  />

                  {isActive && (
                    <div className="absolute left-0 right-0 top-[85%] bottom-[-25px] bg-[#1877f2]" />
                  )}

                  {!isActive && (
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}

                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center w-full ${paddingX} ${paddingB} ${
                      isActive ? 'text-white' : 'text-[#0f4a96]'
                    }`}
                  >
                    <span className="text-[11px] sm:text-[12px] md:text-[15px] whitespace-nowrap">
                      {tab.label}
                    </span>

                    {tab.subLabel && (
                      <span className="text-[8px] sm:text-[9px] md:text-[10.5px] font-semibold leading-tight mt-0.5 opacity-90 whitespace-nowrap">
                        {tab.subLabel}
                      </span>
                    )}
                  </div>
                </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* White Paper sticking out - uses slight negative margin just to guarantee no 1px gaps */}
<div
  className="
    w-[98%] mx-auto
    bg-white
    h-[20px] md:h-[60px]
    rounded-t-[20px] md:rounded-t-[30px]
    relative z-20
    shadow-[0_-10px_20px_rgba(0,0,0,0.05)]
    -mt-[20px] md:-mt-[43px]
  "
/>
        {/* Content Box - pulled up to seamlessly connect with the white paper */}
        <div className="bg-[#1877f2] rounded-3xl p-6 md:p-12 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] relative overflow-hidden z-30 -mt-[20px] md:-mt-[38px]">
          
          {/* Main content layout */}
          <div className="flex flex-col items-center text-center relative z-10 w-full min-h-[500px] justify-center">
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeData.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center"
              >
                {/* Tag (Pink box) */}
                <div className="absolute top-0 left-[5%] md:left-[15%] -translate-y-2 md:-translate-y-8 -rotate-[4deg] z-40">
                  <div className="bg-[#ff5a9a] text-white font-black text-2xl md:text-4xl italic px-8 py-3 shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
                    {activeData.tag}
                  </div>
                </div>

                {/* Doodle overlays */}
                <div className="absolute top-[8%] right-[8%] w-12 md:w-20 z-40 rotate-12 pointer-events-none">
                  <Image src="/images/thanh-tich/crown (2).png" alt="Crown" width={80} height={80} className="w-full h-auto drop-shadow-md" />
                </div>
                <div className="absolute bottom-[35%] left-[3%] w-10 md:w-16 z-40 -rotate-12 pointer-events-none">
                  <Image src="/images/thanh-tich/star (5).png" alt="Star" width={64} height={64} className="w-full h-auto drop-shadow-md" />
                </div>

                {/* Image Container with white border */}
                <div className="w-full max-w-[700px] bg-white p-3 md:p-4 shadow-xl relative mt-10 md:mt-12 mb-8 z-20">
                  <div className="aspect-[16/9] w-full relative bg-[#0f172a] overflow-hidden">
                    <Image 
                      src="/images/thanh-tich/8dd48a408a4b915c0d659a40795fed5deb219377.jpg" 
                      alt={activeData.title}
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xl font-bold">
                      Hình ảnh {activeData.label}
                    </div>
                  </div>
                </div>
                
                {/* Dark Blue Title Box */}
                <div className="bg-[#1e293b] text-white px-8 py-5 w-[90%] max-w-[550px] shadow-xl -mt-16 z-30 relative mb-8 flex flex-col items-center justify-center">
                  <h3 className="text-xl md:text-3xl font-black mb-1 text-center">{activeData.title}</h3>
                  <h4 className="text-base md:text-xl font-bold text-gray-200 text-center">{activeData.subtitle}</h4>
                </div>

                {/* Description Text */}
                <p className="text-white text-sm md:text-lg max-w-[800px] mt-2 font-medium px-4 md:px-12 leading-relaxed min-h-[80px]">
                  <TeamName text={activeData.description} />
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={handlePrev}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-[#3b82f6] text-white flex items-center justify-center hover:bg-[#2563eb] transition-colors z-40 rounded shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-[#ff5a9a] text-white flex items-center justify-center hover:bg-[#ec4899] transition-colors z-40 rounded shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

        </div>
      </div>

      {/* Vách ngăn giấy rách đáy cho phần info */}
      <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none translate-y-1/2">
        <Image
          src="/images/thanh-tich/Vector 1.png"
          alt="Vách ngăn giấy rách"
          width={1920}
          height={80}
          sizes="100vw"
          className="w-full h-auto block select-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.06)]"
        />
      </div>
    </section>
  );
}
