"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
    achievements: [],
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
    personal: [],
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
    personal: [],
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
      "LCK Spring Young Player",
      "Esports PC Rookie Of The Year",
      "All LCK First Team (Spring)",
      "All LCK Second Team (Summer)",
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
    achievements: [
      "Hạng 4 LCK Mùa Xuân",
      "Á quân LCK Mùa Hè",
      "Bán kết CKTG",
    ],
    awards: [
      "LCK Award: Support Of The Year",
      "All LCK First Team (Spring)",
      "All LCK First Team (Summer)",
    ],
    personal: ["900 điểm POG (LCK Xuân)"],
  },
  {
    year: 2022,
    x: 100,
    y: 600,
    color: "#0084FF",
    layout: "left",
    title: "",
    subtitles: [],
    achievements: [
      "Vô địch LCK Mùa Xuân",
      "Á quân MSI",
      "Á quân LCK Mùa Hè",
      "Á quân CKTG",
    ],
    awards: [
      "Support Of The Year",
      "Regular Season MVP (Spring)",
      "All LCK First Team (Spring)",
      "All LCK Second Team (Summer)",
      "Secretlab Assist King",
      "Esports Hall of Fame Hero 2022",
    ],
    personal: ["600 điểm POG (LCK Xuân)"],
  },
  {
    year: 2023,
    x: 500,
    y: 700,
    color: "#0084FF",
    layout: "bottom-top",
    title: "",
    subtitles: [],
    achievements: [
      "Vô địch CKTG 2023",
      "Huy chương Vàng Asian Games 2022",
      "Á quân LCK Mùa Xuân & Mùa Hè",
      "Hạng 3 MSI",
    ],
    awards: [
      "Support Of The Year",
      "Regular Season MVP (Spring)",
      "Player of the Split (Spring)",
      "All LCK First Team (Spring)",
      "Esports Hall of Fame Star 2023",
    ],
    personal: ["Top 1 POG (1300 điểm - LCK Xuân)"],
  },
  {
    year: 2024,
    x: 900,
    y: 800,
    color: "#FF61B6",
    layout: "right",
    title: "",
    subtitles: [],
    achievements: [
      "Vô địch CKTG 2024",
      "Vô địch EWC",
      "Á quân LCK Mùa Xuân",
      "Hạng 3 LCK Mùa Hè",
      "Hạng 3 MSI",
    ],
    awards: [
      "Support Of The Year",
      "All LCK First Team (Spring)",
      "All LCK Third Team (Summer)",
      "Esports Hall of Fame Star 2024",
    ],
    personal: ["600 điểm POG (LCK Xuân)", "400 điểm POG (LCK Hè)"],
  },
  {
    year: 2025,
    x: 500,
    y: 900,
    color: "#FF61B6",
    layout: "bottom-top",
    title: "",
    subtitles: [],
    achievements: [
      "Vô địch CKTG 2025",
      "Vô địch KeSPA Cup",
      "Á quân MSI",
      "Hạng 3 LCK R1-2 & EWC",
      "Hạng 4 LCK R3-5",
      "Hạng 6 LCK Cup",
    ],
    awards: [
      "Support Of The Year",
      "All LCK Second Team",
      "Esports Hall of Fame Star 2025",
    ],
    personal: ["200 điểm POM (LCK R1-2)", "600 điểm POM (LCK R3-5)"],
  },
  {
    year: 2026,
    x: 100,
    y: 1000,
    color: "#FF61B6",
    layout: "left",
    title: "",
    subtitles: [],
    achievements: [
      "Hạng 2 LCK R1-2",
      "Hạng 4 LCK Cup",
      "Hạng 5-6 MSI 2026",
    ],
    awards: [],
    personal: ["300 (?) điểm POM (LCK R1-2)"],
  },
];

// Helper tính toán vị trí nhãn năm và team badge chuẩn xác 100% theo toạ độ SVG
function getMilestoneTextPosition(m: Milestone) {
  if (m.year === 2017) {
    return { x: 800, y: 55, anchor: "middle" as const, badge: "KeG Cup 🏆" };
  }
  if (m.year === 2018) {
    return { x: 155, y: 198, anchor: "start" as const, badge: "KeG Gyeonggi" };
  }
  if (m.year === 2019) {
    return { x: 500, y: 255, anchor: "middle" as const, badge: "DRX Academy" };
  }
  if (m.year === 2020) {
    return { x: 845, y: 398, anchor: "end" as const, badge: "DRX LCK" };
  }
  if (m.year === 2021) {
    return { x: 500, y: 455, anchor: "middle" as const, badge: "T1 (LCK Debut)" };
  }
  if (m.year === 2022) {
    return { x: 155, y: 598, anchor: "start" as const, badge: "T1 (Vô địch LCK)" };
  }
  if (m.year === 2023) {
    return { x: 500, y: 655, anchor: "middle" as const, badge: "T1 (Vô địch CKTG)" };
  }
  if (m.year === 2024) {
    return { x: 845, y: 798, anchor: "end" as const, badge: "T1 (Vô địch CKTG)" };
  }
  if (m.year === 2025) {
    return { x: 500, y: 855, anchor: "middle" as const, badge: "T1 (Vô địch CKTG)" };
  }
  return { x: 155, y: 998, anchor: "start" as const, badge: "T1 (Hiện tại)" };
}

