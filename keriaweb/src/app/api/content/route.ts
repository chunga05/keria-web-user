
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("content")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Lỗi Supabase khi tải content:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Lỗi khi lấy dữ liệu từ cơ sở dữ liệu.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: data ?? [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Lỗi Server API:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Đã xảy ra lỗi hệ thống nội bộ.",
      },
      { status: 500 }
    );
  }
}

