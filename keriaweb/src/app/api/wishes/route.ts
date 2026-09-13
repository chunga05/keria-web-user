import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idolId = Number(searchParams.get("idolId")) || 1;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 9);
    const filter = searchParams.get("filter") || "Mới nhất";

    const isAscending = filter === "Cũ nhất";
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = await createClient();

    const { data, error, count } = await supabase
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
      .is("deleted_at", null)
      .order("created_at", { ascending: isAscending })
      .range(from, to);

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
          { type: "cry", emoji: "😭", count: item.react_cry || 0 },
          { type: "wow", emoji: "😮", count: item.react_wow || 0 },
          { type: "star", emoji: "🤩", count: item.react_star || 0 },
          { type: "heart", emoji: "🥰", count: item.react_heart || 0 },
        ],
      };
    });

    return NextResponse.json({
      messages: formattedMessages,
      totalPages,
      totalCount: count || 0,
    });
  } catch (error: any) {
    console.error("API Wishes GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}