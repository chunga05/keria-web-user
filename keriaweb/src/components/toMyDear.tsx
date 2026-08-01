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
  avatar?: string; // Nếu có avatar thì hiển thị, không có thì chỉ hiện text
  hasGoldStar?: boolean; // Dành cho tài khoản đặc biệt (Ryu Minseok)
  decorationStar?: "blue" | "pink" | "none"; // Ngôi sao trang trí ở góc
}

// ============================================================================
// DỮ LIỆU MẪU (MOCK DATA) ĐỂ HIỂN THỊ GIAO DIỆN
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
    avatar: "/images/avatar-placeholder.png", // Bạn có thể thay bằng link ảnh thật
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
];

const MOCK_REACTIONS: Reaction[] = [
  { emoji: "😭", count: 100 },
  { emoji: "😮", count: 1000 },
  { emoji: "🥺", count: 999 },
  { emoji: "🥰", count: 1410 },
];

export default function ToMyDearestPage() {
  const [filter, setFilter] = useState("Mới nhất");

  return (
    // Background toàn trang màu xanh nhạt
    <main className="min-h-screen bg-[#EAF4FF] pb-20 pt-10 font-sans">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
        
        {/* =====================================================
            PHẦN TIÊU ĐỀ
        ====================================================== */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 inline-block rounded-xl bg-[#0070F3] px-8 py-3 shadow-sm">
            <h1 className="text-3xl font-black uppercase tracking-wider text-white md:text-4xl">
              TO MY DEAREST.
            </h1>
          </div>
          <h2 className="mb-8 text-lg font-bold text-gray-800 md:text-xl">
            💕 LỜI CHÚC MỪNG SINH NHẬT TỚI KERIA 💕
          </h2>
        </div>

        {/* =====================================================
            FORM NHẬP LỜI CHÚC
        ====================================================== */}
        <div className="mx-auto mb-10 w-full max-w-4xl rounded-2xl bg-white p-6 shadow-sm md:p-10">
          {/* Tên người gửi */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">Tên người gửi</label>
            <input
              type="text"
              placeholder="Name"
              className="w-full rounded-md border-none bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-transparent focus:ring-[#FF76C3]"
            />
          </div>

          {/* Nội dung lời chúc */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">Viết lời chúc mừng sinh nhật tới Keria</label>
            <textarea
              rows={4}
              placeholder="Lorem ipsum dolor sit amet consectetur. Donec cursus eget malesuada tempor tincidunt eget condimentum. Fermentum quis dapibus eu eu sem nullam rutrum. Ornare sed urna condimentum viverra pretium."
              className="w-full resize-none rounded-md border-none bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-transparent focus:ring-[#FF76C3]"
            />
          </div>

          {/* Nút gửi */}
          <div className="flex justify-center">
            <button className="rounded-md bg-[#FF76C3] px-8 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#FF4D91]">
              Gửi Lời Chúc
            </button>
          </div>
        </div>

        {/* =====================================================
            BỘ LỌC VÀ DANH SÁCH LỜI CHÚC (GRID)
        ====================================================== */}
        <div className="mb-6 flex justify-start">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 outline-none focus:border-[#0070F3]"
          >
            <option value="Mới nhất">Mới nhất</option>
            <option value="Cũ nhất">Cũ nhất</option>
            <option value="Nhiều tương tác">Nhiều tương tác</option>
          </select>
        </div>

        {/* Lưới các thẻ lời chúc */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_MESSAGES.map((msg) => (
            <div
              key={msg.id}
              className={`relative flex flex-col justify-between rounded-xl p-6 shadow-sm transition-transform hover:-translate-y-1 ${
                msg.bgColor === "blue" ? "bg-[#94CFFE]" : "bg-[#FFC4E1]"
              }`}
            >
              {/* Ngôi sao trang trí góc trên phải */}
              {msg.decorationStar !== "none" && (
                <div className="absolute -right-4 -top-4 z-10 w-12 rotate-12 opacity-80">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                      stroke={msg.decorationStar === "pink" ? "#FF4D91" : "#0070F3"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Thông tin người gửi */}
              <div className="mb-4 flex items-center gap-3">
                {msg.avatar && (
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-300">
                    <div className="flex h-full w-full items-center justify-center bg-gray-400 text-xs text-white">Avt</div>
                    {/* Thay thẻ div trên bằng Image khi bạn có link thật */}
                    {/* <Image src={msg.avatar} alt={msg.author} width={40} height={40} className="object-cover" /> */}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-900">{msg.author}</span>
                    {msg.hasGoldStar && (
                      <span className="text-yellow-400">⭐</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-600">{msg.date}</span>
                </div>
              </div>

              {/* Nội dung text */}
              <p className="mb-6 flex-grow text-sm leading-relaxed text-gray-800">
                {msg.content}
              </p>

              {/* Reactions (Cảm xúc) */}
              <div className="flex flex-wrap justify-center gap-4">
                {MOCK_REACTIONS.map((reaction, index) => (
                  <button key={index} className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
                    <span className="text-xl leading-none">{reaction.emoji}</span>
                    <span className="text-[10px] font-medium text-gray-700">{reaction.count}</span>
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
          {/* Nút Prev (Màu xanh) */}
          <button className="flex h-8 w-8 items-center justify-center rounded bg-[#00A3FF] text-white transition-colors hover:bg-[#0070F3]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Các số trang */}
          <button className="flex h-8 w-8 items-center justify-center rounded text-sm font-medium text-gray-600 hover:bg-gray-200">1</button>
          <button className="flex h-8 w-8 items-center justify-center rounded text-sm font-medium text-gray-600 hover:bg-gray-200">2</button>
          
          {/* Trang đang chọn (Active) */}
          <button className="flex h-8 w-8 items-center justify-center rounded bg-[#0F0F4F] text-sm font-bold text-white">3</button>
          
          <button className="flex h-8 w-8 items-center justify-center rounded text-sm font-medium text-gray-600 hover:bg-gray-200">4</button>
          <button className="flex h-8 w-8 items-center justify-center rounded text-sm font-medium text-gray-600 hover:bg-gray-200">5</button>

          {/* Nút Next (Màu hồng) */}
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