"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TeamName from "./TeamName";

type Milestone = {
  year: number;
  x: number;
  y: number;
  color: string;
  layout: "top-bottom" | "bottom-top" | "left" | "right";
  title?: string;
  subtitles?: string[];
  achievements: string[];
  awards: string[];
  personal: string[];
};

const MILESTONES: Milestone[] = [
  {
    year: 2017,
    x: 800,
    y: 100,
    color: "#0084FF",
    layout: "top-bottom",
    title: "Vô địch KeG President's Cup",
    subtitles: ["(phòng PC Doksan-dong)"],
    achievements: ["Vô địch KeG President's Cup"],
    awards: [],
    personal: [],
  },
  {
    year: 2018,
    x: 100,
    y: 200,
    color: "#0084FF",
    layout: "left",
    title: "",
    subtitles: [
      "- Gia nhập KeG Gyeongsang/Gyeonggi (19/08)",
      "- Rời KeG Gyeongsang/Gyeonggi (22/11)",
    ],
    achievements: [],
    awards: [],
    personal: ["Gia nhập KeG Gyeongsang/Gyeonggi"],
  },
  {
    year: 2019,
    x: 500,
    y: 300,
    color: "#0084FF",
    layout: "bottom-top",
    title: "",
    subtitles: [
      "- Gia nhập DRX Academy (10/2019)",
      "- Hỗ trợ (Support) cho Kiwoom DRX (12/2019)",
    ],
    achievements: [],
    awards: [],
    personal: ["Gia nhập DRX Academy"],
  },
  {
    year: 2020,
    x: 900,
    y: 400,
    color: "#0084FF",
    layout: "right",
    title: "",
    subtitles: ["- Rời DRX (11/2020)"],
    achievements: [
      "Bán kết KeSPA Cup",
      "Hạng 3 LCK Mùa Xuân",
      "Á quân LCK Mùa Hè",
      "Tứ kết CKTG",
    ],
    awards: [
      "LCK Award: Support Of The Year",
      "All LCK First Team (Spring)",
      "All LCK First Team (Summer)",
    ],
    personal: ["1000 điểm POG (LCK Xuân)", "800 điểm POG (LCK Hè)"],
  },
  {
    year: 2021,
    x: 500,
    y: 500,
    color: "#0084FF",
    layout: "bottom-top",
    title: "",
    subtitles: [],
    achievements: ["Bán kết CKTG 2021", "Á quân LCK Mùa Hè 2021"],
    awards: ["All LCK Second Team (Spring)", "All LCK First Team (Summer)"],
    personal: ["Gia nhập T1"],
  },
  {
    year: 2022,
    x: 100,
    y: 600,
    color: "#0084FF",
    layout: "left",
    title: "",
    subtitles: [],
    achievements: ["Vô địch LCK Mùa Xuân 2022 (Bất bại 18-0)", "Á quân CKTG 2022"],
    awards: ["LCK Spring MVP", "All LCK First Team (Spring)"],
    personal: ["Kỷ lục hỗ trợ có nhiều mạng hỗ trợ nhất vòng bảng LCK"],
  },
  {
    year: 2023,
    x: 500,
    y: 700,
    color: "#0084FF",
    layout: "bottom-top",
    title: "",
    subtitles: [],
    achievements: ["Vô địch CKTG 2023", "Huy chương vàng ASIAD 19"],
    awards: ["SOTY", "All LCK First Team"],
    personal: ["Nâng cúp vô địch thế giới tại sân nhà"],
  },
  {
    year: 2024,
    x: 900,
    y: 800,
    color: "#FF61B6",
    layout: "right",
    title: "",
    subtitles: [],
    achievements: ["Vô địch EWC 2024"],
    awards: [],
    personal: [],
  },
  {
    year: 2025,
    x: 500,
    y: 900,
    color: "#FF61B6",
    layout: "bottom-top",
    title: "",
    subtitles: [],
    achievements: ["Vô địch LCK (Dự kiến)"],
    awards: [],
    personal: [],
  },
  {
    year: 2026,
    x: 100,
    y: 1000,
    color: "#FF61B6",
    layout: "left",
    title: "",
    subtitles: [],
    achievements: ["Kỷ lục mới"],
    awards: [],
    personal: [],
  },
];

