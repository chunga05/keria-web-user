"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Play,
} from "lucide-react";
import { isFeatureEnabled, FEATURES } from "@/config/features";
import UnderConstruction from "@/components/UnderConstruction";

// ============================================================
// TYPE
// ============================================================

type ContentRecord = {
  id: number;
  title: string;
  slug?: string | null;
  category: string;
  media_url?: string | null;
  is_video?: boolean | null;
  content?: string | null;
  created_at?: string | null;
};

// ============================================================
// TABS
// ============================================================

const TABS = [
  {
    label: "Tất Cả",
    value: "all",
  },
  {
    label: "LED",
    value: "led",
  },
  {
    label: "Thiện Nguyện",
    value: "charity",
  },
  {
    label: "Give Away",
    value: "giveaway",
  },
  {
    label: "Offline Event",
    value: "offline",
  },
];

// ============================================================
// SECTIONS
// ============================================================

const SECTIONS = [
  {
    id: "led",
    title: "🖥️ LED 🖥️",
    category: "led",
    color: "blue",
  },
  {
    id: "charity",
    title: "💝 Thiện Nguyện 💝",
    category: "charity",
    color: "pink",
  },
  {
    id: "giveaway",
    title: "🎁 Give Away 🎁",
    category: "giveaway",
    color: "blue",
  },
  {
    id: "offline",
    title: "☕ Offline Event ☕",
    category: "offline",
    color: "pink",
  },
];

// ============================================================
// DESIGN SIZE
// Toàn bộ giao diện bên trong lấy 1200px làm chuẩn
// ============================================================

const DESIGN_WIDTH = 1200;

// ============================================================
// HELPER - FORMAT DATE
// ============================================================

function formatDate(date?: string | null) {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ============================================================
// HELPER - YOUTUBE
// ============================================================

function getYoutubeVideoId(url?: string | null) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    const hostname = parsedUrl.hostname
      .toLowerCase()
      .replace("www.", "");

    // youtube.com/watch?v=xxxxx
    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com"
    ) {
      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) {
        return videoId;
      }

      // youtube.com/shorts/xxxxx
      const shortsMatch = parsedUrl.pathname.match(
        /\/shorts\/([^/?]+)/
      );

      if (shortsMatch?.[1]) {
        return shortsMatch[1];
      }

      // youtube.com/embed/xxxxx
      const embedMatch = parsedUrl.pathname.match(
        /\/embed\/([^/?]+)/
      );

      if (embedMatch?.[1]) {
        return embedMatch[1];
      }
    }

    // youtu.be/xxxxx
    if (hostname === "youtu.be") {
      const videoId = parsedUrl.pathname
        .replace(/^\/+/, "")
        .split("?")[0]
        .split("&")[0];

      if (videoId) {
        return videoId;
      }
    }

    return null;
  } catch {
    return null;
  }
}

// ============================================================
// HELPER - YOUTUBE EMBED URL
// ============================================================

function getYoutubeEmbedUrl(url?: string | null) {
  const videoId = getYoutubeVideoId(url);

  if (!videoId) {
    return "";
  }

  return `https://www.youtube.com/embed/${videoId}?rel=0`;
}

// ============================================================
// HELPER - IS YOUTUBE
// ============================================================

function isYoutubeUrl(url?: string | null) {
  return Boolean(getYoutubeVideoId(url));
}

// ============================================================
// HELPER - IS DIRECT VIDEO
// ============================================================

function isDirectVideo(url?: string | null) {
  if (!url) return false;

  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);
}

// ============================================================
// COMPONENT
// ============================================================

