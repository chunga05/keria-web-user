"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Tv,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  CalendarPlus,
  Radio,
  Sparkles,
  Users,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

export interface ScheduleItem {
  id: string;
  title: string;
  type: "match" | "stream" | "event";
  tournament?: string | null;
  opponent?: string | null;
  opponent_logo?: string | null;
  event_date: string;
  location?: string | null;
  bo?: string | null;
  score?: string | null;
  status: "upcoming" | "live" | "finished";
  stream_url?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

const TYPE_TABS = [
  { id: "all", label: "Tất Cả", icon: Sparkles },
  { id: "match", label: "Trận Đấu", icon: Trophy },
  { id: "stream", label: "Livestream Chzzk", icon: Tv },
  { id: "event", label: "Sự Kiện", icon: Users },
] as const;

const STATUS_OPTIONS = [
  { id: "all", label: "Tất cả trạng thái" },
  { id: "upcoming", label: "Sắp diễn ra" },
  { id: "finished", label: "Đã kết thúc" },
] as const;

// Logo đội tuyển LCK lưu trữ trực tiếp tại public/images/teams
const DEFAULT_LOGOS: Record<string, string> = {
  T1: "/images/teams/t1.svg",
  "T1-white": "/images/teams/t1-white.svg",
  "Gen.G": "/images/teams/geng.svg",
  GEN: "/images/teams/geng.svg",
  "Hanwha Life Esports": "/images/teams/hle.svg",
  HLE: "/images/teams/hle.svg",
  "Dplus KIA": "/images/teams/dk.svg",
  DK: "/images/teams/dk.svg",
  "KT Rolster": "/images/teams/kt.svg",
  KT: "/images/teams/kt.svg",
  "Kwangdong Freecs": "/images/teams/kdf.png",
  KDF: "/images/teams/kdf.png",
  DRX: "/images/teams/drx.png",
  "BNK FearX": "/images/teams/fox.png",
  FOX: "/images/teams/fox.png",
  FearX: "/images/teams/fox.png",
  "Nongshim RedForce": "/images/teams/ns.png",
  NS: "/images/teams/ns.png",
  "OK BRION": "/images/teams/bro.svg",
  BRO: "/images/teams/bro.svg",
};

/**
 * Component hiển thị logo đội tuyển đáng tin cậy với fallback an toàn
 */
function TeamLogo({
  team,
  logoUrl,
  isWhite = false,
  className = "h-full w-full object-contain",
}: {
  team?: string | null;
  logoUrl?: string | null;
  isWhite?: boolean;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  const resolvedSrc = useMemo(() => {
    if (!team) return logoUrl || null;
    const t = team.trim();
    if (t === "T1") {
      return isWhite ? "/images/teams/t1-white.svg" : "/images/teams/t1.svg";
    }
    if (DEFAULT_LOGOS[t]) return DEFAULT_LOGOS[t];

    const lower = t.toLowerCase();
    if (lower.includes("gen.g") || lower.includes("geng")) return "/images/teams/geng.svg";
    if (lower.includes("hanwha") || lower.includes("hle")) return "/images/teams/hle.svg";
    if (lower.includes("dplus") || lower.includes("dk") || lower.includes("damwon")) return "/images/teams/dk.svg";
    if (lower.includes("kt")) return "/images/teams/kt.svg";
    if (lower.includes("kwangdong") || lower.includes("kdf") || lower.includes("freecs")) return "/images/teams/kdf.png";
    if (lower.includes("drx")) return "/images/teams/drx.png";
    if (lower.includes("fearx") || lower.includes("fox") || lower.includes("bnk")) return "/images/teams/fox.png";
    if (lower.includes("nongshim") || lower.includes("ns")) return "/images/teams/ns.png";
    if (lower.includes("brion") || lower.includes("bro")) return "/images/teams/bro.svg";

    if (logoUrl && !logoUrl.includes("op.gg")) return logoUrl;
    return null;
  }, [team, logoUrl, isWhite]);

  if (hasError || !resolvedSrc) {
    const initials = (team || "OPP")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();

    return (
      <span className="font-black text-xs sm:text-sm tracking-wider text-gray-700 select-none">
        {initials}
      </span>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={team || "Team Logo"}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}

function formatVietnameseDate(dateStr: string): {
  timeStr: string;
  dayOfWeek: string;
  dateStr: string;
  fullStr: string;
} {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return { timeStr: "--:--", dayOfWeek: "", dateStr: "", fullStr: dateStr };
    }

    const timeStr = d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const days = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    const dayOfWeek = days[d.getDay()];

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    return {
      timeStr,
      dayOfWeek,
      dateStr: formattedDate,
      fullStr: `${timeStr} • ${dayOfWeek}, ${formattedDate}`,
    };
  } catch {
    return { timeStr: "--:--", dayOfWeek: "", dateStr: "", fullStr: dateStr };
  }
}

function createGoogleCalendarUrl(item: ScheduleItem): string {
  try {
    const startDate = new Date(item.event_date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Mặc định thời lượng 2 tiếng

    const formatGDate = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

    const title = encodeURIComponent(
      item.type === "match"
        ? `[LCK] ${item.title}`
        : item.type === "stream"
        ? `[Chzzk Live] ${item.title}`
        : `[Event] ${item.title}`
    );

    const details = encodeURIComponent(
      `${item.description || item.title}\n\nTheo dõi tại DearKeriaVN: https://dearkeriavn.com/kerias/lich-trinh`
    );

    const location = encodeURIComponent(item.location || "Online");
    const dates = `${formatGDate(startDate)}/${formatGDate(endDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  } catch {
    return "#";
  }
}

export default function ScheduleView() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "match" | "stream" | "event">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "finished">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [now, setNow] = useState<Date>(new Date());

  // Cập nhật đồng hồ mỗi giây cho countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Tải dữ liệu lịch trình từ API
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/schedules");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSchedules(json.data);
        }
      }
    } catch (err) {
      console.error("Lỗi tải lịch trình:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Tìm trận đấu/sự kiện sắp diễn ra gần nhất
  const nextEvent = useMemo(() => {
    const futureEvents = schedules
      .filter((item) => {
        const eventTime = new Date(item.event_date).getTime();
        return eventTime > now.getTime() && item.status !== "finished";
      })
      .sort(
        (a, b) =>
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      );
    return futureEvents[0] || null;
  }, [schedules, now]);

  // Tính countdown cho trận đấu tiếp theo
  const countdown = useMemo(() => {
    if (!nextEvent) return null;
    const diff = new Date(nextEvent.event_date).getTime() - now.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  }, [nextEvent, now]);

  // Bộ lọc danh sách
  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      // Tab filter
      if (activeTab !== "all" && item.type !== activeTab) {
        return false;
      }
      // Status filter
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchOpponent = item.opponent?.toLowerCase().includes(q);
        const matchTour = item.tournament?.toLowerCase().includes(q);
        const matchLoc = item.location?.toLowerCase().includes(q);
        if (!matchTitle && !matchOpponent && !matchTour && !matchLoc) {
          return false;
        }
      }
      return true;
    });
  }, [schedules, activeTab, statusFilter, searchQuery]);

  // Thống kê số lượng theo tab
  const counts = useMemo(() => {
    return {
      all: schedules.length,
      match: schedules.filter((i) => i.type === "match").length,
      stream: schedules.filter((i) => i.type === "stream").length,
      event: schedules.filter((i) => i.type === "event").length,
    };
  }, [schedules]);

  return (
    <main className="min-h-screen w-full bg-[#F8F9FC] pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-16 sm:pb-20">
      <div className="mx-auto w-[92%] sm:w-[90%] lg:w-[92%] xl:w-full max-w-[1200px]">
        {/* ========================================================= */}
        {/* HERO HEADER SECTION                                       */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111827] via-[#1E293B] to-[#0F172A] p-6 sm:p-8 md:p-12 text-white shadow-xl mb-8 sm:mb-10">
          {/* Background Decorative Glow */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#FF76C3]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#0084FF]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-[#FF76C3]/20 text-[#FF76C3] border border-[#FF76C3]/30 mb-4 backdrop-blur-md">
                <Radio className="h-3.5 w-3.5 animate-pulse text-[#FF76C3]" />
                Lịch Trình Keria • T1 Esports
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
                Lịch Thi Đấu &amp; Hoạt Động
              </h1>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Cập nhật liên tục lịch thi đấu LCK, các giải đấu quốc tế, các buổi phát sóng livestream Chzzk và sự kiện giao lưu cùng hỗ trợ xuất sắc nhất thế giới —{" "}
                <span className="text-[#FF76C3] font-semibold">Ryu &quot;Keria&quot; Minseok</span>.
              </p>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
              <div className="flex-1 md:flex-none flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="h-10 w-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 font-extrabold text-sm">
                  T1
                </div>
                <div>
                  <div className="text-[11px] text-gray-400 font-medium uppercase">Đội tuyển</div>
                  <div className="text-sm font-bold text-white">T1 Support #1</div>
                </div>
              </div>

              <a
                href="https://chzzk.naver.com/4b39bbf870fc6cf72a514d7c0e6203cf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none flex items-center gap-3 p-3.5 rounded-2xl bg-[#00FFA3]/10 hover:bg-[#00FFA3]/20 transition-all backdrop-blur-md border border-[#00FFA3]/30 group"
              >
                <div className="h-10 w-10 rounded-xl bg-[#00FFA3]/20 border border-[#00FFA3]/40 flex items-center justify-center text-[#00FFA3] shrink-0">
                  <Tv className="h-5 w-5" />
                </div>
                <div className="truncate">
                  <div className="text-[11px] text-[#00FFA3] font-medium uppercase flex items-center gap-1">
                    Live Stream <ExternalLink className="h-3 w-3 inline group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-sm font-bold text-white truncate">Chzzk Ryu Keria</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SPOTLIGHT NEXT MATCH CARD (COUNTDOWN)                     */}
        {/* ========================================================= */}
        {nextEvent && (
          <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200/80 shadow-md p-6 sm:p-8 mb-8 sm:mb-10 transition-all hover:shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF76C3] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF76C3]"></span>
                </span>
                <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#FF76C3]">
                  {nextEvent.type === "match" ? "Trận Đấu Sắp Tới" : "Sự Kiện Sắp Diễn Ra"}
                </span>
                {nextEvent.tournament && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-600 border border-sky-100">
                    {nextEvent.tournament}
                  </span>
                )}
                {nextEvent.bo && (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                    {nextEvent.bo}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span>{formatVietnameseDate(nextEvent.event_date).fullStr}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Teams Matchup or Event Title */}
              <div className="lg:col-span-7">
                {nextEvent.type === "match" ? (
                  <div className="flex flex-row items-center justify-around sm:justify-start sm:gap-8 gap-4 py-2">
                    {/* Team 1: T1 */}
                    <div className="flex flex-col items-center text-center">
                      <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 p-2.5 shadow-md flex items-center justify-center text-white font-black text-2xl border border-red-500">
                        <TeamLogo team="T1" isWhite={true} className="h-full w-full object-contain filter drop-shadow" />
                      </div>
                      <span className="mt-2 font-extrabold text-base sm:text-lg text-gray-900">
                        T1
                      </span>
                      <span className="text-[11px] font-semibold text-[#FF76C3]">
                        Keria Support
                      </span>
                    </div>

                    {/* VS Badge */}
                    <div className="flex flex-col items-center">
                      <div className="px-3 py-1 rounded-full text-xs font-black bg-gray-900 text-white shadow-sm">
                        VS
                      </div>
                      <span className="text-[11px] text-gray-400 mt-1 font-medium">
                        {nextEvent.bo || "BO3"}
                      </span>
                    </div>

                    {/* Team 2: Opponent */}
                    <div className="flex flex-col items-center text-center">
                      <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white p-2.5 shadow-md flex items-center justify-center text-gray-800 font-black text-lg border border-gray-200">
                        <TeamLogo
                          team={nextEvent.opponent}
                          logoUrl={nextEvent.opponent_logo}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span className="mt-2 font-extrabold text-base sm:text-lg text-gray-900 truncate max-w-[120px]">
                        {nextEvent.opponent || "Đối thủ"}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-400">
                        Opponent
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
                      {nextEvent.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {nextEvent.description || "Hãy đón xem và cổ vũ cho Keria nhé!"}
                    </p>
                    {nextEvent.location && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <MapPin className="h-4 w-4 text-[#FF76C3]" />
                        <span>{nextEvent.location}</span>
                      </div>
                    )}
                  </div>
                )}

                {nextEvent.type === "match" && nextEvent.location && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                    <span>{nextEvent.location}</span>
                  </div>
                )}
              </div>

              {/* Countdown Timer Box */}
              <div className="lg:col-span-5 bg-gradient-to-br from-gray-50 to-gray-100/70 p-5 rounded-2xl border border-gray-200">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center mb-3">
                  Thời Gian Đếm Ngược
                </div>
                {countdown ? (
                  <div className="grid grid-cols-4 gap-2 text-center mb-4">
                    <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-xs">
                      <div className="text-xl sm:text-2xl font-black text-gray-900">
                        {countdown.days}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold">
                        Ngày
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-xs">
                      <div className="text-xl sm:text-2xl font-black text-gray-900">
                        {String(countdown.hours).padStart(2, "0")}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold">
                        Giờ
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-xs">
                      <div className="text-xl sm:text-2xl font-black text-gray-900">
                        {String(countdown.minutes).padStart(2, "0")}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold">
                        Phút
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-xs">
                      <div className="text-xl sm:text-2xl font-black text-[#FF76C3]">
                        {String(countdown.seconds).padStart(2, "0")}
                      </div>
                      <div className="text-[10px] sm:text-xs text-[#FF76C3] uppercase font-bold">
                        Giây
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm font-semibold text-gray-500">
                    Sự kiện đang diễn ra
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  {nextEvent.stream_url && (
                    <a
                      href={nextEvent.stream_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#FF76C3] hover:bg-[#ff5ca9] text-white transition-all shadow-sm"
                    >
                      <Tv className="h-3.5 w-3.5" />
                      Xem Trực Tiếp
                    </a>
                  )}
                  <a
                    href={createGoogleCalendarUrl(nextEvent)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 transition-all shadow-xs"
                  >
                    <CalendarPlus className="h-3.5 w-3.5 text-gray-500" />
                    Lưu Lịch Google
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* FILTER TOOLBAR                                            */}
        {/* ========================================================= */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {TYPE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = counts[tab.id];

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#FF76C3] text-white shadow-sm shadow-[#FF76C3]/20"
                      : "bg-white text-gray-600 hover:bg-gray-100/80 border border-gray-200"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Controls: Status filter & Search Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-white border border-gray-200 text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-[#FF76C3]/40 cursor-pointer shadow-xs"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm trận, đối thủ, giải..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl text-xs bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF76C3]/40 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Reload button */}
            <button
              onClick={fetchSchedules}
              disabled={loading}
              title="Làm mới lịch trình"
              className="p-2.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 transition-colors shadow-xs flex items-center justify-center"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#FF76C3]" : ""}`} />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SCHEDULE LIST GRID                                        */}
        {/* ========================================================= */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="p-6 rounded-3xl bg-white border border-gray-200 shadow-xs animate-pulse flex flex-col gap-4"
              >
                <div className="h-5 w-1/3 bg-gray-200 rounded-lg" />
                <div className="h-12 w-full bg-gray-100 rounded-xl" />
                <div className="h-4 w-1/2 bg-gray-200 rounded-md" />
              </div>
            ))}
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-gray-200 shadow-xs my-6">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 mb-1">
              Không tìm thấy lịch trình phù hợp
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
              Thử thay đổi bộ lọc trạng thái hoặc từ khoá tìm kiếm để xem các sự kiện khác.
            </p>
            <button
              onClick={() => {
                setActiveTab("all");
                setStatusFilter("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF76C3] text-white hover:bg-[#ff5ca9] transition-colors"
            >
              Đặt Lại Bộ Lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredSchedules.map((item) => {
              const { timeStr, dayOfWeek, dateStr } = formatVietnameseDate(
                item.event_date
              );
              const isMatch = item.type === "match";
              const isStream = item.type === "stream";
              const isUpcoming = item.status === "upcoming";
              const isFinished = item.status === "finished";
              const isLive = item.status === "live";

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-white border border-gray-200/90 shadow-xs hover:shadow-md hover:border-[#FF76C3]/40 transition-all"
                >
                  {/* Top Bar: Tournament & Status */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isMatch
                              ? "bg-rose-50 text-rose-600 border border-rose-100"
                              : isStream
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-purple-50 text-purple-600 border border-purple-100"
                          }`}
                        >
                          {isMatch
                            ? "Trận Đấu LCK"
                            : isStream
                            ? "Chzzk Live"
                            : "Sự Kiện"}
                        </span>
                        {item.tournament && (
                          <span className="text-xs font-semibold text-gray-600 truncate max-w-[150px] sm:max-w-[200px]">
                            {item.tournament}
                          </span>
                        )}
                      </div>

                      {/* Status Badge */}
                      {isLive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-red-500 text-white animate-pulse">
                          <Radio className="h-3 w-3" />
                          TRỰC TIẾP
                        </span>
                      ) : isFinished ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          Đã kết thúc
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-600 border border-sky-100">
                          <Clock className="h-3 w-3 text-sky-500" />
                          Sắp diễn ra
                        </span>
                      )}
                    </div>

                    {/* Match Content */}
                    {isMatch ? (
                      <div className="py-2 mb-3">
                        <div className="flex items-center justify-between gap-3">
                          {/* Team 1: T1 */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-red-600 to-red-800 p-1.5 flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-xs border border-red-500/30">
                              <TeamLogo team="T1" isWhite={true} className="h-full w-full object-contain filter drop-shadow" />
                            </div>
                            <div className="truncate">
                              <div className="font-extrabold text-sm sm:text-base text-gray-900 truncate">
                                T1
                              </div>
                              <div className="text-[11px] text-[#FF76C3] font-semibold">
                                Keria
                              </div>
                            </div>
                          </div>

                          {/* Score or VS */}
                          <div className="shrink-0 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-center min-w-[70px]">
                            {isFinished && item.score ? (
                              <div className="text-base sm:text-lg font-black text-gray-900 tracking-wider">
                                {item.score}
                              </div>
                            ) : (
                              <div>
                                <div className="text-xs font-black text-gray-800">VS</div>
                                <div className="text-[10px] text-gray-400 font-bold">
                                  {item.bo || "BO3"}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Team 2: Opponent */}
                          <div className="flex items-center gap-3 flex-1 justify-end min-w-0 text-right">
                            <div className="truncate">
                              <div className="font-extrabold text-sm sm:text-base text-gray-900 truncate">
                                {item.opponent || "Đối thủ"}
                              </div>
                              <div className="text-[11px] text-gray-400 font-semibold">
                                LCK
                              </div>
                            </div>
                            <div className="h-11 w-11 rounded-xl bg-white p-1.5 flex items-center justify-center text-gray-800 font-bold text-xs shrink-0 border border-gray-200 shadow-xs">
                              <TeamLogo
                                team={item.opponent}
                                logoUrl={item.opponent_logo}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          </div>
                        </div>

                        {item.title && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-1">
                            {item.title}
                          </p>
                        )}
                      </div>
                    ) : (
                      /* Stream or Event Info */
                      <div className="py-2 mb-3">
                        <h4 className="text-base sm:text-lg font-extrabold text-gray-900 group-hover:text-[#FF76C3] transition-colors mb-1.5 line-clamp-2">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom Meta & Action Links */}
                  <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-gray-700">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {dayOfWeek}, {dateStr}
                      </span>
                      <span className="inline-flex items-center gap-1 text-gray-500 font-medium">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        {timeStr}
                      </span>
                      {item.location && (
                        <span className="inline-flex items-center gap-1 text-gray-500 truncate max-w-[140px]">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {isUpcoming && (
                        <a
                          href={createGoogleCalendarUrl(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Thêm vào Google Calendar"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <CalendarPlus className="h-4 w-4" />
                        </a>
                      )}
                      {item.stream_url && (
                        <a
                          href={item.stream_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs bg-gray-100 hover:bg-[#FF76C3] hover:text-white text-gray-700 transition-all"
                        >
                          <span>{isStream ? "Kênh Chzzk" : "Xem Trực Tiếp"}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================= */}
        {/* OFFICIAL CHANNELS & COMMUNITY HUB                         */}
        {/* ========================================================= */}
        <div className="mt-12 sm:mt-16 pt-10 border-t border-gray-200">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
              Kênh Thông Tin &amp; Phát Sóng Trực Tiếp
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Theo dõi trực tiếp những trận đấu của T1 và các buổi phát sóng của Keria trên các nền tảng chính thức.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Chzzk Naver */}
            <a
              href="https://chzzk.naver.com/4b39bbf870fc6cf72a514d7c0e6203cf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#00FFA3] shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-[#00FFA3]/15 text-[#00FFA3] flex items-center justify-center font-black">
                  <Tv className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#00FFA3] uppercase">Naver Chzzk</div>
                  <div className="text-sm font-extrabold text-gray-900">Keria Live Stream</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 group-hover:text-gray-700 transition-all" />
            </a>

            {/* YouTube LCK Tiếng Việt */}
            <a
              href="https://www.youtube.com/@LCKvietnam"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-red-500 shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-red-600 uppercase">YouTube LCK VN</div>
                  <div className="text-sm font-extrabold text-gray-900">LCK Tiếng Việt</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 group-hover:text-gray-700 transition-all" />
            </a>

            {/* T1 GG Official */}
            <a
              href="https://t1.gg/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-gray-900 shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-gray-900 text-white flex items-center justify-center font-black text-xs">
                  T1
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase">T1 Official</div>
                  <div className="text-sm font-extrabold text-gray-900">Lịch Thi Đấu T1.gg</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 group-hover:text-gray-700 transition-all" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
