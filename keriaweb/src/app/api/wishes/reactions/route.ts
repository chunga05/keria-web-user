
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } =
      new URL(request.url);

    const visitorId =
      searchParams
        .get("visitorId")
        ?.trim() || "";

    console.log(
      "========== GET WISH REACTIONS =========="
    );

    console.log(
      "visitorId:",
      visitorId
    );

    console.log(
      "SUPABASE URL:",
      process.env.NEXT_PUBLIC_SUPABASE_URL
    );

    if (!visitorId) {
      return NextResponse.json({
        reactions: {},
      });
    }

    const supabase =
      await createClient();

    // -------------------------------------------------------
    // TEST ĐỌC TRỰC TIẾP
    // -------------------------------------------------------

    const {
      data,
      error,
    } = await supabase
      .from("wish_reactions")
      .select(
        "id, wish_id, visitor_id, reaction_type"
      )
      .eq(
        "visitor_id",
        visitorId
      );

    console.log(
      "DATA:",
      data
    );

    console.log(
      "ERROR:",
      error
    );

    if (error) {
      return NextResponse.json(
        {
          error:
            "Không thể tải reactions",
          details:
            error.message,
          code:
            error.code,
          hint:
            error.hint,
        },
        { status: 500 }
      );
    }

    const reactions: Record<
      number,
      string[]
    > = {};

    for (
      const row of data ?? []
    ) {
      const wishId =
        Number(row.wish_id);

      if (
        !Number.isFinite(
          wishId
        )
      ) {
        continue;
      }

      if (
        !reactions[wishId]
      ) {
        reactions[wishId] =
          [];
      }

      if (
        row.reaction_type &&
        !reactions[
          wishId
        ].includes(
          row.reaction_type
        )
      ) {
        reactions[
          wishId
        ].push(
          row.reaction_type
        );
      }
    }

    console.log(
      "FINAL:",
      reactions
    );

    return NextResponse.json({
      reactions,
    });
  } catch (error: any) {
    console.error(
      "GET /api/wishes/reactions ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Không thể lấy reactions",
        details:
          error?.message ||
          "Unknown error",
      },
      { status: 500 }
    );
  }
}

