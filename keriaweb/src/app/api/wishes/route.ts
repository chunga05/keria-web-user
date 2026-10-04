import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
// 1. Import Redis Client
import { redis } from "@/lib/redis";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idolId = Number(searchParams.get("idolId")) || 1;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 9);
    const filter = searchParams.get("filter") || "Mới nhất";

    // ============================================================
    // 2. TẠO CACHE KEY DUY NHẤT VÀ KIỂM TRA REDIS
    // ============================================================
    const isTop = filter === "Nhiều lượt wish nhất";
    const isAscending = filter === "Cũ nhất";
    const cacheSuffix = isTop ? "top" : isAscending ? "old" : "new";
    const CACHE_KEY = `wishes_api_i${idolId}_p${page}_s${pageSize}_${cacheSuffix}`;

    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      console.log("⚡ [API WISHES GET] Phản hồi ngay từ Redis Cache:", CACHE_KEY);
      return NextResponse.json(JSON.parse(cachedData));
    }

    // ============================================================
    // 3. NẾU KHÔNG CÓ CACHE -> GỌI SUPABASE
    // ============================================================
    console.log("🐢 [API WISHES GET] Lấy dữ liệu từ Supabase");
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = await createClient();

    let query = supabase
      .from("fan_wishes")
      .select(
        `
        *,
        users!fan_wishes_user_id_fkey (
          display_name,
          avatar_url,
          avatar_frames!fk_equipped_frame (
            image_url
          )
        )
      `,
        { count: "exact" }
      )
      .eq("idol_id", idolId)
      .eq("is_hidden", false)
      .is("deleted_at", null);

    if (isTop) {
      query = query.order("total_reactions", { ascending: false }).order("created_at", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: isAscending });
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error("Lỗi query fan_wishes:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const totalPages = count !== null ? Math.ceil(count / pageSize) : 1;
    const decoStars = ["none", "blue", "pink", "none"];
    
    const formattedMessages = (data || []).map((item: any, index: number) => {
      const dateObj = new Date(item.created_at);
      const formattedDate = `${dateObj.getDate().toString().padStart(2, "0")}-${(dateObj.getMonth() + 1).toString().padStart(2, "0")}-${dateObj.getFullYear()}`;
      const isBlue = index % 2 === 0;
      const authorName = item.users?.display_name || item.guest_name || "Ẩn danh";

      return {
        id: item.id,
        author: authorName,
        date: formattedDate,
        content: item.content,
        bgColor: isBlue ? "blue" : "pink",
        decorationStar: decoStars[index % 4],
        hasGoldStar: index % 5 === 0,
        avatar: item.users?.avatar_url || null,
        frameUrl: item.users?.avatar_frames?.image_url || null,
        reactions: [
          { type: "heart", emoji: "🥰", imageUrl: "/images/A 1.png", count: item.react_heart || 0 },
          { type: "star", emoji: "🤩", imageUrl: "/images/B 1.png", count: item.react_star || 0 },
          { type: "cry", emoji: "😭", imageUrl: "/images/C 1.png", count: item.react_cry || 0 },
        ],
      };
    });

    const responseData = {
      messages: formattedMessages,
      totalPages,
      totalCount: count || 0,
    };

    // ============================================================
    // 4. LƯU KẾT QUẢ VÀO REDIS CACHE (30 GIÂY)
    // ============================================================
    if (formattedMessages.length > 0) {
      await redis.set(CACHE_KEY, JSON.stringify(responseData), "EX", 30);
    }

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("API Wishes GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}