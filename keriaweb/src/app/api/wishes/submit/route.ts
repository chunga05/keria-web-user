// app/api/wishes/submit/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestName, content, idolId = 1 } = body;

    const trimmedName = guestName?.trim() || "";
    const trimmedContent = content?.trim() || "";

    if (!trimmedName || !trimmedContent) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ thông tin!" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Lấy toàn bộ cột word từ bảng bad_words
    const { data: badWordsData, error: badWordsError } = await supabase
      .from("bad_words")
      .select("word");

    if (badWordsError) {
      console.warn("Lỗi khi đọc bảng bad_words:", badWordsError.message);
    }

    // 2. Kiểm tra từ cấm
    if (badWordsData && badWordsData.length > 0) {
      const fullText = `${trimmedName} ${trimmedContent}`.toLowerCase();

      const hasBadWord = badWordsData.some(({ word }) => {
        if (!word) return false;
        const cleanWord = word.trim().toLowerCase();
        if (!cleanWord) return false;

        // Nếu từ ngắn (<= 3 ký tự như "dm"), kiểm tra dạng từ độc lập để tránh bắt nhầm từ ngữ thông thường
        if (cleanWord.length <= 3) {
          const regex = new RegExp(`(^|\\s|[.,!?;:_\\-])${cleanWord}($|\\s|[.,!?;:_\\-])`, "i");
          return regex.test(fullText);
        }

        return fullText.includes(cleanWord);
      });

      if (hasBadWord) {
        return NextResponse.json(
          { error: "Nội dung hoặc tên chứa từ ngữ không phù hợp!" },
          { status: 400 }
        );
      }
    }

    // 3. Lấy thông tin user hiện tại (nếu có đăng nhập)
    const { data: { user } } = await supabase.auth.getUser();

    // 4. Lưu vào fan_wishes
    const { data, error } = await supabase
      .from("fan_wishes")
      .insert([
        {
          idol_id: Number(idolId),
          guest_name: trimmedName,
          content: trimmedContent,
          is_hidden: false,
          user_id: user?.id || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Lỗi insert fan_wishes:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, wish: data });
  } catch (error: any) {
    console.error("API Wishes Submit Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}