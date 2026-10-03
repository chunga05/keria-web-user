"use client";

import React from "react";
import { Calendar, Clock, Trophy, MapPin } from "lucide-react";

/**
 * WIP Component for Keria's Schedule (Lịch trình)
 * Lazy-loaded dynamically only when NEXT_PUBLIC_ENABLE_SCHEDULE is active.
 */
export default function WIPScheduleView() {
  const sampleEvents = [
    {
      title: "LCK Mùa Xuân - T1 vs Gen.G",
      date: "15:00, 15/10/2026",
      location: "LoL Park, Seoul",
      type: "Match",
    },
    {
      title: "Chzzk Live Stream - Leo Rank Thách Đấu",
      date: "19:00, 18/10/2026",
      location: "Chzzk Channel",
      type: "Stream",
    },
    {
      title: "T1 Fan Meeting - Vietnam Tour",
      date: "09:00, 05/11/2026",
      location: "TP. Hồ Chí Minh, Việt Nam",
      type: "Event",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 mb-3">
          <Calendar className="h-3.5 w-3.5" />
          Keria Schedule
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Lịch Trình Hoạt Động & Thi Đấu
        </h1>
        <p className="text-neutral-300 max-w-lg mx-auto text-sm sm:text-base">
          Cập nhật liên tục lịch thi đấu, livestream và sự kiện cộng đồng của hỗ trợ xuất sắc nhất thế giới - Ryu &quot;Keria&quot; Minseok.
        </p>
      </div>

      <div className="grid gap-4">
        {sampleEvents.map((event, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-400/30 text-sky-400 shrink-0">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-sky-400/20 text-sky-300 mb-1">
                  {event.type}
                </span>
                <h3 className="text-lg font-bold text-white">{event.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                    {event.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
            <button className="self-end sm:self-center px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors">
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
