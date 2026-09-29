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
  // SCALE CONTAINER
  // ==========================================================

  const scaleContainerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);

  // ==========================================================
  // TÍNH SCALE THEO CONTAINER
  // ==========================================================

  useEffect(() => {
    const element = scaleContainerRef.current;

    if (!element) return;

    const updateScale = () => {
      const width = element.clientWidth;

      if (!width) return;

      const nextScale = width / DESIGN_WIDTH;

      setScale(nextScale);
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    observer.observe(element);

    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

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
        "
        style={{
          gap: 16,
        }}
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
          "
          style={{
            borderRadius: 18,
          }}
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
                  "
                  style={{
                    width: 55,
                  }}
                >
                  <Play
                    className="
                      fill-current
                    "
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                </div>
              </div>

              {/* LABEL */}

              <div
                className="
                  absolute
                  left-4
                  top-4
                  rounded-full
                  bg-red-600
                  px-4
                  py-2
                  font-semibold
                  text-white
                  shadow-md
                "
                style={{
                  fontSize: 12,
                }}
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
                left-4
                top-4
                rounded-full
                bg-black/65
                px-4
                py-2
                font-semibold
                text-white
                backdrop-blur-sm
              "
              style={{
                fontSize: 12,
              }}
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
          "
          style={{
            fontSize: 15,
          }}
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
            "
            style={{
              gap: 8,
              fontSize: 11,
            }}
          >
            <CalendarDays
              style={{
                width: 16,
                height: 16,
              }}
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
        ref={scaleContainerRef}
        className="
          mx-auto
          w-[60%]
        "
      >
        {/* ==================================================== */}
        {/* DESIGN CANVAS                                        */}
        {/* ==================================================== */}

        <div
          className="
            relative
            w-[1200px]
            origin-top-left
          "
          style={{
            zoom: scale,
          }}
        >
          {/* ================================================= */}
          {/* HERO */}
          {/* ================================================= */}

          <section
            className="
              relative
              aspect-[2.4/1]
              w-full
              overflow-hidden
              bg-gray-900
              shadow-lg
            "
            style={{
              borderRadius: 18,
            }}
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
                from-black/75
                via-black/35
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
              "
              style={{
                paddingLeft: 84,
              }}
            >
              <p
                className="
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#FF76C3]
                "
                style={{
                  marginBottom: 12,
                  fontSize: 14,
                }}
              >
                KERIA'S PROJECT
              </p>

              <h1
                className="
                  max-w-[65%]
                  font-extrabold
                  leading-[1.1]
                  text-white
                "
                style={{
                  marginBottom: 18,
                  fontSize: 48,
                }}
              >
                Các dự án dành cho KERIA
              </h1>

              <p
                className="
                  max-w-[55%]
                  leading-[1.6]
                  text-white/80
                "
                style={{
                  marginBottom: 24,
                  fontSize: 15,
                }}
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
                "
                style={{
                  borderRadius: 8,
                  paddingLeft: 36,
                  paddingRight: 36,
                  paddingTop: 12,
                  paddingBottom: 12,
                  fontSize: 14,
                }}
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
            "
            style={{
              marginTop: 60,
              marginBottom: 60,
              gap: 14,
            }}
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
                  ${
                    activeTab === tab.value
                      ? "bg-[#FF76C3] text-white shadow-md"
                      : "bg-white text-gray-500 shadow-sm hover:bg-gray-100"
                  }
                `}
                style={{
                  paddingLeft: 24,
                  paddingRight: 24,
                  paddingTop: 10,
                  paddingBottom: 10,
                  fontSize: 14,
                }}
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
            "
            style={{
              gap: 78,
            }}
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
                "
                style={{
                  minHeight: 200,
                }}
              >
                <div
                  className="
                    animate-spin
                    rounded-full
                    border-[3px]
                    border-gray-200
                    border-t-[#FF76C3]
                  "
                  style={{
                    width: 42,
                    height: 42,
                  }}
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
                    rounded-[24px]
                    bg-white
                    text-center
                    shadow-sm
                  "
                  style={{
                    paddingLeft: 60,
                    paddingRight: 60,
                    paddingTop: 96,
                    paddingBottom: 96,
                  }}
                >
                  <p
                    className="
                      font-semibold
                      text-gray-500
                    "
                    style={{
                      fontSize: 16,
                    }}
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
                        "
                        style={{
                          marginBottom: 24,
                        }}
                      >
                        <h2
                          className="
                            font-bold
                            text-gray-700
                          "
                          style={{
                            fontSize: 21,
                          }}
                        >
                          {section.title}
                        </h2>

                        <span
                          className="
                            font-medium
                            text-gray-400
                          "
                          style={{
                            fontSize: 12,
                          }}
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
                              rounded-[18%]
                              text-white
                              shadow-sm
                              transition-all
                              hover:scale-105
                              ${
                                isBlueArrow
                                  ? "bg-[#38bdf8]"
                                  : "bg-[#FF76C3]"
                              }
                            `}
                            style={{
                              left: -48,
                              width: 38,
                            }}
                          >
                            <ChevronLeft
                              style={{
                                width: 23,
                                height: 23,
                              }}
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
                            grid-cols-4
                          "
                          style={{
                            gap: 24,
                          }}
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
                              rounded-[18%]
                              text-white
                              shadow-sm
                              transition-all
                              hover:scale-105
                              ${
                                isBlueArrow
                                  ? "bg-[#38bdf8]"
                                  : "bg-[#FF76C3]"
                              }
                            `}
                            style={{
                              right: -48,
                              width: 38,
                            }}
                          >
                            <ChevronRight
                              style={{
                                width: 23,
                                height: 23,
                              }}
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