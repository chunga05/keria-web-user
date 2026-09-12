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

// Hàm lấy danh sách bài viết cho User hiển thị ra màn hình
export async function getPosts(): Promise<{ data: Post[] | null; error: any }> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
}