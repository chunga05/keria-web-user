"use client";

import React from "react";

export default function FacebookFeed() {
  return (
    <section 
      className="
        flex 
        w-full 
        justify-center 
        bg-[#f5f5f5] 
        px-8           /* Khoảng cách 2 bên trên mobile */
        md:px-16       /* Khoảng cách 2 bên trên PC */
        pb-16          /* Khoảng cách phía DƯỚI trên mobile */
        md:pb-20       /* Khoảng cách phía DƯỚI trên PC */
        pt-[clamp(80px,10vw,160px)] /* Khoảng cách phía TRÊN (Tự động co giãn từ 80px đến 160px) */
      "
    >
      
      {/* VỎ BỌC BÊN NGOÀI */}
      <div 
        className="
          relative 
          w-full 
          max-w-[500px] 
          overflow-hidden 
          rounded-2xl 
          bg-white 
          shadow-[0_8px_30px_rgba(0,0,0,0.06)] 
          transition-shadow 
          duration-300 
          hover:shadow-[0_8px_30px_rgba(0,159,227,0.12)]
        "
      >
        {/* Dải gradient trang trí phía trên cùng */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#009FE3] to-[#F45BA9]"></div>
        
        {/* IFRAME CỦA BẠN */}
        <div className="w-full bg-white">
          <iframe
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fdearkeriavn&tabs=timeline&width=500&height=700&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false&appId"
            width="100%"
            height="700"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            loading="lazy"
            title="Facebook Timeline DearKeriaVN"
          />
        </div>

      </div>
    </section>
  );
}