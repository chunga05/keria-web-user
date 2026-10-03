// app/api/wishes/submit/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { verifyAccessToken } from "@/lib/jwt";
// 1. Import hàm xóa cache từ Server Action
import { clearWishesCache } from "@/app/actions/wishes";

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

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

    // Hàm chống XSS: Chuyển đổi các ký tự đặc biệt thành HTML entities
    const escapeHtml = (unsafe: string) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const trimmedName =
      typeof guestName === "string"
        ? escapeHtml(guestName.trim())
        : "";

    const trimmedContent =
      typeof content === "string"
        ? escapeHtml(content.trim())
        : "";

    // ============================================================
    // 2. LẤY THÔNG TIN USER HIỆN TẠI (NẾU ĐÃ ĐĂNG NHẬP)
    // ============================================================

    const cookieStore = await cookies();
    let accessToken = cookieStore.get("dkvn_at")?.value;
    const authHeader = request.headers.get("authorization");
    if (!accessToken && authHeader?.startsWith("Bearer ")) {
      accessToken = authHeader.substring(7).trim();
    }

    let userId: string | null = null;
    let userNick: string | null = null;

    if (accessToken) {
      const payload = await verifyAccessToken(accessToken);
      if (payload?.sub) {
        userId = payload.sub;
      }
    }

    // Fallback sang Supabase auth nếu không có dkvn_at
    if (!userId) {
      const supabaseUser = await createClient();
      const {
        data: { user },
      } = await supabaseUser.auth.getUser();
      if (user?.id) {
        userId = user.id;
      }
    }

    // Nếu đã đăng nhập: lấy tên nick (display_name hoặc username) từ DB
    if (userId) {
      const { data: profile } = await supabaseAdmin
        .from("users")
        .select("display_name, username")
        .eq("id", userId)
        .maybeSingle();

      userNick = profile?.display_name || profile?.username || null;
    }

    // Xác định tên người gửi:
    // - Đã đăng nhập: lấy tên nick của tài khoản
    // - Chưa đăng nhập: lấy tên khách tự nhập
    const finalAuthorName = userId
      ? (userNick || trimmedName || "Thành viên")
      : trimmedName;

    // ============================================================
    // 3. KIỂM TRA DỮ LIỆU
    // ============================================================

    if (!userId && !finalAuthorName) {
      return NextResponse.json(
        {
          error: "Vui lòng nhập tên người gửi!",
        },
        {
          status: 400,
        }
      );
    }

    if (!trimmedContent) {
      return NextResponse.json(
        {
          error: "Vui lòng nhập lời chúc!",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // 4. LẤY DANH SÁCH TỪ CẤM
    // ============================================================

    const {
      data: bannedWordsData,
      error: bannedWordsError,
    } = await supabaseAdmin
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
        `${finalAuthorName} ${trimmedContent}`
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
    } = await supabaseAdmin
      .from("fan_wishes")
      .insert([
        {
          idol_id: Number(idolId),
          guest_name: finalAuthorName,
          content: trimmedContent,
          is_hidden: false,
          user_id: userId,
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

    // Ép Redis xóa sạch cache cũ để web tải lại dữ liệu mới nhất
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