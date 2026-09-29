import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // ============================================================
    // 1. TÌM PROJECT ĐANG ACTIVE
    // ============================================================

    const {
      data: activeProject,
      error: projectError,
    } = await supabase
      .from("projects")
      .select("id")
      .eq("is_active", true)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (projectError) {
      console.error(
        "❌ Lỗi khi tìm project active:",
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

    if (!activeProject) {
      return NextResponse.json(
        {
          error: "Không tìm thấy dự án đang hoạt động",
        },
        {
          status: 404,
        }
      );
    }

    const projectId = activeProject.id;

    // ============================================================
    // 2. LẤY CÁC CHẶNG CỦA PROJECT ACTIVE
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
    // 3. TRẢ VỀ PROJECT ID + STAGES
    // ============================================================

    return NextResponse.json(
      {
        projectId,
        stages: stages ?? [],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "❌ API Error /api/projects/active:",
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