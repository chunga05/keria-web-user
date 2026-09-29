"use server";

import { supabase } from "@/lib/supabase";
import { redis } from "@/lib/redis"; // File config ioredis bạn vừa tạo ở bước trước

export async function getFacebookLinksCached() {
  const CACHE_KEY = "user_facebook_links";

  try {
    // 1. Kiểm tra Redis xem có cache không
    const cachedData = await redis.get(CACHE_KEY);
    
    if (cachedData) {
      console.log("⚡ [USER PAGE] Lấy data từ Redis Cache");
      return JSON.parse(cachedData); // ioredis trả về string nên cần parse
    }

    // 2. Nếu chưa có cache -> Gọi Supabase
    console.log("🐢 [USER PAGE] Lấy data từ Supabase");
    const { data, error } = await supabase
      .from("facebook_links")
      .select("id, title, url, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Lỗi Supabase:", error);
      return [];
    }

    // 3. Lưu vào Redis Cache (Ví dụ cache sống trong 60 giây)
    if (data && data.length > 0) {
      await redis.set(CACHE_KEY, JSON.stringify(data), "EX", 60);
    }

    return data || [];
  } catch (error) {
    console.error("Lỗi getFacebookLinksCached:", error);
    return [];
  }
}