// Helper tính toán toạ độ và căn chỉnh Tooltip hover thông minh, không bị tràn viền màn hình hay che nhãn năm
function getTooltipStyle(m: Milestone) {
  if (m.year === 2017) {
    // Năm 2017 nằm sát mép trên, mở tooltip xuống dưới để không che chữ "2017" và không vượt khung trên
    return {
      left: `${(m.x / 1000) * 100}%`,
      top: `${(m.y / 1200) * 100}%`,
      transform: "translate(-50%, 25px)",
    };
  }
  if (m.x <= 150) {
    // Cung lượn bên trái (2018, 2022, 2026): né tràn lề trái
    return {
      left: `${(m.x / 1000) * 100}%`,
      top: `${(m.y / 1200) * 100}%`,
      transform: "translate(-10%, -115%)",
    };
  }
  if (m.x >= 850) {
    // Cung lượn bên phải (2020, 2024): né tràn lề phải
    return {
      left: `${(m.x / 1000) * 100}%`,
      top: `${(m.y / 1200) * 100}%`,
      transform: "translate(-90%, -115%)",
    };
  }
  return {
    left: `${(m.x / 1000) * 100}%`,
    top: `${(m.y / 1200) * 100}%`,
    transform: "translate(-50%, -115%)",
  };
}

// Vệt sáng chạy dọc từ đầu đến cuối
const RUN_DURATION = 12;

