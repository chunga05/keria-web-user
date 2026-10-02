"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
// Import Server Action
import { getCachedVideos } from "@/app/actions/video";
import { getMediaUrl } from "@/lib/utils";

interface VideoYoutubeProps {
  className?: string;
  videoId?: string;
  title?: string;
}

interface VideoItem {
  id: number | string;
  media_url: string;
  title?: string | null;
}

export default function VideoYoutube({
  className = "",
  videoId,
  title,
}: VideoYoutubeProps) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Tham chiếu các thẻ video html5 để tạm dừng khi người dùng chuyển slide
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // =========================================================
  // LOAD VIDEO (Redis Cache)
  // =========================================================
  useEffect(() => {
    let cancelled = false;

    const fetchVideos = async () => {
      setLoading(true);
      try {
        const data = await getCachedVideos();
        if (!cancelled) {
          setVideos(data || []);
        }
      } catch (error) {
        console.error("❌ Không thể tải video:", error);
        if (!cancelled) {
          setVideos([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchVideos();

    return () => {
      cancelled = true;
    };
  }, []);

  // Tự động tạm dừng các video HTML5 khi đổi slide
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([key, videoEl]) => {
      if (videoEl && key !== String(videos[currentIndex]?.id)) {
        videoEl.pause();
      }
    });
  }, [currentIndex, videos]);

  // =========================================================
  // PHÂN LOẠI MEDIA: YOUTUBE HAY VIDEO FILE (TẢI TỪ MÁY)
  // =========================================================
  const extractYoutubeId = (url: string) => {
    if (!url) return null;

    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname.includes("youtube.com")) {
        const videoId = parsedUrl.searchParams.get("v");
        if (videoId && videoId.length === 11) return videoId;

        const embedMatch = parsedUrl.pathname.match(
          /\/embed\/([a-zA-Z0-9_-]{11})/
        );
        if (embedMatch) return embedMatch[1];

        const shortsMatch = parsedUrl.pathname.match(
          /\/shorts\/([a-zA-Z0-9_-]{11})/
        );
        if (shortsMatch) return shortsMatch[1];
      }

      if (parsedUrl.hostname === "youtu.be") {
        const id = parsedUrl.pathname.replace("/", "").split("/")[0];
        if (id.length === 11) return id;
      }
    } catch {
      return null;
    }

    return null;
  };

  // Nhận diện file video từ máy (mp4, webm, mkv, mov hoặc link Supabase Storage)
  const isDirectVideoFile = (url: string) => {
    if (!url) return false;
    const cleanUrl = url.split("?")[0].toLowerCase();
    const isExtensionMatch = /\.(mp4|webm|ogg|mov|mkv)$/i.test(cleanUrl);
    const isStorageVideo = (url.includes("/storage/v1/object/public/") || url.includes(".r2.dev") || url.includes(".r2.cloudflarestorage.com")) && !/\.(jpg|jpeg|png|webp|gif)$/i.test(cleanUrl);
    return isExtensionMatch || isStorageVideo;
  };

  // =========================================================
  // CONTROLS
  // =========================================================
  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? videos.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === videos.length - 1 ? 0 : prev + 1
    );
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <div
        className={`
          relative
          w-full
          aspect-[1440/900]
          bg-[#f3f4f6]
          flex
          items-center
          justify-center
          [container-type:inline-size]
          ${className}
        `}
      >
        <p className="text-gray-500 text-[1.2cqw]">
          Đang tải video...
        </p>
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  const currentVideo = videos[currentIndex];

  return (
    <div
      className={`
        relative
        w-full
        bg-[#f3f4f6]
        flex-shrink-0
        overflow-visible
        [container-type:inline-size]
        flex flex-col items-center py-[60px] pb-[80px]
        md:block md:aspect-[1440/800] md:py-0
        ${className}
      `}
    >
      {/* =====================================================
          KHUNG NỘI DUNG
      ===================================================== */}
      <div className="md:absolute md:inset-0 z-10 flex flex-col items-center w-full">

        {/* FRAME LED TRÀNG TIỀN */}
        <div
          className="
            relative md:absolute
            mb-[24px] md:mb-0
            w-[50%] sm:w-[40%] md:w-[20%]
            md:top-[10%] md:left-[40%]
            z-20
            flex
            justify-center
          "
        >
          <Image
            src="/images/Frame 964.png"
            alt="LED Tràng Tiền"
            width={180}
            height={60}
            priority
            sizes="20vw"
            className="
              w-full
              h-auto
              drop-shadow-md
            "
          />
        </div>

        {/* =================================================
            SLIDESHOW CONTAINER (MÀN HÌNH LED)
        ================================================= */}
        <div
          className="
            relative md:absolute
            w-[90%] sm:w-[80%] md:w-[45%]
            aspect-[3/4] md:aspect-video
            md:top-[25%] md:left-[27.5%]
            z-10
          "
        >
          {/* Vỏ bọc màn hình cắt tràn góc viền */}
          <div
            className="
              relative
              w-full
              h-full
              overflow-hidden
              rounded-[16px] md:rounded-[1cqw]
              bg-black
              shadow-2xl
            "
          >
            {/* Dải trượt slideshow (translateX) */}
            <div
              className="
                flex
                w-full
                h-full
                transition-transform
                duration-500
                ease-out
              "
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {videos.map((vid, idx) => {
                const vidId = extractYoutubeId(vid.media_url);
                const isLocalVideo = isDirectVideoFile(vid.media_url);
                const isCurrent = idx === currentIndex;

                return (
                  <div
                    key={vid.id}
                    className="
                      relative
                      w-full
                      h-full
                      flex-shrink-0
                      bg-black
                    "
                  >
                    {/* TRƯỜNG HỢP 1: LINK YOUTUBE */}
                    {vidId ? (
                      <iframe
                        className="w-full h-full border-0"
                        src={`https://www.youtube.com/embed/${vidId}?rel=0&playsinline=1`}
                        title={vid.title || `Video ${idx + 1}`}
                        allow="
                          accelerometer;
                          autoplay;
                          clipboard-write;
                          encrypted-media;
                          gyroscope;
                          picture-in-picture;
                          web-share
                        "
                        allowFullScreen
                      />
                    ) : isLocalVideo ? (
                      /* TRƯỜNG HỢP 2: FILE VIDEO TỪ MÁY / STORAGE */
                      <video
                        ref={(el) => {
                          videoRefs.current[String(vid.id)] = el;
                        }}
                        src={getMediaUrl(vid.media_url)}
                        controls
                        playsInline
                        webkit-playsinline="true"
                        preload="metadata"
                        className="w-full h-full object-cover bg-black"
                      >
                        Trình duyệt không hỗ trợ phát video này.
                      </video>
                    ) : (
                      /* TRƯỜNG HỢP 3: LINK LỖI HOẶC KHÔNG PHẢI VIDEO */
                      <div className="w-full h-full flex items-center justify-center text-white text-[1cqw]">
                        Link video không hợp lệ
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Indicator */}
          {videos.length > 1 && (
            <div className="flex justify-center items-center gap-1.5 mt-2">
              {videos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Chuyển đến video ${i + 1}`}
                  className={`
                    h-[0.5cqw] min-h-[4px] rounded-full transition-all duration-300
                    ${
                      i === currentIndex
                        ? "w-[1.8cqw] min-w-[16px] bg-red-600"
                        : "w-[0.5cqw] min-w-[4px] bg-gray-300 hover:bg-gray-400"
                    }
                  `}
                />
              ))}
            </div>
          )}
        </div>

        {/* NÚT PREV */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Video trước"
          className="
            absolute
            top-[45%] md:top-[43%]
            -translate-y-1/2 md:translate-y-0
            left-[2%] md:left-[18%]
            w-[36px] md:w-[3cqw]
            h-[36px] md:h-[3cqw]
            min-w-[28px]
            min-h-[28px]
            rounded-full
            bg-white
            shadow-lg
            z-30
            flex
            items-center
            justify-center
            cursor-pointer
            hover:bg-gray-200
            hover:scale-110
            active:scale-95
            transition-all
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-[45%] h-[45%]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        {/* NÚT NEXT */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Video tiếp theo"
          className="
            absolute
            top-[45%] md:top-[43%]
            -translate-y-1/2 md:translate-y-0
            right-[2%] md:right-[18%]
            w-[36px] md:w-[3cqw]
            h-[36px] md:h-[3cqw]
            min-w-[28px]
            min-h-[28px]
            rounded-full
            bg-white
            shadow-lg
            z-30
            flex
            items-center
            justify-center
            cursor-pointer
            hover:bg-gray-200
            hover:scale-110
            active:scale-95
            transition-all
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-[45%] h-[45%]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>

        {/* TITLE */}
        {currentVideo?.title && (
          <h3
            key={currentVideo.id}
            className="
              relative md:absolute
              mt-[24px] md:mt-0
              w-[90%] md:w-[70%]
              md:bottom-[15%] md:left-[15%]
              text-center
              text-[16px] md:text-[2cqw]
              font-semibold
              text-[#1F2937]
              leading-tight
              z-20
              transition-opacity
              duration-300
            "
          >
            {currentVideo.title}
          </h3>
        )}
      </div>

      {/* VÁCH NGĂN */}
      <div
        className="
          absolute
          bottom-0 md:bottom-[-6.25%]
          translate-y-[60%] md:translate-y-0
          left-0
          w-full
          z-50
          flex
          items-end
          pointer-events-none
        "
      >
        <Image
          src="/images/vachngan4.png"
          alt="Vách ngăn giấy rách"
          width={1440}
          height={100}
          sizes="100vw"
          className="
            w-full
            h-auto
            object-cover
            object-bottom
            drop-shadow-md
          "
        />
      </div>
    </div>
  );
}