// Vệt sáng chạy dọc từ đầu đến cuối
const RUN_DURATION = 12;

export default function TimelineAchievements() {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const len = pathRef.current?.getTotalLength();
    if (len) setPathLength(len);
  }, []);

  const solidPath = `
    M 800 100
    L 200 100
    A 100 100 0 0 0 100 200
    A 100 100 0 0 0 200 300
    L 800 300
    A 100 100 0 0 1 900 400
    A 100 100 0 0 1 800 500
    L 200 500
    A 100 100 0 0 0 100 600
    A 100 100 0 0 0 200 700
    L 800 700
    A 100 100 0 0 1 900 800
    A 100 100 0 0 1 800 900
    L 200 900
    A 100 100 0 0 0 100 1000
    A 100 100 0 0 0 200 1100
    L 500 1100
  `;

  const dottedPath = `
    M 500 1100
    L 1000 1100
  `;

  const fullSvgPath = `${solidPath} L 1000 1100`;

  return (
    <section className="w-full bg-[#FAFAFA] py-20 px-4 md:px-8 flex flex-col items-center relative z-10 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-black text-[#102652] mb-4">HÀNH TRÌNH CỦA KERIA</h2>
        <p className="text-gray-500 font-medium">Nhấn hoặc di chuột vào các mốc thời gian để xem chi tiết</p>
      </motion.div>

      <style>{`
        .timeline-runner {
          filter: drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 12px #0084FF);
          animation: timeline-run ${RUN_DURATION}s linear infinite;
        }
        @keyframes timeline-run {
          from { stroke-dashoffset: var(--run-from); }
          to { stroke-dashoffset: var(--run-to); }
        }
        @media (prefers-reduced-motion: reduce) {
          .timeline-runner { animation: none; opacity: 0; }
        }
      `}</style>

      {/* Mobile/Tablet Vertical Timeline (Dạng cột thẳng có phân nhánh) */}
      <div className="lg:hidden w-full relative px-2 py-8 overflow-hidden">
        {/* Main Vertical Line */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute left-[41px] top-12 bottom-12 w-1 rounded-full bg-gradient-to-b from-[#0084FF] to-[#FF61B6]"
        ></motion.div>

        <div className="flex flex-col gap-10">
          {MILESTONES.map((m, index) => (
            <motion.div 
              key={m.year} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="relative pl-[80px] pr-2 w-full"
            >
              {/* Branch Line (Phân nhánh) */}
              <div 
                className="absolute left-[44px] top-[34px] w-[30px] h-1 rounded-r-full"
                style={{ backgroundColor: m.color }}
              />

              {/* Dot */}
              <div 
                className="absolute left-[31px] top-6 w-6 h-6 rounded-full bg-white border-[5px] shadow-[0_0_10px_rgba(0,0,0,0.15)] z-10"
                style={{ borderColor: m.color }}
              />
              
              {/* Card Container */}
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-5 relative">
                {/* Year Badge */}
                <div 
                  className="absolute -top-4 -left-2 px-3 py-1 bg-white rounded-lg border-2 font-black text-lg shadow-sm"
                  style={{ borderColor: m.color, color: m.color }}
                >
                  {m.year}
                </div>

                {/* Subtitles (Static Info) */}
                <div className="text-sm text-gray-700 font-medium mt-3 mb-2">
                  {m.title && <div className="font-bold text-pink-500 mb-1"><TeamName text={m.title} /></div>}
                  {m.subtitles?.map((s, i) => (
                    <div key={i} className="mb-1"><TeamName text={s} /></div>
                  ))}
                </div>

                {/* Detailed Cards (Expanded for mobile) */}
                {(m.achievements.length > 0 || m.awards.length > 0 || m.personal.length > 0) && (
                  <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                    {m.achievements.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-1.5 text-[#0084FF] font-black text-[13px] mb-1.5 uppercase">
                          <span className="text-base">👑</span> THÀNH TÍCH
                        </div>
                        <ul className="text-gray-700 text-[13px] leading-relaxed space-y-1">
                          {m.achievements.map((item, idx) => (
                            <li key={idx}>• <TeamName text={item} /></li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {m.awards.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-1.5 text-[#F59E0B] font-black text-[13px] mb-1.5 uppercase">
                          <span className="text-base">🏆</span> GIẢI THƯỞNG
                        </div>
                        <ul className="text-gray-700 text-[13px] leading-relaxed space-y-1">
                          {m.awards.map((item, idx) => (
                            <li key={idx}>• <TeamName text={item} /></li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {m.personal.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-[#FF61B6] font-black text-[13px] mb-1.5 uppercase">
                          <span className="text-base">🚩</span> CỘT MỐC
                        </div>
                        <ul className="text-gray-700 text-[13px] leading-relaxed space-y-1">
                          {m.personal.map((item, idx) => (
                            <li key={idx}>• <TeamName text={item} /></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="hidden lg:block w-full overflow-x-auto overflow-y-hidden pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x">
        <div className="relative w-[1000px] h-[1200px] mx-auto">
          {/* SVG Curve */}
          <motion.svg
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewBox="0 0 1000 1200"
            className="absolute inset-0 w-full h-full drop-shadow-md pointer-events-none"
            preserveAspectRatio="xMidYMid meet"
          >
          <defs>
            <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0084FF" />
              <stop offset="40%" stopColor="#0084FF" />
              <stop offset="80%" stopColor="#FF61B6" />
              <stop offset="100%" stopColor="#FF61B6" />
            </linearGradient>

            <linearGradient id="fade-out-gradient" x1="500" y1="1100" x2="1000" y2="1100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF61B6" stopOpacity="1" />
              <stop offset="100%" stopColor="#FF61B6" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="mask-fade-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="black" />
            </linearGradient>

            <mask id="fade-mask">
              <rect x="0" y="0" width="1000" height="1050" fill="white" />
              <rect x="0" y="1050" width="500" height="150" fill="white" />
              <rect x="500" y="1050" width="500" height="150" fill="url(#mask-fade-gradient)" />
            </mask>
          </defs>

          {/* Hidden path strictly to measure the full length */}
          <path ref={pathRef} d={fullSvgPath} fill="none" stroke="none" />

          {/* Solid Base Path */}
          <path
            d={solidPath}
            fill="none"
            stroke="url(#timeline-gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Fading extension */}
          <path
            d={dottedPath}
            fill="none"
            stroke="url(#fade-out-gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Vệt sáng chạy dọc toàn bộ timeline */}
          {pathLength > 0 && (
            <path
              d={fullSvgPath}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="timeline-runner"
              mask="url(#fade-mask)"
              style={{
                strokeDasharray: `40 ${pathLength + 100}`,
                ["--run-from" as string]: `40`,
                ["--run-to" as string]: `-${pathLength + 100}`,
              }}
            />
          )}
        </motion.svg>

        {/* Nodes and Tooltips */}
        {MILESTONES.map((m, index) => {
          const isHovered = hoveredYear === m.year;
          const hasSubtitles = !!m.title || (m.subtitles && m.subtitles.length > 0);
          
          return (
            <div
              key={m.year}
              className="absolute group z-20"
              style={{
                left: `${(m.x / 1000) * 100}%`,
                top: `${(m.y / 1200) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setHoveredYear(m.year)}
              onMouseLeave={() => setHoveredYear(null)}
              onClick={() => setHoveredYear(m.year)}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: (index % 3) * 0.15 }}
                className="relative flex items-center justify-center"
              >
                {/* Year Label */}
                <div
                className={`absolute font-bold text-2xl md:text-3xl transition-transform ${
                  isHovered ? "scale-110" : ""
                }`}
                style={{
                  color: m.color,
                  ...(m.layout === "left" && { right: "calc(100% + 15px)", top: "calc(50% - 2px)", transform: "translateY(-100%)" }),
                  ...(m.layout === "right" && { left: "calc(100% + 15px)", top: "calc(50% - 2px)", transform: "translateY(-100%)" }),
                  ...(m.layout === "top-bottom" && { bottom: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)" }),
                  ...(m.layout === "bottom-top" && { top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)" }),
                }}
              >
                {m.year}
              </div>

              {/* Subtitles (Static) */}
              {hasSubtitles && (
                <div
                  className="absolute text-xs md:text-[13px] text-gray-700 whitespace-nowrap font-medium w-max pointer-events-none"
                  style={{
                    ...(m.layout === "left" && { right: "calc(100% + 15px)", top: "calc(50% + 4px)", textAlign: "right" }),
                    ...(m.layout === "right" && { left: "calc(100% + 15px)", top: "calc(50% + 4px)", textAlign: "left" }),
                    ...(m.layout === "top-bottom" && { top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)", textAlign: "center" }),
                    ...(m.layout === "bottom-top" && { bottom: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)", textAlign: "center" }),
                  }}
                >
                  {m.title && <div className="font-bold text-pink-500 mb-1"><TeamName text={m.title} /></div>}
                  {m.subtitles?.map((s, i) => (
                    <div key={i}><TeamName text={s} /></div>
                  ))}
                </div>
              )}

              {/* Dot - This is the only relative element establishing container size */}
              <div
                className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-white border-4 md:border-[6px] cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-transform hover:scale-125"
                style={{ borderColor: m.color }}
              />

              {/* Tooltip Card (Hover) */}
              <AnimatePresence>
                {isHovered && (m.achievements.length > 0 || m.awards.length > 0 || m.personal.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-5 md:p-6 w-[280px] md:w-[320px] border border-gray-100 z-50 pointer-events-none"
                    style={{
                      ...(m.layout === "left" ? { left: "30px", top: "-50px" } : {}),
                      ...(m.layout === "right" ? { right: "30px", top: "-50px" } : {}),
                      ...(m.layout === "top-bottom" ? { left: "50%", top: "40px", transform: "translateX(-50%)" } : {}),
                      ...(m.layout === "bottom-top" ? { left: "50%", bottom: "40px", transform: "translateX(-50%)" } : {}),
                    }}
                  >
                    {m.achievements.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-[#0084FF] font-black text-lg mb-2 uppercase">
                          <span className="text-2xl">👑</span> THÀNH TÍCH NỔI BẬT
                        </div>
                        <ul className="text-gray-700 text-sm md:text-[15px] leading-relaxed">
                          {m.achievements.map((item, idx) => (
                            <li key={idx}>• <TeamName text={item} /></li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {m.awards.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-[#F59E0B] font-black text-lg mb-2 uppercase">
                          <span className="text-2xl">🏆</span> GIẢI THƯỞNG CÁ NHÂN
                        </div>
                        <ul className="text-gray-700 text-sm md:text-[15px] leading-relaxed">
                          {m.awards.map((item, idx) => (
                            <li key={idx}>• <TeamName text={item} /></li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {m.personal.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-[#FF61B6] font-black text-lg mb-2 uppercase">
                          <span className="text-2xl">🚩</span> CỘT MỐC CÁ NHÂN
                        </div>
                        <ul className="text-gray-700 text-sm md:text-[15px] leading-relaxed">
                          {m.personal.map((item, idx) => (
                            <li key={idx}>• <TeamName text={item} /></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
