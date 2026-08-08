"use client";

import React, { useState } from "react";
import Image from "next/image";

// ============================================================================
// ĐỊNH NGHĨA KIỂU DỮ LIỆU
// ============================================================================
interface Reaction {
  emoji: string;
  count: number;
}

interface Message {
  id: number;
  author: string;
  date: string;
  content: string;
  bgColor: "blue" | "pink";
  avatar?: string;
  hasGoldStar?: boolean;
  decorationStar?: "blue" | "pink" | "none";
}

// ============================================================================
// DỮ LIỆU MẪU (MOCK DATA) - Đã tăng số lượng để lấp đầy 3 cột
// ============================================================================
const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    author: "user12345",
    date: "14-10-2026",
    content: "Lorem ipsum dolor sit amet consectetur. Eget diam quis adipiscing semper eget posuere consectetur netus. Et ultrices a at ultrices commodo cras vitae. In nunc at hendrerit urna. At diam a at pellentesque nullam consectetur dui morbi hac mauris tempor.",
    bgColor: "blue",
    decorationStar: "none",
  },
  {
    id: 2,
    author: "Xuân Trang",
    date: "14-10-2026",
    content: "Lorem ipsum dolor sit amet consectetur. Duis at eget sed quis egestas odio vitae eros eget. Dignissim varius amet duis tortor. Pellentesque commodo dui pretium amet diam viverra tellus amet. Sed facilisis hendrerit tellus at placerat eros consectetur.",
    bgColor: "pink",
    decorationStar: "blue",
  },
  {
    id: 3,
    author: "Ryu Minseok",
    date: "14-10-2026",
    content: "Lorem ipsum dolor sit amet consectetur. Tincidunt amet lacinia cursus mattis. Cursus morbi adipiscing adipiscing sit. Semper imperdiet mus lacus nibh volutpat adipiscing commodo rhoncus erat. Ac senectus mauris etiam aliquet quis purus amet facilisis.",
    bgColor: "blue",
    avatar: "/images/avatar-placeholder.png", // Thay bằng URL thật nếu có
    hasGoldStar: true,
    decorationStar: "none",
  },
  {
    id: 4,
    author: "Ryu Minseok",
    date: "14-10-2026",
    content: "Lorem ipsum dolor sit amet consectetur. Cursus nulla eget in mauris neque posuere tincidunt a ac. Tincidunt id ut ullamcorper ultrices. Tristique consequat purus diam eu. Tellus amet amet nulla quam sed. Nisl arcu placerat amet enim accumsan molestie.",
    bgColor: "blue",
    avatar: "/images/avatar-placeholder.png",
    hasGoldStar: true,
    decorationStar: "pink",
  },
  {
    id: 5,
    author: "user12345",
    date: "14-10-2026",
    content: "Lorem ipsum dolor sit amet consectetur. Eget diam quis adipiscing semper eget posuere consectetur netus. Et ultrices a at ultrices commodo cras vitae. In nunc at hendrerit urna. At diam a at pellentesque nullam consectetur dui morbi hac mauris tempor.",
    bgColor: "blue",
    decorationStar: "none",
  },
  {
    id: 6,
    author: "Xuân Trang",
    date: "14-10-2026",
    content: "Lorem ipsum dolor sit amet consectetur. Duis at eget sed quis egestas odio vitae eros eget. Dignissim varius amet duis tortor. Pellentesque commodo dui pretium amet diam viverra tellus amet. Sed facilisis hendrerit tellus at placerat eros consectetur.",
    bgColor: "pink",
    decorationStar: "none",
  },
  {
    id: 7,
    author: "Xuân Trang",
    date: "14-10-2026",
    content: "Lorem ipsum dolor sit amet consectetur. Duis at eget sed quis egestas odio vitae eros eget. Dignissim varius amet duis tortor. Pellentesque commodo dui pretium amet diam viverra tellus amet. Sed facilisis hendrerit tellus at placerat eros consectetur.",
    bgColor: "pink",
    decorationStar: "none",
  },
  {
    id: 8,
    author: "Xuân Trang",
    date: "14-10-2026",
    content: "Lorem ipsum dolor sit amet consectetur. Duis at eget sed quis egestas odio vitae eros eget. Dignissim varius amet duis tortor. Pellentesque commodo dui pretium amet diam viverra tellus amet. Sed facilisis hendrerit tellus at placerat eros consectetur.",
    bgColor: "pink",
    decorationStar: "blue",
  },
  {
    id: 9,
    author: "Xuân Trang",
    date: "14-10-2026",
    content: "Lorem ipsum dolor sit amet consectetur. Duis at eget sed quis egestas odio vitae eros eget. Dignissim varius amet duis tortor. Pellentesque commodo dui pretium amet diam viverra tellus amet. Sed facilisis hendrerit tellus at placerat eros consectetur.",
    bgColor: "pink",
    decorationStar: "pink",
  },
  {
    id: 10,
    author: "Ryu Minseok",
    date: "14-10-2026",
    content: "Lorem ipsum dolor sit amet consectetur. Tincidunt amet lacinia cursus mattis. Cursus morbi adipiscing adipiscing sit. Semper imperdiet mus lacus nibh volutpat adipiscing commodo rhoncus erat. Ac senectus mauris etiam aliquet quis purus amet facilisis.",
    bgColor: "blue",
    avatar: "/images/avatar-placeholder.png",
    hasGoldStar: true,
    decorationStar: "pink",
  },
  {
    id: 11,
    author: "Xuân Trang",
    date: "14-10-2026",
    content: "Lorem ipsum dolor sit amet consectetur. Duis at eget sed quis egestas odio vitae eros eget. Dignissim varius amet duis tortor. Pellentesque commodo dui pretium amet diam viverra tellus amet. Sed facilisis hendrerit tellus at placerat eros consectetur.",
    bgColor: "pink",
    decorationStar: "none",
  },
  {
    id: 12,
    author: "user12345",
    date: "14-10-2026",
    content: "Lorem ipsum dolor sit amet consectetur. Eget diam quis adipiscing semper eget posuere consectetur netus. Et ultrices a at ultrices commodo cras vitae. In nunc at hendrerit urna. At diam a at pellentesque nullam consectetur dui morbi hac mauris tempor.",
    bgColor: "blue",
    decorationStar: "none",
  },
];

