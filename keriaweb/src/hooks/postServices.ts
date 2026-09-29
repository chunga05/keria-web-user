"use client";

export type Post = {
  id: string;
  content: string | null;
  image_urls: string[] | null;
  video_url: string | null;
  created_at: string | null;
};

export async function getPosts(page = 1, limit = 10) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  try {
    const response = await fetch(`/api/posts?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: result?.error || `HTTP ${response.status}`,
      };
    }

    return {
      data: Array.isArray(result?.data) ? result.data : [],
      error: null,
    };
  } catch (error) {
    console.error("❌ Lỗi getPosts:", error);

    return {
      data: null,
      error: "Không thể kết nối tới server.",
    };
  }
}