
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";

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

function getYoutubeVideoId(url?: string | null) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    const hostname = parsedUrl.hostname
      .toLowerCase()
      .replace("www.", "");

    // youtube.com/watch?v=xxxx
    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com"
    ) {
      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) {
        return videoId;
      }

      // youtube.com/shorts/xxxx
      const shortsMatch = parsedUrl.pathname.match(
        /\/shorts\/([^/?]+)/
      );

      if (shortsMatch?.[1]) {
        return shortsMatch[1];
      }

      // youtube.com/embed/xxxx
      const embedMatch = parsedUrl.pathname.match(
        /\/embed\/([^/?]+)/
      );

      if (embedMatch?.[1]) {
        return embedMatch[1];
      }
    }

    // youtu.be/xxxx
    if (hostname === "youtu.be") {
      const videoId = parsedUrl.pathname
        .replace("/", "")
        .split("?")[0];

      if (videoId) {
        return videoId;
      }
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

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;

  const [content, setContent] =
    useState<ContentRecord | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    const loadContent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/content/${encodeURIComponent(slug)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Không tìm thấy bài viết.");
        }

        const result = await response.json();

        if (!result.data) {
          throw new Error("Không tìm thấy bài viết.");
        }

        setContent(result.data);
      } catch (error) {
        console.error("❌ Lỗi tải bài viết:", error);
        setError("Không thể tải bài viết.");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [slug]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#F8F9FC]">
        <div className="h-[3vw] w-[3vw] min-h-[30px] min-w-[30px] animate-spin rounded-full border-[3px] border-gray-200 border-t-[#FF76C3]" />
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

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

  // =========================
  // MEDIA DATA
  // =========================

  const youtubeId = getYoutubeVideoId(
    content.media_url
  );

  const youtubeUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?rel=0`
    : "";

  return (
    <main className="min-h-screen w-full bg-[#F8F9FC] pb-[8%] pt-[4%]">
      <article className="mx-auto w-[90%] max-w-[1000px]">

        {/* =========================
            BACK BUTTON
        ========================= */}

        <button
          type="button"
          onClick={() => router.back()}
          className="mb-[4%] flex items-center gap-[1%] text-[clamp(12px,0.95vw,15px)] font-semibold text-gray-500 transition hover:text-[#FF76C3]"
        >
          <ArrowLeft className="h-[1.2em] w-[1.2em]" />

          Quay lại danh sách dự án
        </button>

        {/* =========================
            HEADER
        ========================= */}

        <header className="mb-[4%]">
          <div className="mb-[2%] flex flex-wrap items-center gap-[2%]">
            <span className="rounded-full bg-[#FFF0F8] px-[2.5%] py-[0.8%] text-[clamp(9px,0.75vw,12px)] font-bold uppercase text-[#FF76C3]">
              {content.category}
            </span>

            {content.created_at && (
              <span className="flex items-center gap-[1%] text-[clamp(10px,0.75vw,12px)] text-gray-400">
                <CalendarDays className="h-[1em] w-[1em]" />

                {formatDate(content.created_at)}
              </span>
            )}
          </div>

          <h1 className="max-w-[90%] text-[clamp(26px,3.2vw,46px)] font-extrabold leading-[1.2] text-gray-800">
            {content.title}
          </h1>
        </header>

        {/* =========================
            MEDIA
        ========================= */}

        {content.media_url && (
          <div className="mb-[5%] overflow-hidden rounded-[1.5%] bg-black shadow-lg">

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
            ) : content.is_video &&
              isDirectVideo(content.media_url) ? (

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
                  sizes="90vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* =========================
            ARTICLE CONTENT
        ========================= */}

        <div className="rounded-[1.5%] bg-white px-[7%] py-[6%] shadow-sm">
          {content.content ? (
            <div className="whitespace-pre-line text-[clamp(14px,1.05vw,17px)] leading-[2] text-gray-700">
              {content.content}
            </div>
          ) : (
            <p className="text-[clamp(13px,1vw,16px)] italic text-gray-400">
              Bài viết này chưa có nội dung.
            </p>
          )}
        </div>
      </article>
    </main>
  );
}