const MOCK_REACTIONS: Reaction[] = [
  { emoji: "😭", count: 100 },
  { emoji: "😮", count: 1000 },
  { emoji: "🤩", count: 999 }, // Thay bằng icon tương đương trong ảnh
  { emoji: "🥰", count: 1410 },
];

export default function ToMyDearestPage() {
  const [filter, setFilter] = useState("Mới nhất");

  return (
    <main className="min-h-screen bg-[#F4F5F7] pb-20 pt-20 font-sans">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
        
        {/* =====================================================
            KHUNG TRẮNG TO BÊN NGOÀI
        ====================================================== */}
        <div className="relative mx-auto mb-12 w-full max-w-4xl rounded-xl bg-white px-6 pb-12 pt-20 shadow-sm md:px-12">
          
          <div className="absolute -top-10 left-1/2 w-[280px] -translate-x-1/2 drop-shadow-md md:w-[461px]">
            <Image
              src="/images/tomydear.png"
              alt="To My Dearest"
              width={461}
              height={88}
              priority
              className="h-auto w-full object-contain"
            />
          </div>

          <h2 className="mb-10 text-center text-lg font-black text-black tracking-wide md:text-2xl">
            <span className="text-[#FF76C3]">♥</span> LỜI CHÚC MỪNG SINH NHẬT TỚI KERIA <span className="text-[#FF76C3]">♥</span>
          </h2>

          <div className="mb-8">
            <label className="mb-3 block text-sm font-bold text-gray-800">Tên người gửi</label>
            <input
              type="text"
              placeholder="Name"
              className="w-full rounded-lg border border-gray-100 bg-[#FAFAFA] px-4 py-3.5 text-sm outline-none transition-colors focus:border-[#FF76C3] focus:bg-white focus:ring-1 focus:ring-[#FF76C3]"
            />
          </div>

          <div className="mb-10">
            <label className="mb-3 block text-sm font-bold text-gray-800">Viết lời chúc mừng sinh nhật tới Keria</label>
            <textarea
              rows={5}
              placeholder="Lorem ipsum dolor sit amet consectetur. Donec cursus eget malesuada tempor tincidunt eget condimentum. Fermentum quis dapibus eu eu sem nullam rutrum. Ornare sed urna condimentum viverra pretium."
              className="w-full resize-none rounded-lg border border-gray-100 bg-[#FAFAFA] px-4 py-3.5 text-sm outline-none transition-colors focus:border-[#FF76C3] focus:bg-white focus:ring-1 focus:ring-[#FF76C3]"
            />
          </div>

          <div className="flex justify-center">
            <button className="rounded-md bg-[#FF76C3] px-10 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105 hover:bg-[#FF4D91]">
              Gửi Lời Chúc
            </button>
          </div>
        </div>

        {/* =====================================================
            BỘ LỌC
        ====================================================== */}
        <div className="mb-6 flex justify-start">
          <div className="relative">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none rounded-md border border-gray-200 bg-white px-5 py-2.5 pr-10 text-sm font-bold text-gray-800 outline-none shadow-sm focus:border-[#0070F3]"
            >
              <option value="Mới nhất">Mới nhất</option>
              <option value="Cũ nhất">Cũ nhất</option>
              <option value="Nhiều tương tác">Nhiều tương tác</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* =====================================================
            DANH SÁCH LỜI CHÚC (MASONRY GRID LÀM PHẲNG)
        ====================================================== */}
        {/* CSS columns tạo hiệu ứng xếp khít thác nước */}
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {MOCK_MESSAGES.map((msg) => (
            <div
              key={msg.id}
              className={`relative mb-6 break-inside-avoid flex flex-col justify-between p-6 rounded-none shadow-none transition-transform hover:-translate-y-1 ${
                msg.bgColor === "blue" ? "bg-[#9CE2FF]" : "bg-[#FFCBE8]"
              }`}
            >
              {/* Ngôi sao trang trí */}
              {msg.decorationStar !== "none" && (
                <div className="absolute -right-4 -top-4 z-10 w-16 rotate-12 opacity-90">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                      stroke={msg.decorationStar === "pink" ? "#FF76C3" : "#0070F3"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Thông tin người gửi */}
              <div className="mb-4 flex items-center gap-3">
                {msg.avatar && (
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-300">
                     <Image src={msg.avatar} alt={msg.author} width={40} height={40} className="h-full w-full object-cover" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[15px] font-bold text-gray-900">{msg.author}</span>
                    {msg.hasGoldStar && (
                      <span className="text-yellow-400 text-sm">⭐</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 block">{msg.date}</span>
                </div>
              </div>

              {/* Nội dung */}
              <p className="mb-8 flex-grow text-[14px] leading-relaxed text-black font-medium">
                {msg.content}
              </p>

              {/* Reactions (Cảm xúc) */}
              <div className="flex flex-wrap justify-center gap-6">
                {MOCK_REACTIONS.map((reaction, index) => (
                  <button key={index} className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
                    <span className="text-[22px] leading-none">{reaction.emoji}</span>
                    <span className="text-[11px] font-bold text-gray-800">{reaction.count}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* =====================================================
            PHÂN TRANG (PAGINATION)
        ====================================================== */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded bg-[#00A3FF] text-white transition-colors hover:bg-[#0070F3]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button className="flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-gray-700 hover:bg-white hover:shadow-sm transition-all">1</button>
          <button className="flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-gray-700 hover:bg-white hover:shadow-sm transition-all">2</button>
          <button className="flex h-8 w-8 items-center justify-center rounded bg-[#0F0F4F] text-sm font-bold text-white shadow-md">3</button>
          <button className="flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-gray-700 hover:bg-white hover:shadow-sm transition-all">4</button>
          <button className="flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-gray-700 hover:bg-white hover:shadow-sm transition-all">5</button>

          <button className="flex h-8 w-8 items-center justify-center rounded bg-[#FF76C3] text-white transition-colors hover:bg-[#FF4D91]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>
    </main>
  );
}