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
  // CAROUSEL INDEX
  // ==========================================================

  const [sectionIndexes, setSectionIndexes] = useState<
    Record<string, number>
  >({});

  // ==========================================================
  // LOAD CONTENT
  // ==========================================================

  useEffect(() => {
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
  // NEXT SLIDE
  // ==========================================================

  const handleNext = (
    category: string,
    total: number
  ) => {
    if (total <= 4) return;

    setSectionIndexes((prev) => {
      const current = prev[category] || 0;

      const maxIndex = Math.max(
        0,
        total - 4
      );

      return {
        ...prev,
        [category]:
          current >= maxIndex
            ? 0
            : current + 1,
      };
    });
  };

  // ==========================================================
  // PREVIOUS SLIDE
  // ==========================================================

  const handlePrevious = (
    category: string,
    total: number
  ) => {
    if (total <= 4) return;

    setSectionIndexes((prev) => {
      const current = prev[category] || 0;

      const maxIndex = Math.max(
        0,
        total - 4
      );

      return {
        ...prev,
        [category]:
          current <= 0
            ? maxIndex
            : current - 1,
      };
    });
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
          gap-3 lg:gap-[16px]
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
                    w-10 lg:w-[55px]
                  "
                >
                  <Play
                    className="
                      fill-current
                      w-5 h-5 lg:w-[30px] lg:h-[30px]
                    "
                  />
                </div>
              </div>

              {/* LABEL */}

              <div
                className="
                  absolute
                  left-2 lg:left-4
                  top-2 lg:top-4
                  rounded-full
                  bg-red-600
                  px-2 lg:px-4
                  py-1 lg:py-2
                  font-semibold
                  text-white
                  shadow-md
                  text-[10px] lg:text-[12px]
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
              sizes="300px"
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
              sizes="300px"
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
                left-2 lg:left-4
                top-2 lg:top-4
                rounded-full
                bg-black/65
                px-2 lg:px-4
                py-1 lg:py-2
                font-semibold
                text-white
                backdrop-blur-sm
                text-[10px] lg:text-[12px]
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
            leading-[1.45]
            text-gray-800
            transition-colors
            group-hover/card:text-[#FF76C3]
            text-sm lg:text-[15px]
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
              gap-2 lg:gap-[8px]
              text-[10px] lg:text-[11px]
            "
          >
            <CalendarDays
              className="w-3.5 h-3.5 lg:w-[16px] lg:h-[16px]"
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
  // MAIN
  // ==========================================================

  return (
    <main
      className="
        min-h-screen
        w-full
        bg-[#F8F9FC]
      "
      style={{
        paddingTop: 36,
        paddingBottom: 72,
      }}
    >
      {/* ====================================================== */}
      {/* OUTER SCALE CONTAINER                                  */}
      {/* ====================================================== */}

      <div
        className="
          mx-auto
          w-[92%]
          lg:w-[60%]
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
              aspect-[4/3] sm:aspect-[2.4/1]
              w-full
              overflow-hidden
              bg-gray-900
              shadow-lg
              rounded-2xl lg:rounded-[18px]
            "
          >
            <Image
              src="/images/placeholder-banner.jpg"
              alt="Project Banner"
              fill
              priority
              sizes="1200px"
              className="
                object-cover
                opacity-80
              "
            />

            {/* OVERLAY */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-black/80 sm:from-black/75
                via-black/50 sm:via-black/35
                to-transparent
              "
            />

            {/* CONTENT */}

            <div
              className="
                absolute
                inset-0
                flex
                flex-col
                justify-center
                pl-5 sm:pl-10 lg:pl-[84px]
              "
            >
              <p
                className="
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#FF76C3]
                  mb-2 lg:mb-[12px]
                  text-xs lg:text-[14px]
                "
              >
                KERIA'S PROJECT
              </p>

              <h1
                className="
                  max-w-[90%] lg:max-w-[65%]
                  font-extrabold
                  leading-[1.1]
                  text-white
                  mb-3 lg:mb-[18px]
                  text-2xl sm:text-3xl lg:text-[48px]
                "
              >
                Các dự án dành cho KERIA
              </h1>

              <p
                className="
                  max-w-[90%] sm:max-w-[80%] lg:max-w-[55%]
                  leading-[1.6]
                  text-white/80
                  mb-5 lg:mb-[24px]
                  text-sm lg:text-[15px]
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
                  hover:bg-[#FF4D91]
                  rounded-lg
                  px-6 py-2.5 lg:px-[36px] lg:py-[12px]
                  text-sm lg:text-[14px]
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
              flex-wrap
              items-center
              mt-8 lg:mt-[60px]
              mb-8 lg:mb-[60px]
              gap-2 lg:gap-[14px]
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
                  px-4 py-2 lg:px-[24px] lg:py-[10px]
                  text-xs lg:text-[14px]
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
              gap-12 lg:gap-[78px]
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

                  // --------------------------------------------
                  // CAROUSEL
                  // --------------------------------------------

                  const currentIndex =
                    sectionIndexes[
                      section.category
                    ] || 0;

                  const visibleContents =
                    sectionContents.slice(
                      currentIndex,
                      currentIndex + 4
                    );

                  const isBlueArrow =
                    index % 2 === 0;

                  const canSlide =
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
                      {/* SECTION TITLE */}
                      {/* ====================================== */}

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          mb-4 lg:mb-[24px]
                        "
                      >
                        <h2
                          className="
                            font-bold
                            text-gray-700
                            text-lg lg:text-[21px]
                          "
                        >
                          {section.title}
                        </h2>

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
                      </div>

                      {/* ====================================== */}
                      {/* CAROUSEL */}
                      {/* ====================================== */}

                      <div
                        className="
                          group
                          relative
                          flex
                          items-center
                        "
                      >
                        {/* ==================================== */}
                        {/* LEFT ARROW */}
                        {/* ==================================== */}

                        {canSlide && (
                          <button
                            type="button"
                            aria-label="Xem bài trước"
                            onClick={() =>
                              handlePrevious(
                                section.category,
                                sectionContents.length
                              )
                            }
                            className={`
                              absolute
                              z-10
                              flex
                              aspect-square
                              items-center
                              justify-center
                              rounded-full lg:rounded-[18%]
                              -translate-y-1/2 lg:translate-y-[-70%]
                              text-white
                              shadow-sm
                              transition-all
                              hover:scale-105
                              -left-3 lg:-left-[48px]
                              w-8 lg:w-[38px]
                              ${
                                isBlueArrow
                                  ? "bg-[#38bdf8]"
                                  : "bg-[#FF76C3]"
                              }
                            `}
                          >
                            <ChevronLeft
                              className="w-5 h-5 lg:w-[23px] lg:h-[23px]"
                            />
                          </button>
                        )}

                        {/* ==================================== */}
                        {/* GRID */}
                        {/* ==================================== */}

                        <div
                          className="
                            grid
                            w-full
                            grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
                            gap-4 lg:gap-[24px]
                          "
                        >
                          {visibleContents.map(
                            renderCard
                          )}
                        </div>

                        {/* ==================================== */}
                        {/* RIGHT ARROW */}
                        {/* ==================================== */}

                        {canSlide && (
                          <button
                            type="button"
                            aria-label="Xem bài tiếp theo"
                            onClick={() =>
                              handleNext(
                                section.category,
                                sectionContents.length
                              )
                            }
                            className={`
                              absolute
                              z-10
                              flex
                              aspect-square
                              items-center
                              justify-center
                              -translate-y-1/2 lg:translate-y-[-70%]
                              rounded-full lg:rounded-[18%]
                              text-white
                              shadow-sm
                              transition-all
                              hover:scale-105
                              -right-3 lg:-right-[48px]
                              w-8 lg:w-[38px]
                              ${
                                isBlueArrow
                                  ? "bg-[#38bdf8]"
                                  : "bg-[#FF76C3]"
                              }
                            `}
                          >
                            <ChevronRight
                              className="w-5 h-5 lg:w-[23px] lg:h-[23px]"
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