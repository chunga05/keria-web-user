"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useWishes } from "../../../hooks/usewishes"; 

export default function ToMyDearestPage() {
  const [filter, setFilter] = useState("Mới nhất");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [guestName, setGuestName] = useState("");
  const [wishContent, setWishContent] = useState("");

  // Gọi hook với idolId = 1 (hoặc số ID thực tế của bạn), lấy thêm totalPages
  const { messages, isLoading, isSubmitting, totalPages, userReactions, fetchWishes, submitWish, handleReact } = useWishes(1, 9);
  
  // Khi thay đổi BỘ LỌC -> Phải reset trang về 1
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Khi thay đổi TRANG hoặc BỘ LỌC -> Gọi API lấy dữ liệu mới
  useEffect(() => {
    fetchWishes(filter, currentPage);
  }, [filter, currentPage, fetchWishes]);

  const handleSend = () => {
    submitWish(guestName, wishContent, () => {
      setGuestName("");
      setWishContent("");
      // Đăng xong reset về trang 1 để thấy bài mới nhất
      setCurrentPage(1);
      fetchWishes("Mới nhất", 1); 
    });
  };

  const safeTotalPages = Math.max(1, totalPages);
  const pagesArray = Array.from({ length: safeTotalPages }, (_, i) => i + 1);

  return (
    <main className="min-h-screen bg-[#F4F5F7] pb-20 pt-20 font-sans">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
        
        {/* === PHẦN FORM NHẬP LỜI CHÚC (GIỮ NGUYÊN) === */}
        <div className="relative mx-auto mb-12 w-full max-w-4xl rounded-xl bg-white px-6 pb-12 pt-20 shadow-sm md:px-12">
          <div className="absolute -top-10 left-1/2 w-[280px] -translate-x-1/2 drop-shadow-md md:w-[461px]">
            <Image src="/images/tomydear.png" alt="To My Dearest" width={461} height={88} priority className="h-auto w-full object-contain" />
          </div>

          <h2 className="mb-10 text-center text-lg font-black text-black tracking-wide md:text-2xl">
            <span className="text-[#FF76C3]">♥</span> LỜI CHÚC MỪNG SINH NHẬT TỚI KERIA <span className="text-[#FF76C3]">♥</span>
          </h2>

          <div className="mb-8">
            <label className="mb-3 block text-sm font-bold text-gray-800">Tên người gửi</label>
            <input type="text" placeholder="Name" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full rounded-lg border border-gray-100 bg-[#FAFAFA] px-4 py-3.5 text-sm outline-none focus:border-[#FF76C3] focus:ring-1 focus:ring-[#FF76C3]" />
          </div>

          <div className="mb-10">
            <label className="mb-3 block text-sm font-bold text-gray-800">Viết lời chúc mừng sinh nhật tới Keria</label>
            <textarea rows={5} placeholder="Nhập lời chúc..." value={wishContent} onChange={(e) => setWishContent(e.target.value)} className="w-full resize-none rounded-lg border border-gray-100 bg-[#FAFAFA] px-4 py-3.5 text-sm outline-none focus:border-[#FF76C3] focus:ring-1 focus:ring-[#FF76C3]" />
          </div>

          <div className="flex justify-center">
            <button onClick={handleSend} disabled={isSubmitting} className={`rounded-md px-10 py-3 text-sm font-bold text-white shadow-sm transition-transform ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF76C3] hover:scale-105"}`}>
              {isSubmitting ? "Đang gửi..." : "Gửi Lời Chúc"}
            </button>
          </div>
        </div>

        {/* === PHẦN BỘ LỌC (GIỮ NGUYÊN) === */}
        <div className="mb-6 flex justify-start">
          <div className="relative">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="appearance-none rounded-md border border-gray-200 bg-white px-5 py-2.5 pr-10 text-sm font-bold text-gray-800 outline-none shadow-sm focus:border-[#0070F3]">
              <option value="Mới nhất">Mới nhất</option>
              <option value="Cũ nhất">Cũ nhất</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {/* === DANH SÁCH LỜI CHÚC === */}
        {isLoading ? (
          <div className="flex justify-center py-20"><span className="text-gray-500 font-bold">Đang tải lời chúc...</span></div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center py-20"><span className="text-gray-500 font-bold">Chưa có lời chúc nào.</span></div>
        ) : (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`relative mb-6 break-inside-avoid flex flex-col justify-between p-6 transition-transform hover:-translate-y-1 ${msg.bgColor === "blue" ? "bg-[#9CE2FF]" : "bg-[#FFCBE8]"}`}>
                {msg.decorationStar !== "none" && (
                  <div className="absolute -right-4 -top-4 z-10 w-16 rotate-12 opacity-90">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={msg.decorationStar === "pink" ? "#FF76C3" : "#0070F3"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}

                <div className="mb-4 flex items-center gap-3">
                  
                  {/* === BỌC AVATAR VÀ KHUNG VÀO ĐÂY === */}
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                    
                    {/* Render ảnh Khung lấy thẳng từ Database (nếu có) */}
                    {msg.frameUrl && (
                      <div className="absolute -inset-2 z-10 pointer-events-none">
                        <Image 
                          src={msg.frameUrl} 
                          alt="avatar-frame" 
                          fill 
                          className="object-contain" 
                        />
                      </div>
                    )}

                    {/* Render Avatar gốc */}
                    {msg.avatar && (
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-300">
                        <Image src={msg.avatar} alt={msg.author} width={40} height={40} className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                  {/* ================================== */}

                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-[15px] font-bold text-gray-900">{msg.author}</span>
                      {msg.hasGoldStar && <span className="text-yellow-400 text-sm">⭐</span>}
                    </div>
                    <span className="text-xs text-gray-600 block">{msg.date}</span>
                  </div>
                </div>

                <p className="mb-8 flex-grow text-[14px] leading-relaxed text-black font-medium break-words">
                  {msg.content}
                </p>

                <div className="flex flex-wrap justify-center gap-6">
                  {msg.reactions.map((reaction: any, index: number) => {
                    const hasReacted = userReactions[msg.id]?.includes(reaction.type);
                    
                    return (
                      <button 
                        key={index} 
                        onClick={() => handleReact(msg.id, reaction.type, reaction.count)} 
                        className={`flex flex-col items-center gap-1 transition-all p-1.5 rounded-lg
                          ${hasReacted 
                            ? "bg-white/50 scale-110 shadow-sm"
                            : "hover:scale-125 active:scale-95"
                          }`}
                      >
                        <span className="text-[22px] leading-none">{reaction.emoji}</span>
                        <span className={`text-[11px] font-bold ${hasReacted ? "text-pink-600" : "text-gray-800"}`}>
                          {reaction.count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

       
        {/* =====================================================
            PHÂN TRANG (PAGINATION) - MÀU XANH HỒNG CỐ ĐỊNH
        ====================================================== */}
        {!isLoading && (
          <div className="mt-12 flex items-center justify-center gap-6">
            
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className={`flex h-8 w-8 items-center justify-center rounded bg-[#00A3FF] text-white shadow-sm transition-all
                ${currentPage <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#0070F3] hover:scale-105"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <div className="flex gap-2 mx-2">
              {pagesArray.map((pageNum) => (
                <button 
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded text-sm font-bold shadow-sm transition-all
                    ${currentPage === pageNum 
                      ? "bg-[#0F0F4F] text-white" 
                      : "bg-transparent hover:bg-white text-gray-700 hover:shadow-sm"}`} 
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(safeTotalPages, prev + 1))}
              disabled={currentPage >= safeTotalPages}
              className={`flex h-8 w-8 items-center justify-center rounded bg-[#FF76C3] text-white shadow-sm transition-all 
                ${currentPage >= safeTotalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-[#FF4D91] hover:scale-105"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

          </div>
        )}

      </div>
    </main>
  );
}