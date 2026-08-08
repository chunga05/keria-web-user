import React from 'react';
import Image from 'next/image';

interface VideoYoutubeProps {
  videoId: string;
  title?: string;
  className?: string;
}

export default function VideoYoutube({
  videoId,
  title = "YouTube video player",
  className = ""
}: VideoYoutubeProps) {
  return (
    <div
      className={`relative w-full z-0 flex-1 pt-[clamp(80px,8vw,120px)] pb-32 px-6 md:px-16 bg-[#f3f4f6] flex flex-col justify-center ${className}`}
    >
      
      {/* Khung chứa dùng flex-col để xếp dọc các phần tử */}
      <div className="relative w-full max-w-4xl mx-auto z-10 flex flex-col items-center">

        {/* FRAME LED TRÀNG TIỀN */}
        <div
          className="
            relative
            z-20
            pointer-events-none
            w-[45%]
            mb-[clamp(30px,4vw,60px)] /* ĐÃ TĂNG KHOẢNG CÁCH MẠNH HƠN ĐỂ CÁCH XA VIDEO */
          "
        >
          <Image
            src="/images/Frame 964.png"
            alt="LED Tràng Tiền"
            width={180}
            height={60}
            className="w-full h-auto drop-shadow-md"
          />
        </div>

        {/* VIDEO */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

      </div>
      
      {/* 
        
      */}
      <div className="absolute bottom-0 left-0 w-full z-50 flex items-end translate-y-[55%] pointer-events-none">
        <Image 
          src="/images/vachngan4.png" 
          alt="Vách ngăn giấy rách" 
          width={1440} 
          height={100} 
          className="w-full h-auto object-cover drop-shadow-md object-bottom"
        />
      </div>
    </div>
  );
}