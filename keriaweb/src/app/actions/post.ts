"use server";

import { supabase } from "@/lib/supabase";
import { redis } from "@/lib/redis";

export async function getCachedPosts(page = 1, limit = 10) {
  const CACHE_KEY = `keriaboard_posts_p${page}_l${limit}`;

  try {
    const cachedData = await redis.get(CACHE_KEY);
    
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("posts") // Thay đổi nếu tên bảng của bạn khác
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Lỗi Supabase:", error);
      return [];
    }

    if (data && data.length > 0) {
      await redis.set(CACHE_KEY, JSON.stringify(data), "EX", 300);
    }

    return data || [];
  } catch (error) {
    console.error("Lỗi getCachedPosts:", error);
    return [];
  }
}