"use server";

import { supabase } from "@/lib/supabase";
import { redis } from "@/lib/redis";

export async function getCachedVideos() {
  const CACHE_KEY = "videoyoutube_contents";

  try {
    // 1. Kiểm tra cache trong Redis
    const cachedData = await redis.get(CACHE_KEY);
    
    if (cachedData) {
      console.log("⚡ [VIDEO_YOUTUBE] Lấy data từ Redis Cache");
      return JSON.parse(cachedData);
    }

    // 2. Nếu chưa có cache, gọi Supabase
    console.log("🐢 [VIDEO_YOUTUBE] Lấy data từ Supabase");
    const { data, error } = await supabase
      .from("content")
      .select("*")
      .eq("is_video", true);

    if (error) {
      console.error("Lỗi Supabase:", error);
      return [];
    }

    // 3. Lưu vào Redis Cache (sống trong 60 giây)
    if (data && data.length > 0) {
      await redis.set(CACHE_KEY, JSON.stringify(data), "EX", 60);
    }

    return data || [];
  } catch (error) {
    console.error("Lỗi getCachedVideos:", error);
    return [];
  }
}