
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Play, ChevronUp, ChevronDown } from "lucide-react";
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
  updated_at?: string | null;
};

// ============================================================
// CATEGORY LABEL MAP
// ============================================================

const CATEGORY_LABELS: Record<string, string> = {
  led: "🖥️ LED 🖥️",
  charity: "💝 Thiện Nguyện 💝",
  giveaway: "🎁 Give Away 🎁",
  offline: "☕ Offline Event ☕",
};

// ============================================================
// HELPERS
// ============================================================

function formatDate(date?: string | null) {
  if (!date) return "";
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "";
  return value.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getYoutubeVideoId(url?: string | null) {
  if (!url) return null;
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase().replace("www.", "");

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const videoId = parsedUrl.searchParams.get("v");
      if (videoId) return videoId;

      const shortsMatch = parsedUrl.pathname.match(/\/shorts\/([^/?]+)/);
      if (shortsMatch?.[1]) return shortsMatch[1];

      const embedMatch = parsedUrl.pathname.match(/\/embed\/([^/?]+)/);
      if (embedMatch?.[1]) return embedMatch[1];
    }

    if (hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.replace("/", "").split("?")[0];
      if (videoId) return videoId;
    }

    return null;
  } catch {
    return null;
  }
}

function isDirectVideo(url?: string | null) {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);
}

function getYoutubeEmbedUrl(url?: string | null) {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) return "";
  return `https://www.youtube.com/embed/${videoId}?rel=0`;
}

function isYoutubeUrl(url?: string | null) {
  return Boolean(getYoutubeVideoId(url));
}

// ============================================================
// RELATED CARD COMPONENT — style giống hệt card ngoài danh sách
// ============================================================

