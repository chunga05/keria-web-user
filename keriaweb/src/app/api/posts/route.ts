import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("posts")
      .select(
        "id, content, image_urls, video_url, created_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "❌ [Posts API] Lỗi Supabase:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: data ?? [],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "❌ [Posts API] Server error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Không thể tải bài viết.",
      },
      {
        status: 500,
      }
    );
  }
}