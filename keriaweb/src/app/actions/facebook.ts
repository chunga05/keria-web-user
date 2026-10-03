"use server";

import { supabase } from "@/lib/supabase";
import { redis } from "@/lib/redis";

export async function getFacebookLinksCached() {
  const CACHE_KEY = "user_facebook_links";

  try {
    const cachedData = await redis.get(CACHE_KEY);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const { data, error } = await supabase
      .from("facebook_links")
      .select("id, title, url, thumbnail_url, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Lỗi Supabase:", error);
      return [];
    }

    if (data && data.length > 0) {
      await redis.set(CACHE_KEY, JSON.stringify(data), "EX", 300);
    }

    return data || [];
  } catch (error) {
    console.error("Lỗi getFacebookLinksCached:", error);
    return [];
  }
}