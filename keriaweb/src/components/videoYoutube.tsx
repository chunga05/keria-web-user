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
      className={`relative w-full flex-1 pt-50 pb-32 px-6 md:px-16 bg-gray-100 shadow-lg flex flex-col justify-center ${className}`}
    >
      
      <div className="relative w-full max-w-4xl mx-auto">

        {/* FRAME LED TRÀNG TIỀN */}
        <div
          className="
            absolute
            -top-30
            left-1/2
            -translate-x-1/2
            z-20
            pointer-events-none
            w-[45%]
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
      <div className="absolute -bottom-[4.9%] left-0 w-full z-50 flex items-end translate-y-[1px]">
              <Image 
                src="/images/vachngan4.png" 
                alt="Vách ngăn giấy rách" 
                width={1440} 
                height={100} 
                className="w-full h-auto object-cover drop-shadow-md object-bottom pointer-events-none"
              />
            </div>
    </div>
  );
}