export default function TimelineAchievements() {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [pathLength, setPathLength] = useState(0);
  const [mounted, setMounted] = useState(false);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const len = pathRef.current?.getTotalLength();
    if (len) setPathLength(len);
  }, []);

  const currentIndex = selectedMilestone
    ? MILESTONES.findIndex((m) => m.year === selectedMilestone.year)
    : -1;
  const prevMilestone = currentIndex > 0 ? MILESTONES[currentIndex - 1] : null;
  const nextMilestone =
    currentIndex >= 0 && currentIndex < MILESTONES.length - 1
      ? MILESTONES[currentIndex + 1]
      : null;

  // Khóa scroll khi mở popup và hỗ trợ phím Escape / Mũi tên
  useEffect(() => {
    if (!selectedMilestone) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMilestone(null);
      } else if (e.key === "ArrowLeft" && prevMilestone) {
        setSelectedMilestone(prevMilestone);
      } else if (e.key === "ArrowRight" && nextMilestone) {
        setSelectedMilestone(nextMilestone);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedMilestone, prevMilestone, nextMilestone]);

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

  const hoveredMilestone = MILESTONES.find((m) => m.year === hoveredYear);

  return (
    <section className="w-full bg-[#FAFAFA] py-14 sm:py-20 px-2 sm:px-6 md:px-8 flex flex-col items-center relative z-10 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-6 sm:mb-14"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#102652] mb-2 sm:mb-4 tracking-tight">
          HÀNH TRÌNH CỦA KERIA
        </h2>
        <p className="text-gray-500 font-medium text-xs sm:text-sm md:text-base px-2">
          Bấm vào từng mốc năm trên sơ đồ để xem chi tiết thành tích
        </p>
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

      {/* Sơ đồ hành trình dạng đường cong SVG (Đồng bộ chuẩn xác 100% trên cả Mobile và Laptop) */}
      <div className="w-full flex justify-center py-2 sm:py-6 overflow-visible">
        <div className="relative w-full max-w-[960px] aspect-[1000/1200] mx-auto select-none px-1 sm:px-4">
          <svg
            viewBox="0 0 1000 1200"
            className="w-full h-full drop-shadow-md select-none overflow-visible"
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

            {/* Toàn bộ điểm mốc (Điểm tròn + Nhãn năm + Badge) nằm trực tiếp bên trong SVG để đồng bộ toạ độ 100% */}
            {MILESTONES.map((m) => {
              const isHovered = hoveredYear === m.year;
              const textPos = getMilestoneTextPosition(m);

              return (
                <g
                  key={m.year}
                  onClick={() => setSelectedMilestone(m)}
                  onMouseEnter={() => setHoveredYear(m.year)}
                  onMouseLeave={() => setHoveredYear(null)}
                  className="cursor-pointer group"
                >
                  {/* Vùng chạm cảm ứng vô hình (bán kính 45px = đường kính 90px cực kỳ dễ chạm trên mobile) */}
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r="45"
                    fill="transparent"
                    className="cursor-pointer"
                  />

                  {/* Vòng hào quang sáng khi hover */}
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r={isHovered ? 26 : 0}
                    fill={m.color}
                    opacity="0.25"
                    className="transition-all duration-200"
                  />

                  {/* Điểm tròn chính nằm chuẩn xác 100% ngay trên đường line */}
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r={isHovered ? 17 : 13}
                    fill="white"
                    stroke={m.color}
                    strokeWidth={isHovered ? 7 : 5}
                    className="transition-all duration-200 drop-shadow-sm"
                  />

                  {/* Tâm điểm tròn */}
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r={isHovered ? 5.5 : 4}
                    fill={m.color}
                    className="transition-all duration-200"
                  />

                  {/* Nhãn năm */}
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    textAnchor={textPos.anchor}
                    fill={m.color}
                    fontSize={isHovered ? "36" : "32"}
                    fontWeight="900"
                    letterSpacing="-0.5"
                    className="transition-all duration-200 select-none cursor-pointer"
                    style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    {m.year}
                    {[2023, 2024, 2025].includes(m.year) ? " 👑" : ""}
                  </text>

                  {/* Nhãn phụ đội tuyển / giải đấu */}
                  <text
                    x={textPos.x}
                    y={textPos.y + 24}
                    textAnchor={textPos.anchor}
                    fill="#64748B"
                    fontSize="18"
                    fontWeight="700"
                    className="transition-all duration-200 select-none cursor-pointer"
                    style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    {textPos.badge}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip Hover cho Desktop (chỉ hiện khi rê chuột trên máy tính) */}
          <AnimatePresence>
            {hoveredMilestone && (
              <motion.div
                key={hoveredMilestone.year}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="hidden md:block absolute bg-white rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.18)] p-5 w-[290px] lg:w-[330px] border border-gray-100 z-50 pointer-events-none"
                style={getTooltipStyle(hoveredMilestone)}
              >
                {/* Header năm & badge trong tooltip */}
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gray-100">
                  <span className="font-black text-sm text-[#102652]">
                    NĂM {hoveredMilestone.year}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${hoveredMilestone.color}15`,
                      color: hoveredMilestone.color,
                    }}
                  >
                    {getMilestoneTextPosition(hoveredMilestone).badge}
                  </span>
                </div>

                {/* Subtitles & Title (dành cho năm 2017, 2018, 2019, 2020) */}
                {(hoveredMilestone.title || (hoveredMilestone.subtitles && hoveredMilestone.subtitles.length > 0)) && (
                  <div className="mb-2.5">
                    {hoveredMilestone.title && (
                      <div className="font-bold text-pink-500 text-xs mb-1">
                        <TeamName text={hoveredMilestone.title} />
                      </div>
                    )}
                    {hoveredMilestone.subtitles?.map((s, idx) => (
                      <div key={idx} className="text-gray-600 text-xs leading-relaxed">
                        <TeamName text={s} />
                      </div>
                    ))}
                  </div>
                )}

                {/* 👑 THÀNH TÍCH */}
                {hoveredMilestone.achievements.length > 0 && (
                  <div className="mb-2.5">
                    <div className="flex items-center gap-1.5 text-[#0084FF] font-black text-xs uppercase mb-1">
                      <span>👑</span> THÀNH TÍCH
                    </div>
                    <ul className="text-gray-700 text-xs leading-relaxed space-y-0.5">
                      {hoveredMilestone.achievements.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="truncate">• <TeamName text={item} /></li>
                      ))}
                      {hoveredMilestone.achievements.length > 3 && (
                        <li className="text-gray-400 font-medium text-[11px]">+ {hoveredMilestone.achievements.length - 3} thành tích khác...</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* 🏆 GIẢI THƯỞNG */}
                {hoveredMilestone.awards.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center gap-1.5 text-[#F59E0B] font-black text-xs uppercase mb-1">
                      <span>🏆</span> GIẢI THƯỞNG
                    </div>
                    <ul className="text-gray-700 text-xs leading-relaxed space-y-0.5">
                      {hoveredMilestone.awards.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="truncate">• <TeamName text={item} /></li>
                      ))}
                      {hoveredMilestone.awards.length > 2 && (
                        <li className="text-gray-400 font-medium text-[11px]">+ {hoveredMilestone.awards.length - 2} giải thưởng khác...</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* 🚩 CỘT MỐC CÁ NHÂN (chỉ hiện khi không có giải thưởng để tránh tooltip quá dài) */}
                {hoveredMilestone.awards.length === 0 && hoveredMilestone.personal.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center gap-1.5 text-[#FF61B6] font-black text-xs uppercase mb-1">
                      <span>🚩</span> CỘT MỐC CÁ NHÂN
                    </div>
                    <ul className="text-gray-700 text-xs leading-relaxed space-y-0.5">
                      {hoveredMilestone.personal.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="truncate">• <TeamName text={item} /></li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Giai đoạn khởi đầu nếu không có thành tích / giải thưởng (2017, 2018, 2019) */}
                {hoveredMilestone.achievements.length === 0 &&
                  hoveredMilestone.awards.length === 0 &&
                  hoveredMilestone.personal.length === 0 && (
                    <p className="text-gray-400 text-[11px] italic leading-snug mt-1">
                      Giai đoạn khởi đầu sự nghiệp thi đấu của Ryu Minseok trước LCK.
                    </p>
                  )}

                <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                  <span>Xem chi tiết</span>
                  <span className="text-[#0084FF] font-semibold">Nhấn để mở ↗</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal Popup Portal gắn thẳng vào document.body - Thiết kế chuẩn giống hệt Laptop, không bị bất kỳ layer nào che */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {selectedMilestone && (
              <div
                className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs cursor-pointer"
                onClick={() => setSelectedMilestone(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 15 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="w-full max-w-[340px] min-[420px]:max-w-[400px] sm:max-w-[460px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-gray-100 p-5 sm:p-6 max-h-[85vh] overflow-y-auto cursor-default"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Body: Thiết kế chuẩn form trắng thanh thoát giống hệt Laptop */}
                  <div className="space-y-4">
                    {/* Subtitles (Static Info) */}
                    {(selectedMilestone.title || (selectedMilestone.subtitles && selectedMilestone.subtitles.length > 0)) && (
                      <div className="text-xs sm:text-[13px] text-gray-700 font-medium space-y-1 pb-1">
                        {selectedMilestone.title && (
                          <div className="font-bold text-pink-500 mb-1">
                            <TeamName text={selectedMilestone.title} />
                          </div>
                        )}
                        {selectedMilestone.subtitles?.map((s, idx) => (
                          <div key={idx} className="leading-snug">
                            <TeamName text={s} />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 👑 THÀNH TÍCH NỔI BẬT */}
                    {selectedMilestone.achievements.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-[#0084FF] font-black text-base sm:text-lg mb-2 uppercase">
                          <span className="text-xl sm:text-2xl">👑</span> THÀNH TÍCH NỔI BẬT
                        </div>
                        <ul className="text-gray-700 text-xs sm:text-sm leading-relaxed space-y-1">
                          {selectedMilestone.achievements.map((item, idx) => (
                            <li key={idx}>• <TeamName text={item} /></li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 🏆 GIẢI THƯỞNG CÁ NHÂN */}
                    {selectedMilestone.awards.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-[#F59E0B] font-black text-base sm:text-lg mb-2 uppercase">
                          <span className="text-xl sm:text-2xl">🏆</span> GIẢI THƯỞNG CÁ NHÂN
                        </div>
                        <ul className="text-gray-700 text-xs sm:text-sm leading-relaxed space-y-1">
                          {selectedMilestone.awards.map((item, idx) => (
                            <li key={idx}>• <TeamName text={item} /></li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 🚩 CỘT MỐC CÁ NHÂN */}
                    {selectedMilestone.personal.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-[#FF61B6] font-black text-base sm:text-lg mb-2 uppercase">
                          <span className="text-xl sm:text-2xl">🚩</span> CỘT MỐC CÁ NHÂN
                        </div>
                        <ul className="text-gray-700 text-xs sm:text-sm leading-relaxed space-y-1">
                          {selectedMilestone.personal.map((item, idx) => (
                            <li key={idx}>• <TeamName text={item} /></li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Năm không có thành tích */}
                    {selectedMilestone.achievements.length === 0 &&
                      selectedMilestone.awards.length === 0 &&
                      selectedMilestone.personal.length === 0 && (
                        <div className="py-2 text-gray-500 text-xs sm:text-sm leading-relaxed">
                          Giai đoạn khởi đầu sự nghiệp thi đấu của Ryu Minseok trước khi bước lên đấu trường chuyên nghiệp LCK.
                        </div>
                      )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
