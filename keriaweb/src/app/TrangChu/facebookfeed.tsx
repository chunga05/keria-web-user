"use client";

import React, { useEffect, useRef, useState } from "react";
// 1. Import hàm Server Action thay vì gọi Supabase trực tiếp
import { getFacebookLinksCached } from "../actions/facebook";

type FacebookLink = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

export default function FacebookFeed() {
  const [links, setLinks] = useState<FacebookLink[]>([]);
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadFacebookLinks = async () => {
      setLoading(true);
      try {
        // 2. Gọi qua Server Action (Server sẽ lo việc check Redis hoặc Supabase)
        const data = await getFacebookLinksCached();
        setLinks(data || []);
      } catch (error) {
        console.error("❌ Lỗi lấy Facebook links:", error);
        setLinks([]);
      } finally {
        setLoading(false);
      }
    };

    loadFacebookLinks();
  }, []);

  const scrollLeft = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: -sliderRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: sliderRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="
        w-full
        bg-[#f5f5f5]
        px-4
        sm:px-8
        md:px-12    /* Đảm bảo có lề trên laptop nhỏ */
        xl:px-16    
        pb-16
        md:pb-20
        pt-[clamp(80px,10vw,160px)]
      "
    >
      {loading ? (
        <div className="flex w-full justify-center">
          <p className="text-gray-500">Đang tải...</p>
        </div>
      ) : links.length === 0 ? (
        <div className="flex w-full justify-center">
          <p className="text-gray-500">Chưa có bài viết Facebook.</p>
        </div>
      ) : (
        <div className="relative mx-auto w-full max-w-[1400px]">
          
          {/* =================================================
              NÚT TRÁI
          ================================================= */}
          {links.length > 1 && (
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Xem bài viết trước"
              className={`
                absolute
                z-40
                top-1/2
                -translate-y-1/2
                flex
                h-10 w-10 sm:h-12 sm:w-12
                items-center
                justify-center
                rounded-full
                bg-white
                text-xl sm:text-2xl
                font-semibold
                text-gray-700
                shadow-[0_5px_20px_rgba(0,0,0,0.15)]
                transition-all
                duration-300
                hover:scale-110
                hover:bg-[#009FE3]
                hover:text-white
                
                /* ĐỊNH VỊ CỐ ĐỊNH, KHÔNG DÙNG % ĐỂ TRÁNH TRÀN MÀN HÌNH */
                left-0             /* Mobile: Nằm đè lên cạnh trái */
                md:-left-6         /* Tablet/Laptop nhỏ: Lùi ra ngoài một chút */
                xl:-left-14        /* PC to: Lùi hẳn ra ngoài */

                /* Ẩn nút thông minh dựa trên số cột đang hiển thị */
                ${links.length <= 3 ? "xl:hidden" : ""} 
                ${links.length <= 2 ? "md:hidden" : ""} 
              `}
            >
              ←
            </button>
          )}

          {/* =================================================
              SLIDER
          ================================================= */}
          <div
            ref={sliderRef}
            className={`
              flex
              w-full
              gap-6
              xl:gap-8
              overflow-x-auto
              scroll-smooth
              snap-x
              snap-mandatory
              pb-4
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              ${links.length === 1 ? "justify-center" : ""}
            `}
          >
            {links.map((link) => {
              const facebookUrl = encodeURIComponent(link.url);

              return (
                <article
                  key={link.id}
                  className={`
                    relative
                    min-w-0
                    shrink-0
                    snap-start
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                    transition-shadow
                    duration-300
                    hover:shadow-[0_8px_30px_rgba(0,159,227,0.12)]
                    
                    /* CHIA CỘT THÍCH ỨNG (RESPONSIVE) */
                    ${links.length === 1 
                      ? "w-full max-w-[500px]" 
                      : "w-full md:w-[calc((100%-1.5rem)/2)] xl:w-[calc((100%-4rem)/3)]"
                    }
                  `}
                >
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#009FE3] to-[#F45BA9]" />

                  {link.title && (
                    <div className="px-5 py-4">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {link.title}
                      </h3>
                    </div>
                  )}

                  <div className="h-[600px] w-full overflow-y-auto overflow-x-hidden bg-white">
                    <iframe
                      src={`https://www.facebook.com/plugins/post.php?href=${facebookUrl}&show_text=true&width=500`}
                      width="500"
                      height="800"
                      style={{
                        border: "none",
                        display: "block",
                        width: "100%",
                        maxWidth: "500px",
                        margin: "0 auto",
                      }}
                      scrolling="no"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      loading="lazy"
                      title={`Facebook Post - ${link.title}`}
                    />
                  </div>
                </article>
              );
            })}
          </div>

          {/* =================================================
              NÚT PHẢI
          ================================================= */}
          {links.length > 1 && (
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Xem bài viết tiếp theo"
              className={`
                absolute
                z-40
                top-1/2
                -translate-y-1/2
                flex
                h-10 w-10 sm:h-12 sm:w-12
                items-center
                justify-center
                rounded-full
                bg-white
                text-xl sm:text-2xl
                font-semibold
                text-gray-700
                shadow-[0_5px_20px_rgba(0,0,0,0.15)]
                transition-all
                duration-300
                hover:scale-110
                hover:bg-[#F45BA9]
                hover:text-white
                
                /* ĐỊNH VỊ CỐ ĐỊNH, KHÔNG DÙNG % */
                right-0
                md:-right-6
                xl:-right-14

                /* Ẩn nút thông minh dựa trên số cột đang hiển thị */
                ${links.length <= 3 ? "xl:hidden" : ""} 
                ${links.length <= 2 ? "md:hidden" : ""} 
              `}
            >
              →
            </button>
          )}
        </div>
      )}
    </section>
  );
}