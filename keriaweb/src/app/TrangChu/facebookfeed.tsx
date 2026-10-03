"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getFacebookLinksCached } from "../actions/facebook";

type FacebookLink = {
  id: string;
  title: string;
  url: string;
  thumbnail_url: string | null;
  created_at: string;
};

// ============================================================
// COMPONENT CON: Card đồng nhất — thumbnail cố định + tiêu đề + nút xem
// ============================================================
function FacebookCard({
  link,
  totalLinks,
}: {
  link: FacebookLink;
  totalLinks: number;
}) {
  const thumbnail = link.thumbnail_url || "/images/Frame 1495 (2).png";

  const formattedDate = link.created_at
    ? new Date(link.created_at).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  return (
    <article
      className={`
        relative
        min-w-0
        shrink-0
        snap-start
        flex
        flex-col
        overflow-hidden
        rounded-2xl
        bg-white
        shadow-[0_8px_30px_rgba(0,0,0,0.06)]
        transition-shadow
        duration-300
        hover:shadow-[0_8px_30px_rgba(0,159,227,0.18)]
        ${
          totalLinks === 1
            ? "w-full max-w-[420px]"
            : "w-full md:w-[calc((100%-1.5rem)/2)] xl:w-[calc((100%-4rem)/3)]"
        }
      `}
    >
      {/* Thanh gradient đầu card */}
      <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-[#009FE3] to-[#F45BA9]" />

      {/* Thumbnail cố định tỉ lệ 4:3 */}
      <div className="relative w-full" style={{ paddingBottom: "75%" }}>
        <Image
          src={thumbnail}
          alt={link.title || "Facebook post"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
          unoptimized={thumbnail.startsWith("http")}
        />
        {/* Badge Facebook icon */}
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#1877F2] shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </span>
      </div>

      {/* Nội dung */}
      <div className="flex flex-1 flex-col justify-between gap-3 px-5 py-4">
        {/* Tiêu đề */}
        {link.title && (
          <h3 className="line-clamp-3 text-[15px] font-semibold leading-snug text-gray-800">
            {link.title}
          </h3>
        )}

        {/* Footer: ngày + nút xem */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[12px] text-gray-400">{formattedDate}</span>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              items-center
              gap-1.5
              rounded-full
              bg-[#1877F2]
              px-4
              py-1.5
              text-[13px]
              font-semibold
              text-white
              transition-all
              duration-200
              hover:bg-[#1464d8]
              hover:shadow-[0_4px_12px_rgba(24,119,242,0.4)]
            "
          >
            Xem bài viết ↗
          </a>
        </div>
      </div>
    </article>
  );
}

// ============================================================
// COMPONENT CHÍNH
// ============================================================
export default function FacebookFeed() {
  const [links, setLinks] = useState<FacebookLink[]>([]);
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadFacebookLinks = async () => {
      setLoading(true);
      try {
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
        md:px-12
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

          {/* NÚT TRÁI */}
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
                left-0
                md:-left-6
                xl:-left-14
                ${links.length <= 3 ? "xl:hidden" : ""}
                ${links.length <= 2 ? "md:hidden" : ""}
              `}
            >
              ←
            </button>
          )}

          {/* SLIDER */}
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
            {links.map((link) => (
              <FacebookCard
                key={link.id}
                link={link}
                totalLinks={links.length}
              />
            ))}
          </div>

          {/* NÚT PHẢI */}
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
                right-0
                md:-right-6
                xl:-right-14
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