function RelatedCard({ item }: { item: ContentRecord }) {
  const [imgError, setImgError] = useState(false);

  const categoryLabel =
    CATEGORY_LABELS[item.category?.toLowerCase()] ?? item.category;

  const youtube = Boolean(item.is_video) && isYoutubeUrl(item.media_url);
  const directVideo = Boolean(item.is_video) && isDirectVideo(item.media_url);

  const youtubeId = getYoutubeVideoId(item.media_url);
  const thumbnailSrc = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
    : item.media_url &&
      !item.media_url.match(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/) &&
      !isDirectVideo(item.media_url)
      ? item.media_url
      : null;

  const showPlaceholder = !youtube && !directVideo && (!thumbnailSrc || imgError);

  return (
    <Link
      href={`/content/${encodeURIComponent(item.slug ?? "")}`}
      className="group/card flex w-full cursor-pointer flex-col"
      style={{ gap: 10 }}
    >
      {/* ===================================================
          MEDIA THUMBNAIL
      =================================================== */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100"
        style={{ borderRadius: 14 }}
      >
        {/* YOUTUBE */}
        {youtube ? (
          <div className="relative h-full w-full">
            <iframe
              src={getYoutubeEmbedUrl(item.media_url)}
              title={item.title}
              className="pointer-events-none h-full w-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            {/* Overlay + Play button */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-all group-hover/card:bg-black/25">
              <div
                className="flex aspect-square items-center justify-center rounded-full bg-[#FF76C3]/90 text-white shadow-lg transition-transform group-hover/card:scale-110"
                style={{ width: 44 }}
              >
                <Play className="fill-current" style={{ width: 22, height: 22 }} />
              </div>
            </div>
            {/* YOUTUBE badge */}
            <div
              className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 font-semibold text-white shadow-md"
              style={{ fontSize: 11 }}
            >
              YOUTUBE
            </div>
          </div>
        ) : directVideo ? (
          /* DIRECT VIDEO (R2) */
          <video
            src={item.media_url || ""}
            muted
            playsInline
            preload="metadata"
            className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
          />
        ) : showPlaceholder ? (
          /* PLACEHOLDER */
          <Image
            src="/images/placeholder-banner.jpg"
            alt={item.title}
            fill
            sizes="300px"
            className="object-cover transition-transform duration-300 group-hover/card:scale-105"
          />
        ) : (
          /* IMAGE */
          <Image
            src={thumbnailSrc!}
            alt={item.title}
            fill
            sizes="300px"
            unoptimized={Boolean(youtubeId)}
            className="object-cover transition-transform duration-300 group-hover/card:scale-105"
            onError={() => setImgError(true)}
          />
        )}

        {/* VIDEO badge (non-YouTube) */}
        {item.is_video && !youtube && (
          <div
            className="absolute left-3 top-3 rounded-full bg-black/80 px-3 py-1 font-semibold text-white backdrop-blur-sm"
            style={{ fontSize: 11 }}
          >
            VIDEO
          </div>
        )}
      </div>

      {/* ===================================================
          INFO WRAPPER
      =================================================== */}
      <div className="flex flex-col gap-1.5 px-0.5">
        {/* Category */}
        <p className="text-[11px] font-bold text-gray-800">
          {categoryLabel}
        </p>

        {/* Title */}
        <h4 className="line-clamp-2 text-[14px] font-bold uppercase leading-snug text-[#FF76C3] transition-colors group-hover/card:text-[#FF4D91]">
          {item.title}
        </h4>

        {/* Footer: Avatar + Name on left, Date on right */}
        <div className="mt-2 flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="relative h-[22px] w-[22px] overflow-hidden rounded-full bg-[#FFF0F8] border border-pink-100">
              <Image
                src="/images/DEARKERIAVN LOGO 1.png"
                alt="DearKeriaVN"
                fill
                sizes="22px"
                className="object-cover"
              />
            </div>
            <span className="text-[11px] font-semibold text-gray-800">
              DearKeriaVN
            </span>
          </div>

          {/* Date */}
          {item.created_at && (
            <span className="text-[10px] text-gray-400">
              {formatDate(item.created_at).replace(/\//g, "-")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function ContentDetailPage() {
  const isEnabled = isFeatureEnabled(FEATURES.SUPPORTING_PROJECT);
  const params = useParams();
  const router = useRouter();

  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [content, setContent] = useState<ContentRecord | null>(null);
  const [related, setRelated] = useState<ContentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startIndex, setStartIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // ==========================================================
  // AUTO-SLIDE RELATED (10s)
  // ==========================================================
  
  useEffect(() => {
    if (related.length <= 3 || isHovered) return;

    const interval = setInterval(() => {
      setStartIndex((prev) => (prev >= related.length - 3 ? 0 : prev + 1));
    }, 10000);

    return () => clearInterval(interval);
  }, [related.length, isHovered]);

  // ----------------------------------------------------------
  // LOAD MAIN CONTENT
  // ----------------------------------------------------------

  useEffect(() => {
    if (!isEnabled) {
      setLoading(false);
      return;
    }

    if (!slug) return;

    const loadContent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/content/${encodeURIComponent(slug)}`,
          { method: "GET", cache: "no-store" }
        );

        if (!response.ok) throw new Error("Không tìm thấy bài viết.");

        const result = await response.json();
        if (!result.data) throw new Error("Không tìm thấy bài viết.");

        setContent(result.data);
      } catch (err) {
        console.error("❌ Lỗi tải bài viết:", err);
        setError("Không thể tải bài viết.");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [slug]);

  // ----------------------------------------------------------
  // LOAD RELATED CONTENT (same category, exclude current)
  // ----------------------------------------------------------

  useEffect(() => {
    if (!content) return;

    const loadRelated = async () => {
      try {
        const response = await fetch("/api/content", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) return;

        const result = await response.json();
        const all: ContentRecord[] = Array.isArray(result.data)
          ? result.data
          : [];

        // Lọc cùng category, loại bài hiện tại, SẮP XẾP MỚI NHẤT
        const filtered = all
          .filter(
            (item) =>
              item.category?.toLowerCase() ===
                content.category?.toLowerCase() &&
              item.slug !== content.slug
          )
          .sort((a, b) => {
            const dateA = new Date(a.created_at || 0).getTime();
            const dateB = new Date(b.created_at || 0).getTime();
            return dateB - dateA; // Mới nhất lên đầu
          });

        setRelated(filtered);
      } catch (err) {
        console.error("❌ Lỗi tải bài liên quan:", err);
      }
    };

    loadRelated();
  }, [content]);

  // ----------------------------------------------------------
  // FEATURE FLAG GUARD
  // ----------------------------------------------------------

  if (!isEnabled) {
    return (
      <UnderConstruction
        variant="page"
        featureName="Supporting Project"
        description="Chuyên mục các dự án tiếp sức đang được cập nhật. Chúng mình sẽ sớm mang đến cho các bạn những hoạt động thú vị nhất!"
        estimatedRelease="Dự kiến cập nhật trong thời gian tới"
        showBackButton={true}
        backButtonHref="/"
      />
    );
  }

  // ----------------------------------------------------------
  // LOADING STATE
  // ----------------------------------------------------------

  if (loading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#F8F9FC]">
        <div className="h-[3vw] w-[3vw] min-h-[30px] min-w-[30px] animate-spin rounded-full border-[3px] border-gray-200 border-t-[#FF76C3]" />
      </main>
    );
  }

  // ----------------------------------------------------------
  // ERROR STATE
  // ----------------------------------------------------------

  if (error || !content) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#F8F9FC] px-[5%]">
        <div className="text-center">
          <h1 className="mb-[2%] text-[clamp(22px,2.5vw,36px)] font-bold text-gray-700">
            Không tìm thấy bài viết
          </h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full bg-[#FF76C3] px-[5%] py-[2%] text-white transition hover:bg-[#FF4D91]"
          >
            Quay lại
          </button>
        </div>
      </main>
    );
  }

  // ----------------------------------------------------------
  // MEDIA HELPERS
  // ----------------------------------------------------------

  const youtubeId = getYoutubeVideoId(content.media_url);
  const youtubeUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?rel=0`
    : "";

  const categoryLabel =
    CATEGORY_LABELS[content.category?.toLowerCase()] ?? content.category;

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <main className="min-h-screen w-full bg-[#F8F9FC] pb-[8%] pt-[4%]">
      <div className="mx-auto w-[90%] max-w-[1200px]">

        {/* ========================
            BACK BUTTON
        ======================== */}

        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-[clamp(12px,0.95vw,15px)] font-semibold text-gray-500 transition hover:text-[#FF76C3]"
        >
          <ArrowLeft className="h-[1.2em] w-[1.2em]" />
          Quay lại danh sách dự án
        </button>

        {/* ========================
            TWO COLUMN LAYOUT
        ======================== */}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">

          {/* =====================
              LEFT: MAIN ARTICLE
          ===================== */}

          <article className="min-w-0 flex-1 rounded-[24px] bg-white p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">

            {/* HEADER */}
            <header className="mb-6">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#FFF0F8] px-3 py-1 text-[clamp(9px,0.75vw,12px)] font-bold uppercase text-[#FF76C3]">
                  {categoryLabel}
                </span>

                {content.created_at && (
                  <span className="flex items-center gap-1 text-[clamp(10px,0.75vw,12px)] text-gray-400">
                    <CalendarDays className="h-[1em] w-[1em]" />
                    {formatDate(content.created_at)}
                  </span>
                )}
              </div>

              <h1 className="text-[clamp(24px,3vw,44px)] font-extrabold leading-[1.2] text-gray-800">
                {content.title}
              </h1>
            </header>

            {/* MEDIA */}
            {content.media_url && (
              <div className="mb-8 overflow-hidden rounded-2xl bg-black shadow-sm">
                {/* YOUTUBE */}
                {content.is_video && youtubeId ? (
                  <div className="relative aspect-video w-full">
                    <iframe
                      src={youtubeUrl}
                      title={content.title}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : content.is_video && isDirectVideo(content.media_url) ? (
                  /* VIDEO FILE */
                  <video
                    src={content.media_url}
                    controls
                    playsInline
                    className="max-h-[75vh] w-full object-contain"
                  />
                ) : (
                  /* IMAGE */
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={content.media_url}
                      alt={content.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 90vw, 65vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            {/* ARTICLE CONTENT – render HTML từ rich text editor */}
            <div className="w-full">
              {content.content ? (
                <div
                  className="rich-content"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
              ) : (
                <p className="italic text-gray-400">
                  Bài viết này chưa có nội dung.
                </p>
              )}
            </div>
          </article>

          {/* =====================
              RIGHT: SIDEBAR
          ===================== */}

          <aside className="w-full lg:w-[320px] lg:flex-shrink-0">
            <div
              className="sticky top-6 rounded-[24px] bg-white px-6 py-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Tiêu đề sidebar */}
              <div className="mb-6">
                <span className="inline-block border-b-[3px] border-[#3B82F6] pb-1.5 text-[17px] font-bold text-gray-800">
                  Liên quan
                </span>
              </div>

              {related.length === 0 ? (
                <p className="text-[13px] italic text-gray-400">
                  Không có bài viết liên quan.
                </p>
              ) : (
                <>
                  <div className="flex flex-col gap-8 min-h-[400px]">
                    {related.slice(startIndex, startIndex + 3).map((item) => (
                      <RelatedCard key={item.id} item={item} />
                    ))}
                  </div>

                  {/* Thanh điều hướng Lên / Xuống */}
                  {related.length > 3 && (
                    <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
                      <button
                        onClick={() => setStartIndex((prev) => (prev === 0 ? Math.max(0, related.length - 3) : prev - 1))}
                        className="flex aspect-square items-center justify-center rounded-[18%] bg-[#38bdf8] text-white shadow-sm transition-all hover:scale-105"
                        style={{ width: 38 }}
                      >
                        <ChevronUp style={{ width: 23, height: 23 }} />
                      </button>
                      
                      <span className="text-[13px] font-medium text-gray-400">
                        {startIndex + 1} / {Math.max(1, related.length - 2)}
                      </span>
                      
                      <button
                        onClick={() => setStartIndex((prev) => (prev >= related.length - 3 ? 0 : prev + 1))}
                        className="flex aspect-square items-center justify-center rounded-[18%] bg-[#38bdf8] text-white shadow-sm transition-all hover:scale-105"
                        style={{ width: 38 }}
                      >
                        <ChevronDown style={{ width: 23, height: 23 }} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
