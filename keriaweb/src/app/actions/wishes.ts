"use server";

import { supabase } from "@/lib/supabase";
import { redis } from "@/lib/redis";

// 1. Hàm lấy dữ liệu (Có bọc Redis Cache)
export async function getCachedWishes(filter: string, page: number, limit: number) {
  const isNewest = filter === "Mới nhất";
  const CACHE_KEY = `wishes_${isNewest ? "new" : "old"}_p${page}_l${limit}`;

  try {
    const cachedData = await redis.get(CACHE_KEY);

    if (cachedData) {
      console.log("⚡ [WISHES] Lấy data từ Redis Cache:", CACHE_KEY);
      return JSON.parse(cachedData); // Trả về object { data, count }
    }

    console.log("🐢 [WISHES] Lấy data từ Supabase");
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // ⚠️ CHÚ Ý: Thay chữ "messages" bằng đúng tên bảng lưu lời chúc của bạn
    const { data, count, error } = await supabase
      .from("fan_wishes") // Thay bằng tên bảng của bạn
      .select("*", { count: "exact" })
      .order("created_at", { ascending: !isNewest })
      .range(from, to);

    if (error) {
      console.error("Lỗi Supabase:", error);
      return { data: [], count: 0 };
    }

    const result = { data: data || [], count: count || 0 };

    // Lưu vào Redis. Set TTL khoảng 30s vì trang lời chúc cần cập nhật nhanh hơn
    if (data && data.length > 0) {
      await redis.set(CACHE_KEY, JSON.stringify(result), "EX", 30);
    }

    return result;
  } catch (error) {
    console.error("Lỗi getCachedWishes:", error);
    return { data: [], count: 0 };
  }
}

// 2. Hàm xóa Cache (Gọi khi có người gửi lời chúc mới hoặc thả reaction)
export async function clearWishesCache() {
  try {
    // Tìm và xóa tất cả các key bắt đầu bằng "wishes_"
    const keys = await redis.keys("wishes_*");
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log("🗑️ Đã xóa cache wishes để ép tải lại dữ liệu mới!");
    }
  } catch (error) {
    console.error("Lỗi khi xóa cache:", error);
  }
}