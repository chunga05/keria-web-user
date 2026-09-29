import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const supabase = await createClient();

    // ============================================================
    // 1. LẤY PROJECT ID TỪ URL
    // Ví dụ: /api/projects/1/stages
    // ============================================================

    const { id } = await params;

    const projectId = Number(id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json(
        {
          error: "projectId không hợp lệ",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // 2. KIỂM TRA PROJECT CÓ TỒN TẠI KHÔNG
    // ============================================================

    const {
      data: project,
      error: projectError,
    } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .maybeSingle();

    if (projectError) {
      console.error(
        "❌ Lỗi khi tìm project:",
        projectError
      );

      return NextResponse.json(
        {
          error: projectError.message,
        },
        {
          status: 500,
        }
      );
    }

    if (!project) {
      return NextResponse.json(
        {
          error: "Không tìm thấy project",
        },
        {
          status: 404,
        }
      );
    }

    // ============================================================
    // 3. LẤY CÁC CHẶNG CỦA PROJECT
    // ============================================================

    const {
      data: stages,
      error: stagesError,
    } = await supabase
      .from("project_stages")
      .select(
        "id, project_id, stage_order, stage_name, stamp_image_url"
      )
      .eq("project_id", projectId)
      .order("stage_order", {
        ascending: true,
      });

    if (stagesError) {
      console.error(
        "❌ Lỗi khi truy vấn project_stages:",
        stagesError
      );

      return NextResponse.json(
        {
          error: stagesError.message,
        },
        {
          status: 500,
        }
      );
    }

    // ============================================================
    // 4. TRẢ VỀ ARRAY STAGES
    // ============================================================

    return NextResponse.json(
      stages ?? [],
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "❌ API Error /api/projects/[id]/stages:",
      error
    );

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}