export default function ProjectPage() {
  const isEnabled = isFeatureEnabled(FEATURES.SUPPORTING_PROJECT);
  const router = useRouter();

  // ==========================================================
  // TAB
  // ==========================================================

  const [activeTab, setActiveTab] = useState("all");

  // ==========================================================
  // CONTENT
  // ==========================================================

  const [contents, setContents] = useState<ContentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // CAROUSEL REFS & SCROLL
  // ==========================================================

  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollSection = (category: string, direction: "prev" | "next") => {
    const el = carouselRefs.current[category];
    if (!el) return;

    const firstCard = el.querySelector<HTMLElement>(":scope > div");
    const cardWidth = firstCard ? firstCard.offsetWidth : 280;
    const gap = 20;
    const scrollAmount = cardWidth + gap;

    if (direction === "next") {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 15) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    } else {
      if (el.scrollLeft <= 15) {
        el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
      } else {
        el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  // ==========================================================
  // LOAD CONTENT
  // ==========================================================

  useEffect(() => {
    if (!isEnabled) {
      setLoading(false);
      return;
    }

    const loadContents = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/content", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `API trả về HTTP ${response.status}`
          );
        }

        const result = await response.json();

        console.log("CONTENT API:", result);

        setContents(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (error) {
        console.error(
          "❌ Lỗi tải content:",
          error
        );

        setContents([]);
      } finally {
        setLoading(false);
      }
    };

    loadContents();
  }, []);

  // ==========================================================
  // FILTER BY CATEGORY
  // ==========================================================

  const getSectionContents = (category: string) => {
    return contents.filter(
      (item) =>
        item.category?.toLowerCase() ===
        category.toLowerCase()
    );
  };

  // ==========================================================
  // OPEN ARTICLE
  // ==========================================================

  const handleOpenArticle = (
    item: ContentRecord
  ) => {
    if (!item.slug) {
      console.warn(
        "⚠️ Bài viết chưa có slug:",
        item
      );

      return;
    }

    router.push(
      `/content/${encodeURIComponent(item.slug)}`
    );
  };

  // ==========================================================
  // CARD
  // ==========================================================

  const renderCard = (
    item: ContentRecord
  ) => {
    const youtube =
      Boolean(item.is_video) &&
      isYoutubeUrl(item.media_url);

    const directVideo =
      Boolean(item.is_video) &&
      isDirectVideo(item.media_url);

    return (
      <article
        key={item.id}
        onClick={() =>
          handleOpenArticle(item)
        }
        className="
          group/card
          flex
          min-w-0
          w-full
          cursor-pointer
          flex-col
          gap-2.5 sm:gap-3 lg:gap-[16px]
          select-none
        "
      >
        {/* ================================================= */}
        {/* MEDIA */}
        {/* ================================================= */}

        <div
          className="
            relative
            aspect-video
            w-full
            overflow-hidden
            bg-gray-200
            shadow-sm
            rounded-xl lg:rounded-[18px]
          "
        >
          {/* ================= YOUTUBE ================= */}

          {youtube ? (
            <div className="relative h-full w-full">
              <iframe
                src={getYoutubeEmbedUrl(
                  item.media_url
                )}
                title={item.title}
                className="
                  pointer-events-none
                  h-full
                  w-full
                "
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />

              {/* OVERLAY */}

              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  bg-black/10
                  transition-all
                  group-hover/card:bg-black/25
                "
              >
                <div
                  className="
                    flex
                    aspect-square
                    items-center
                    justify-center
                    rounded-full
                    bg-[#FF76C3]/90
                    text-white
                    shadow-lg
                    transition-transform
                    group-hover/card:scale-110
                    w-9 h-9 sm:w-10 sm:h-10 lg:w-[55px] lg:h-[55px]
                  "
                >
                  <Play
                    className="
                      fill-current
                      w-4 h-4 sm:w-5 sm:h-5 lg:w-[30px] lg:h-[30px]
                    "
                  />
                </div>
              </div>

              {/* LABEL */}

              <div
                className="
                  absolute
                  left-2 sm:left-2.5 lg:left-4
                  top-2 sm:top-2.5 lg:top-4
                  rounded-full
                  bg-red-600
                  px-2 sm:px-2.5 lg:px-4
                  py-0.5 sm:py-1 lg:py-2
                  font-semibold
                  text-white
                  shadow-md
                  text-[9px] sm:text-[10px] lg:text-[12px]
                "
              >
                YOUTUBE
              </div>
            </div>
          ) : directVideo ? (
            /* ================= DIRECT VIDEO ================= */

            <video
              src={item.media_url || ""}
              muted
              playsInline
              preload="metadata"
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-300
                group-hover/card:scale-105
              "
            />
          ) : item.media_url ? (
            /* ================= IMAGE ================= */

            <Image
              src={item.media_url}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 76vw, (max-width: 1024px) 45vw, 300px"
              className="
                object-cover
                transition-transform
                duration-300
                group-hover/card:scale-105
              "
            />
          ) : (
            /* ================= PLACEHOLDER ================= */

            <Image
              src="/images/placeholder-banner.jpg"
              alt={item.title}
              fill
              sizes="(max-width: 640px) 76vw, (max-width: 1024px) 45vw, 300px"
              className="
                object-cover
                transition-transform
                duration-300
                group-hover/card:scale-105
              "
            />
          )}

          {/* ================================================= */}
          {/* VIDEO LABEL */}
          {/* ================================================= */}

          {item.is_video && !youtube && (
            <div
              className="
                absolute
                left-2 sm:left-2.5 lg:left-4
                top-2 sm:top-2.5 lg:top-4
                rounded-full
                bg-black/65
                px-2 sm:px-2.5 lg:px-4
                py-0.5 sm:py-1 lg:py-2
                font-semibold
                text-white
                backdrop-blur-sm
                text-[9px] sm:text-[10px] lg:text-[12px]
              "
            >
              VIDEO
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* TITLE */}
        {/* ================================================= */}

        <h3
          className="
            line-clamp-2
            font-semibold
            leading-[1.4] sm:leading-[1.45]
            text-gray-800
            transition-colors
            group-hover/card:text-[#FF76C3]
            text-[13px] sm:text-sm lg:text-[15px]
          "
        >
          {item.title}
        </h3>

        {/* ================================================= */}
        {/* DATE */}
        {/* ================================================= */}

        {item.created_at && (
          <div
            className="
              flex
              items-center
              text-gray-400
              gap-1.5 sm:gap-2 lg:gap-[8px]
              text-[10px] sm:text-[11px] lg:text-[12px]
            "
          >
            <CalendarDays
              className="w-3.5 h-3.5 lg:w-[16px] lg:h-[16px] shrink-0"
            />

            <span>
              {formatDate(item.created_at)}
            </span>
          </div>
        )}
      </article>
    );
  };

  // ==========================================================
  // FEATURE FLAG GUARD
  // ==========================================================

  if (!isEnabled) {
    return (
      <UnderConstruction
        variant="page"
        featureName="Supporting Project"
        description="Chuyên mục các dự án tiếp sức đang được cập nhật. Chúng mình sẽ sớm mang đến cho các bạn những hoạt động thú vị nhất!"
        estimatedRelease="Dự kiến cập nhật trong thời gian tới"
        showBackButton={true}
        backButtonHref="/hoat-dong/loi-nhan"
      />
    );
  }

  // ==========================================================
  // MAIN
  // ==========================================================

  return (
    <main
      className="
        min-h-screen
        w-full
        bg-[#F8F9FC]
        pt-6 sm:pt-8 md:pt-10 lg:pt-12
        pb-12 sm:pb-16 md:pb-20
      "
    >
      {/* ====================================================== */}
      {/* OUTER SCALE CONTAINER                                  */}
      {/* ====================================================== */}

      <div
        className="
          mx-auto
          w-[92%]
          sm:w-[90%]
          lg:w-[92%]
          xl:w-full
          max-w-[1200px]
        "
      >
        {/* ==================================================== */}
        {/* DESIGN CANVAS                                        */}
        {/* ==================================================== */}

        <div
          className="
            relative
            w-full
          "
        >
          {/* ================================================= */}
          {/* HERO */}
          {/* ================================================= */}

          <section
            className="
              relative
              aspect-[4/5] min-h-[440px]
              sm:aspect-[16/9] sm:min-h-0
              w-full
              overflow-hidden
              bg-gray-900
              shadow-lg
              rounded-2xl lg:rounded-[18px]
            "
          >
            <Image
              src="/images/banner-project.jpg"
              alt="Project Banner"
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1200px"
              className="
                object-cover
                object-[54%_20%] sm:object-center
                opacity-95
              "
            />

            {/* OVERLAY */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t sm:bg-gradient-to-r
                from-black/90 sm:from-black/85
                via-black/50 sm:via-black/45
                to-black/10 sm:to-transparent
              "
            />

            {/* CONTENT */}

            <div
              className="
                absolute
                inset-0
                flex
                flex-col
                justify-end sm:justify-center
                px-5 sm:px-10 lg:px-[84px]
                pb-6 sm:pb-0
              "
            >
              <p
                className="
                  font-semibold
                  uppercase
                  tracking-[0.15em] sm:tracking-[0.2em]
                  text-[#FF76C3]
                  mb-1.5 sm:mb-2 lg:mb-[12px]
                  text-[11px] sm:text-xs lg:text-[14px]
                "
              >
                KERIA'S PROJECT
              </p>

              <h1
                className="
                  max-w-[95%] sm:max-w-[85%] lg:max-w-[65%]
                  font-extrabold
                  leading-[1.15] sm:leading-[1.1]
                  text-white
                  mb-2 sm:mb-3 lg:mb-[18px]
                  text-xl sm:text-2xl md:text-3xl lg:text-[42px] xl:text-[48px]
                "
              >
                Các dự án dành cho KERIA
              </h1>

              <p
                className="
                  max-w-[95%] sm:max-w-[80%] lg:max-w-[55%]
                  leading-[1.5] sm:leading-[1.6]
                  text-white/85 sm:text-white/80
                  mb-3.5 sm:mb-5 lg:mb-[24px]
                  text-xs sm:text-sm lg:text-[15px]
                  line-clamp-2 sm:line-clamp-none
                "
              >
                Cùng nhìn lại những hoạt động,
                sự kiện và dự án đặc biệt dành
                cho KERIA.
              </p>

              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById(
                      "project-list"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
                className="
                  w-fit
                  bg-[#FF76C3]
                  font-bold
                  text-white
                  shadow-md
                  transition-all
                  hover:scale-105
                  active:scale-95
                  hover:bg-[#FF4D91]
                  rounded-lg
                  px-4 py-2 sm:px-6 sm:py-2.5 lg:px-[36px] lg:py-[12px]
                  text-xs sm:text-sm lg:text-[14px]
                "
              >
                Xem Chi Tiết
              </button>
            </div>
          </section>

          {/* ================================================= */}
          {/* TABS */}
          {/* ================================================= */}

          <section
            className="
              flex
              items-center
              mt-6 sm:mt-8 lg:mt-[50px]
              mb-6 sm:mb-8 lg:mb-[50px]
              gap-2 sm:gap-2.5 lg:gap-[14px]
              overflow-x-auto
              pb-1 sm:pb-0
              sm:flex-wrap
              [&::-webkit-scrollbar]:hidden
              [-ms-overflow-style:none]
              [scrollbar-width:none]
            "
          >
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() =>
                  setActiveTab(tab.value)
                }
                className={`
                  rounded-full
                  font-bold
                  transition-all
                  px-3.5 py-1.5 sm:px-5 sm:py-2 lg:px-[24px] lg:py-[10px]
                  text-xs sm:text-[13px] lg:text-[14px]
                  shrink-0
                  active:scale-95
                  ${
                    activeTab === tab.value
                      ? "bg-[#FF76C3] text-white shadow-md"
                      : "bg-white text-gray-500 shadow-sm hover:bg-gray-100"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </section>

          {/* ================================================= */}
          {/* PROJECT LIST */}
          {/* ================================================= */}

          <div
            id="project-list"
            className="
              flex
              flex-col
              gap-8 sm:gap-10 lg:gap-[78px]
            "
          >
            {/* ================================================= */}
            {/* LOADING */}
            {/* ================================================= */}

            {loading && (
              <div
                className="
                  flex
                  items-center
                  justify-center
                  min-h-[150px] lg:min-h-[200px]
                "
              >
                <div
                  className="
                    animate-spin
                    rounded-full
                    border-[3px]
                    border-gray-200
                    border-t-[#FF76C3]
                    w-8 h-8 lg:w-[42px] lg:h-[42px]
                  "
                />
              </div>
            )}

            {/* ================================================= */}
            {/* EMPTY */}
            {/* ================================================= */}

            {!loading &&
              contents.length === 0 && (
                <div
                  className="
                    rounded-2xl lg:rounded-[24px]
                    bg-white
                    text-center
                    shadow-sm
                    px-6 lg:px-[60px]
                    py-16 lg:py-[96px]
                  "
                >
                  <p
                    className="
                      font-semibold
                      text-gray-500
                      text-sm lg:text-[16px]
                    "
                  >
                    Hiện chưa có bài viết nào.
                  </p>
                </div>
              )}

            {/* ================================================= */}
            {/* SECTIONS */}
            {/* ================================================= */}

            {!loading &&
              SECTIONS.map(
                (section, index) => {
                  // --------------------------------------------
                  // FILTER TAB
                  // --------------------------------------------

                  if (
                    activeTab !== "all" &&
                    activeTab !==
                      section.category
                  ) {
                    return null;
                  }

                  // --------------------------------------------
                  // CONTENT
                  // --------------------------------------------

                  const sectionContents =
                    getSectionContents(
                      section.category
                    );

                  if (
                    sectionContents.length === 0
                  ) {
                    return null;
                  }

                  const isBlueArrow =
                    index % 2 === 0;

                  const canSlideDesktop =
                    sectionContents.length > 4;

                  return (
                    <section
                      key={section.id}
                      className="
                        relative
                        w-full
                      "
                    >
                      {/* ====================================== */}
                      {/* SECTION TITLE & MOBILE CONTROLS */}
                      {/* ====================================== */}

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          mb-3 sm:mb-4 lg:mb-[24px]
                        "
                      >
                        <h2
                          className="
                            font-bold
                            text-gray-700
                            text-base sm:text-lg lg:text-[21px]
                          "
                        >
                          {section.title}
                        </h2>

                        <div className="flex items-center gap-2 sm:gap-3">
                          <span
                            className="
                              font-medium
                              text-gray-400
                              text-xs lg:text-[12px]
                            "
                          >
                            {sectionContents.length}{" "}
                            bài viết
                          </span>

                          {/* MOBILE / IPAD CONTROLS (hiện khi có từ 2 bài viết) */}
                          {sectionContents.length > 1 && (
                            <div className="flex lg:hidden items-center gap-1.5 ml-1">
                              <button
                                type="button"
                                aria-label="Xem bài trước"
                                onClick={() =>
                                  scrollSection(
                                    section.category,
                                    "prev"
                                  )
                                }
                                className={`
                                  flex
                                  aspect-square
                                  items-center
                                  justify-center
                                  rounded-full
                                  text-white
                                  shadow-sm
                                  transition-all
                                  active:scale-95
                                  w-7 h-7 sm:w-8 sm:h-8
                                  ${
                                    isBlueArrow
                                      ? "bg-[#38bdf8]"
                                      : "bg-[#FF76C3]"
                                  }
                                `}
                              >
                                <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                              </button>
                              <button
                                type="button"
                                aria-label="Xem bài tiếp theo"
                                onClick={() =>
                                  scrollSection(
                                    section.category,
                                    "next"
                                  )
                                }
                                className={`
                                  flex
                                  aspect-square
                                  items-center
                                  justify-center
                                  rounded-full
                                  text-white
                                  shadow-sm
                                  transition-all
                                  active:scale-95
                                  w-7 h-7 sm:w-8 sm:h-8
                                  ${
                                    isBlueArrow
                                      ? "bg-[#38bdf8]"
                                      : "bg-[#FF76C3]"
                                  }
                                `}
                              >
                                <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ====================================== */}
                      {/* CAROUSEL WRAPPER */}
                      {/* ====================================== */}

                      <div
                        className="
                          group
                          relative
                          w-full
                        "
                      >
                        {/* ==================================== */}
                        {/* DESKTOP LEFT ARROW */}
                        {/* ==================================== */}

                        {canSlideDesktop && (
                          <button
                            type="button"
                            aria-label="Xem bài trước"
                            onClick={() =>
                              scrollSection(
                                section.category,
                                "prev"
                              )
                            }
                            className={`
                              hidden lg:flex
                              absolute
                              z-10
                              aspect-square
                              items-center
                              justify-center
                              rounded-full lg:rounded-[18%]
                              top-[35%] -translate-y-1/2
                              text-white
                              shadow-md
                              transition-all
                              hover:scale-110
                              active:scale-95
                              -left-4 xl:-left-[48px]
                              w-9 xl:w-[38px]
                              ${
                                isBlueArrow
                                  ? "bg-[#38bdf8]"
                                  : "bg-[#FF76C3]"
                              }
                            `}
                          >
                            <ChevronLeft
                              className="w-5 h-5 xl:w-[23px] xl:h-[23px]"
                            />
                          </button>
                        )}

                        {/* ==================================== */}
                        {/* HORIZONTAL SCROLL / SNAP CAROUSEL */}
                        {/* ==================================== */}

                        <div
                          ref={(el) => {
                            carouselRefs.current[
                              section.category
                            ] = el;
                          }}
                          className="
                            flex
                            w-full
                            gap-3.5 sm:gap-4 lg:gap-[24px]
                            overflow-x-auto
                            scroll-smooth
                            snap-x snap-mandatory
                            [&::-webkit-scrollbar]:hidden
                            [-ms-overflow-style:none]
                            [scrollbar-width:none]
                            touch-pan-x
                            py-1
                          "
                        >
                          {sectionContents.map((item) => (
                            <div
                              key={item.id}
                              className="
                                w-[76vw] max-w-[280px]
                                sm:w-[calc(50%-10px)] sm:max-w-none
                                lg:w-[calc(25%-18px)] lg:max-w-none
                                shrink-0
                                snap-start
                              "
                            >
                              {renderCard(item)}
                            </div>
                          ))}
                        </div>

                        {/* ==================================== */}
                        {/* DESKTOP RIGHT ARROW */}
                        {/* ==================================== */}

                        {canSlideDesktop && (
                          <button
                            type="button"
                            aria-label="Xem bài tiếp theo"
                            onClick={() =>
                              scrollSection(
                                section.category,
                                "next"
                              )
                            }
                            className={`
                              hidden lg:flex
                              absolute
                              z-10
                              aspect-square
                              items-center
                              justify-center
                              top-[35%] -translate-y-1/2
                              rounded-full lg:rounded-[18%]
                              text-white
                              shadow-md
                              transition-all
                              hover:scale-110
                              active:scale-95
                              -right-4 xl:-right-[48px]
                              w-9 xl:w-[38px]
                              ${
                                isBlueArrow
                                  ? "bg-[#38bdf8]"
                                  : "bg-[#FF76C3]"
                              }
                            `}
                          >
                            <ChevronRight
                              className="w-5 h-5 xl:w-[23px] xl:h-[23px]"
                            />
                          </button>
                        )}
                      </div>
                    </section>
                  );
                }
              )}
          </div>
        </div>
      </div>
    </main>
  );
}