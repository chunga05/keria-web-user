"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import TeamName from './TeamName';

const tabsData = [
  {
    id: 'worlds',
    label: 'Worlds',
    tag: 'WORLDS',
    items: [
      {
        title: 'QUÁN QUÂN',
        subtitle: 'CHUNG KẾT THẾ GIỚI 2023',
        description: 'Vượt qua một năm đầy biến động nhiều khó khăn, Keria lần đầu tiên nâng cao chiếc cúp World danh giá ngay tại sân nhà, khởi đầu cho một hành trình rực rỡ chinh phục Summoner đỉnh cao của Quái Vật Thiên Tài.',
        image: '/images/thanh-tich/worlds2023_v2.jpg',
        layout: 'center'
      },
      {
        title: 'QUÁN QUÂN',
        subtitle: 'CHUNG KẾT THẾ GIỚI 2024',
        description: 'Tỏa sáng bằng những màn trình diễn cá nhân xuất chúng, Keria một lần nữa khắc ghi tên mình lên chiếc cúp cao quý nhất, thành công bảo vệ ngôi vương vô địch và chính thức từ "Thiên Tài" bước chân vào con đường trở thành "Huyền thoại".',
        image: '/images/thanh-tich/worlds2024_v2.jpg',
        layout: 'center'
      },
      {
        title: 'QUÁN QUÂN',
        subtitle: 'CHUNG KẾT THẾ GIỚI 2025',
        description: 'Keria viết lên trang sử huy hoàng với thành tích vô tiền khoáng hậu - Vô địch thế giới ba lần liên tiếp, khẳng định vị thế không gì lay chuyển được của người chơi vị trí Hỗ trợ xuất sắc nhất thế giới.',
        image: '/images/thanh-tich/worlds2025_v2.jpg',
        layout: 'center'
      }
    ]
  },
  {
    id: 'asiad',
    label: 'ASIAD',
    tag: 'ASIAD',
    items: [
      {
        title: 'HUY CHƯƠNG VÀNG',
        subtitle: 'THỂ THAO ĐIỆN TỬ LMHT 2022',
        description: 'Khoác lên mình màu cờ sắc áo tổ quốc, tuyển thủ M.S.Ryu đã trở thành tấm khiên vững chãi nhất, cùng đội tuyển quốc gia Hàn Quốc giành lấy chiếc huy chương vàng Á Vận Hội danh giá làm rạng danh nước nhà.',
        image: '/images/thanh-tich/asiad.jpg',
        layout: 'side'
      }
    ]
  },
  {
    id: 'lck',
    label: 'LCK',
    tag: 'LCK',
    items: [
      {
        title: 'QUÁN QUÂN',
        subtitle: 'LCK MÙA XUÂN 2022',
        description: 'Keria cùng ZOFGK thiết lập kỷ lục giành chuỗi 18 trận toàn thắng tại giải đấu Quốc nội Mùa Xuân 2022, trở thành đội đầu tiên trong lịch sử vô địch LCK với thành tích bất bại toàn vòng bảng.',
        image: '/images/thanh-tich/8dd48a408a4b915c0d659a40795fed5deb219377.jpg',
        layout: 'center'
      },
      {
        title: 'ALL-LCK TEAM',
        subtitle: '10/11 LẦN CÓ MẶT KỂ TỪ KHI DEBUT (2020 - 2026~)\n• 6 lần All LCK First Team\n• 3 lần All LCK Second Team\n• 1 lần All LCK Third Team',
        description: 'Keria là tuyển thủ Hỗ trợ duy nhất trong lịch sử LCK HAI lần sở hữu 100% phiếu bầu cho All LCK First Team (Mùa xuân 2022 - Mùa xuân 2023).',
        image: '/images/thanh-tich/lck_all_team.jpg',
        layout: 'center',
        objectFit: 'contain'
      }
    ]
  },
  {
    id: 'soty',
    label: 'SOTY',
    subLabel: '(Support of the Year)',
    tag: 'SOTY',
    items: [
      {
        title: 'SUPPORT OF THE YEAR',
        subtitle: '05 NĂM LIÊN TIẾP (2021 - 2022 - 2023 - 2024 - 2025)',
        description: 'Từ khi LCK Awards lần đầu trao hạng mục "Support of the Year" vào năm 2021, danh hiệu này chưa từng thuộc về bất kỳ ai ngoài tuyển thủ Keria. Em ấy vẫn tiếp tục nối dài kỷ lục không tưởng này trong suốt 5 năm liên tiếp.',
        image: '/images/thanh-tich/soty.jpg',
        layout: 'center',
        objectFit: 'contain'
      }
    ]
  },
  {
    id: 'other',
    label: 'Danh hiệu',
    subLabel: 'khác',
    tag: 'KHÁC',
    items: [
      {
        title: 'VÔ ĐỊCH',
        subtitle: 'EWC 2024',
        description: 'Đánh dấu kỳ Esports World Cup (EWC) lần đầu được tổ chức, Keria cùng đồng đội vượt qua thể thức thi đấu mới mẻ và đầy thử thách để ghi tên mình vào lịch sử những nhà vô địch đầu tiên của giải đấu.',
        image: '/images/thanh-tich/ewc.jpg',
        layout: 'side',
        objectFit: 'contain'
      },
      {
        title: 'VÔ ĐỊCH',
        subtitle: 'KESPA CUP 2025',
        description: 'Khép lại một năm thi đấu thành công rực rỡ bằng chức vô địch KeSPA Cup 2025, Keria hoàn thiện bộ sưu tập danh hiệu của mình với thêm một chiếc cúp trên đấu trường Hàn Quốc.',
        image: '/images/thanh-tich/kespa.jpg',
        layout: 'center'
      }
    ]
  }
];

