import { supabase } from "@/lib/supabase";

export interface Post {
  id: string;
  content: string;
  image_urls: string[];
  video_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

// Hàm lấy danh sách bài viết cho User — có phân trang, chỉ lấy cột cần thiết
export async function getPosts(
  page = 1,
  pageSize = 10
): Promise<{ data: Post[] | null; error: any; totalCount: number | null }> {
  const from = (page - 1) * pageSize;
  const { data, error, count } = await supabase
    .from("posts")
    .select(
      "id, content, image_urls, video_url, likes_count, comments_count, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  return { data, error, totalCount: count };
}