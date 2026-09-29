// app/api/wishes/submit/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
// 1. Import hàm xóa cache từ Server Action
import { clearWishesCache } from "@/app/actions/wishes";

export async function POST(request: Request) {
  try {
    // ============================================================
    // 1. LẤY DỮ LIỆU TỪ REQUEST
    // ============================================================

    const body = await request.json();

    const {
      guestName,
      content,
      idolId = 1,
    } = body;

    const trimmedName =
      typeof guestName === "string"
        ? guestName.trim()
        : "";

    const trimmedContent =
      typeof content === "string"
        ? content.trim()
        : "";

    // ============================================================
    // 2. KIỂM TRA DỮ LIỆU
    // ============================================================

    if (!trimmedName || !trimmedContent) {
      return NextResponse.json(
        {
          error:
            "Vui lòng nhập đầy đủ thông tin!",
        },
        {
          status: 400,
        }
      );
    }

    const supabase = await createClient();

    // ============================================================
    // 3. LẤY USER HIỆN TẠI
    // ============================================================

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ============================================================
    // 4. LẤY DANH SÁCH TỪ CẤM
    // ============================================================

    const {
      data: bannedWordsData,
      error: bannedWordsError,
    } = await supabase
      .from("banned_words")
      .select("word");

    if (bannedWordsError) {
      console.error(
        "❌ Lỗi khi đọc bảng banned_words:",
        bannedWordsError
      );

      return NextResponse.json(
        {
          error:
            "Không thể kiểm tra nội dung lúc này. Vui lòng thử lại sau.",
        },
        {
          status: 500,
        }
      );
    }

    // ============================================================
    // 5. KIỂM TRA TỪ CẤM
    // ============================================================

    if (
      bannedWordsData &&
      bannedWordsData.length > 0
    ) {
      const fullText =
        `${trimmedName} ${trimmedContent}`
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d");

      const hasBannedWord =
        bannedWordsData.some((item) => {
          if (
            !item ||
            typeof item.word !== "string"
          ) {
            return false;
          }

          const cleanWord =
            item.word
              .trim()
              .toLowerCase()
              .normalize("NFD")
              .replace(
                /[\u0300-\u036f]/g,
                ""
              )
              .replace(/đ/g, "d");

          if (!cleanWord) {
            return false;
          }

          const escapedWord =
            cleanWord.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            );

          if (cleanWord.length <= 3) {
            const regex = new RegExp(
              `(^|[^a-z0-9])${escapedWord}([^a-z0-9]|$)`,
              "i"
            );

            return regex.test(fullText);
          }

          return fullText.includes(
            cleanWord
          );
        });

      // ==========================================================
      // 6. PHÁT HIỆN TỪ CẤM
      // ==========================================================

      if (hasBannedWord) {
        return NextResponse.json(
          {
            error:
              "Nội dung hoặc tên chứa từ ngữ không phù hợp!",
          },
          {
            status: 400,
          }
        );
      }
    }

    // ============================================================
    // 7. LƯU WISH
    // ============================================================

    const {
      data,
      error,
    } = await supabase
      .from("fan_wishes")
      .insert([
        {
          idol_id: Number(idolId),
          guest_name: trimmedName,
          content: trimmedContent,
          is_hidden: false,
          user_id: user?.id ?? null,
        },
      ])
      .select()
      .single();

    // ============================================================
    // 8. LỖI INSERT
    // ============================================================

    if (error) {
      console.error(
        "❌ Lỗi insert fan_wishes:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Không thể gửi lời nhắn. Vui lòng thử lại.",
        },
        {
          status: 500,
        }
      );
    }

    // ============================================================
    // 9. SUCCESS & CLEAR CACHE
    // ============================================================

    // 2. Ép Redis xóa sạch cache cũ để web tải lại dữ liệu mới nhất
    await clearWishesCache();

    return NextResponse.json(
      {
        success: true,
        wish: data,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "❌ API Wishes Submit Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.",
      },
      {
        status: 500,
      }
    );
  }
}