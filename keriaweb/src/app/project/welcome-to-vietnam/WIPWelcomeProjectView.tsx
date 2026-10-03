"use client";

import React from "react";
import { Heart, Sparkles, Send, Users, Image as ImageIcon } from "lucide-react";

/**
 * WIP Component for 'Welcome to Vietnam' Project
 * Dynamically loaded only when NEXT_PUBLIC_ENABLE_WELCOME_PROJECT is true.
 */
export default function WIPWelcomeProjectView() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-400/30 mb-3">
          <Heart className="h-3.5 w-3.5 fill-pink-400 text-pink-400" />
          Special Project
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          &apos;Welcome to Vietnam&apos; Project
        </h1>
        <p className="text-neutral-300 max-w-xl mx-auto text-sm sm:text-base">
          Dự án đặc biệt do Dear Keria VN tổ chức nhằm chào đón và thể hiện tình cảm của người hâm mộ Việt Nam dành cho Keria.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4">
            <Send className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Thư tay & Quà tặng</h3>
          <p className="text-xs text-neutral-300">
            Thu thập thư tay, quà lưu niệm mang đậm nét văn hóa truyền thống Việt Nam gửi tận tay Keria.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
            <ImageIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Biển LED Chào Mừng</h3>
          <p className="text-xs text-neutral-300">
            Dự án biển LED tại các trung tâm thương mại lớn nhằm tạo sự bất ngờ đặc biệt cho tuyển thủ.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Offline Fan Gathering</h3>
          <p className="text-xs text-neutral-300">
            Buổi gặp gỡ, giao lưu giữa cộng đồng người hâm mộ Keria tại Việt Nam cùng các phần quà độc quyền.
          </p>
        </div>
      </div>
    </div>
  );
}
