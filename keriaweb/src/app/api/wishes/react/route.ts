import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const VALID_REACTIONS = [
  "heart",
  "wow",
  "star",
  "cry",
] as const;

type ReactionType = (typeof VALID_REACTIONS)[number];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const wishId = Number(body.wishId);
    const visitorId = String(body.visitorId || "").trim();
    const reactionType = String(
      body.reactionType || ""
    ) as ReactionType;

    // ==========================================
    // VALIDATE
    // ==========================================

    if (!Number.isInteger(wishId) || wishId <= 0) {
      return NextResponse.json(
        {
          error: "wishId không hợp lệ",
        },
        { status: 400 }
      );
    }

    if (!visitorId) {
      return NextResponse.json(
        {
          error: "visitorId không tồn tại",
        },
        { status: 400 }
      );
    }

    if (!VALID_REACTIONS.includes(reactionType)) {
      return NextResponse.json(
        {
          error: "Loại reaction không hợp lệ",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // SUPABASE SERVER
    // ==========================================

    const supabase = await createClient();

    // ==========================================
    // TOGGLE REACTION
    // ==========================================

    const { data, error } = await supabase.rpc(
      "toggle_wish_reaction",
      {
        p_wish_id: wishId,
        p_visitor_id: visitorId,
        p_reaction_type: reactionType,
      }
    );

    if (error) {
      console.error(
        "❌ toggle_wish_reaction:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    const result = data?.[0];

    if (!result) {
      return NextResponse.json(
        {
          error: "Không nhận được kết quả reaction",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reacted: result.reacted,
      reactionCount: result.reaction_count,
    });
  } catch (error: any) {
    console.error(
      "❌ POST /api/wishes/react:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Lỗi xử lý reaction",
      },
      { status: 500 }
    );
  }
}