export default function AchievementsInfo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeItemIdx, setActiveItemIdx] = useState(0);

  const activeData = tabsData[activeIdx];
  const activeItem = activeData.items[activeItemIdx];

  const handleTabChange = (index: number) => {
    setActiveIdx(index);
    setActiveItemIdx(0);
  };

  const handleNext = () => {
    setActiveItemIdx((prev) => (prev + 1) % activeData.items.length);
  };

  const handlePrev = () => {
    setActiveItemIdx((prev) => (prev - 1 + activeData.items.length) % activeData.items.length);
  };

  return (
    <section className="w-full bg-[#f4f5f6] pt-12 pb-24 px-4 md:px-8 flex justify-center relative z-20">
      <div className="max-w-[1000px] w-full mt-10">
        {/* Tabs Container */}
        <div className="w-full overflow-x-auto overflow-y-hidden pb-4 -mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x">
          <div className="flex items-end pl-0 pt-8 relative z-10 w-full min-w-[500px] md:min-w-0 px-2 md:px-0">
            {tabsData.map((tab, index) => {
              const isActive = index === activeIdx;
              const isLast = index === tabsData.length - 1;
              
              const imgSrc = isActive ? '/images/thanh-tich/tabs/tab-active.png?v=2' : '/images/thanh-tich/tabs/tab-inactive.png?v=2';
              
              const transformY = isActive ? 'translate-y-[0px] md:translate-y-[5px]' : 'translate-y-[15px] md:translate-y-[25px]';

              const paddingX = isActive
                ? 'pl-[8%] sm:pl-[8%] md:pl-[12%] pr-2'
                : 'pl-[8%] sm:pl-[8%] md:pl-[12%] pr-2';
              const paddingB = isActive ? 'pt-[8px] pb-0 md:pt-0 md:pb-[10px]' : 'pb-[12px] md:pb-[20px]';

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(index)}
                  className={`
                    relative flex flex-col justify-end items-center flex-1 min-w-0
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
                    className={`absolute inset-0 flex flex-col items-start text-left justify-center w-full ${paddingX} ${paddingB} ${
                      isActive ? 'text-white' : 'text-[#0f4a96]'
                    }`}
                  >
                    <span className="text-[9.5px] sm:text-[11px] md:text-[15px] leading-[1.1] text-left">
                      {tab.id === 'other' ? (
                        <>
                          <span className="sm:hidden block">Danh<br />hiệu khác</span>
                          <span className="hidden sm:block whitespace-nowrap">Danh hiệu khác</span>
                        </>
                      ) : (
                        <span className="whitespace-nowrap">{tab.label}</span>
                      )}
                    </span>

                    {tab.subLabel && tab.id !== 'other' && (
                      <span className={`
                        text-[7px] sm:text-[8px] md:text-[10.5px] font-semibold opacity-90 mt-[1px]
                        leading-[1.1] text-left md:whitespace-nowrap
                      `}>
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

        {/* White Paper sticking out */}
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
        
        {/* Content Box */}
        <div className="bg-[#1877f2] rounded-3xl p-6 md:p-12 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] relative overflow-hidden z-30 -mt-[20px] md:-mt-[38px]">
          
          <div className="flex flex-col items-center text-center relative z-10 w-full min-h-[500px] justify-start pt-16 pb-8">
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${activeData.id}-${activeItemIdx}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center"
              >
                {/* Doodle overlays */}
                <div className="absolute top-[8%] right-[8%] w-12 md:w-20 z-40 rotate-12 pointer-events-none">
                  <Image src="/images/thanh-tich/crown (2).png" alt="Crown" width={80} height={80} className="w-full h-auto drop-shadow-md" />
                </div>
                <div className="absolute bottom-[10%] left-[3%] w-10 md:w-16 z-10 -rotate-12 pointer-events-none">
                  <Image src="/images/thanh-tich/star (5).png" alt="Star" width={64} height={64} className="w-full h-auto drop-shadow-md" />
                </div>

                <div className="w-full flex flex-col items-center px-4 md:px-0 mt-4 md:mt-8 relative z-20">
                  {activeItem.layout === 'center' ? (
                    <>
                      <div className="w-full max-w-[700px] bg-white p-3 md:p-4 shadow-xl relative mb-8 z-20">
                        <div className="aspect-square md:aspect-[16/9] w-full relative bg-[#0f172a] overflow-hidden">
                          <Image 
                            src={activeItem.image} 
                            alt={activeItem.title}
                            fill
                            quality={100}
                            unoptimized
                            // @ts-ignore
                            className={activeItem.objectFit === 'contain' ? 'object-contain' : 'object-cover'}
                          />
                        </div>
                        {/* Tag (Pink box) */}
                        <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 -rotate-[4deg] z-40">
                          <div className="bg-[#ff5a9a] text-white font-black text-xl md:text-3xl italic px-6 py-2 md:px-8 md:py-3 shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
                            {activeData.tag}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-[#1e293b] text-white px-8 py-5 w-[90%] max-w-[550px] shadow-xl -mt-16 z-30 relative mb-8 flex flex-col items-center justify-center">
                        <h3 className="text-xl md:text-3xl font-black mb-1 text-center whitespace-pre-line">{activeItem.title}</h3>
                        <h4 className="text-base md:text-xl font-bold text-gray-200 text-center whitespace-pre-line">{activeItem.subtitle}</h4>
                      </div>

                      <p className="text-white text-sm md:text-lg max-w-[800px] mt-2 font-medium px-4 md:px-12 leading-relaxed min-h-[80px] relative z-50">
                        <TeamName text={activeItem.description} />
                      </p>
                    </>
                  ) : (
                    <div className="w-full max-w-[850px] flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 text-left z-20">
                      <div className="w-full md:w-1/2 bg-white p-3 md:p-4 shadow-xl relative mb-4 md:mb-0">
                        <div className="aspect-square w-full relative bg-[#0f172a] overflow-hidden">
                          <Image 
                            src={activeItem.image} 
                            alt={activeItem.title}
                            fill
                            quality={100}
                            unoptimized
                            // @ts-ignore
                            className={activeItem.objectFit === 'contain' ? 'object-contain' : 'object-cover'}
                          />
                        </div>
                        {/* Tag (Pink box) */}
                        <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 -rotate-[4deg] z-40">
                          <div className="bg-[#ff5a9a] text-white font-black text-xl md:text-3xl italic px-6 py-2 md:px-8 md:py-3 shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
                            {activeData.tag}
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start pt-2">
                        <div className="bg-[#1e293b] text-white px-6 py-4 shadow-xl mb-6 w-full text-center md:text-left">
                          <h3 className="text-xl md:text-3xl font-black mb-1 whitespace-pre-line">{activeItem.title}</h3>
                          <h4 className="text-sm md:text-lg font-bold text-gray-200 whitespace-pre-line">{activeItem.subtitle}</h4>
                        </div>
                        <p className="text-white text-sm md:text-lg font-medium leading-relaxed text-center md:text-left relative z-50">
                          <TeamName text={activeItem.description} />
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation Arrows (Only show if there are multiple items) */}
          {activeData.items.length > 1 && (
            <>
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

              {/* Dots indicator for items */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-40">
                {activeData.items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveItemIdx(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === activeItemIdx ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
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
