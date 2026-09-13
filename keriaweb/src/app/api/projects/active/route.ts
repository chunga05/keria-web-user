// app/api/projects/[id]/stages/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    let targetProjectId: number;

    // Nếu truyền id là 'active' thì tự tìm project active mới nhất
    if (id === 'active') {
      const { data: activeProj, error: projError } = await supabase
        .from('projects')
        .select('id')
        .eq('is_active', true)
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (projError || !activeProj) {
        return NextResponse.json(
          { error: 'Không tìm thấy dự án đang hoạt động' },
          { status: 404 }
        );
      }

      targetProjectId = activeProj.id;
    } else {
      targetProjectId = Number(id);
      if (isNaN(targetProjectId)) {
        return NextResponse.json(
          { error: 'ID dự án không hợp lệ' },
          { status: 400 }
        );
      }
    }

    // Query các chặng theo targetProjectId
    const { data, error } = await supabase
      .from('project_stages')
      .select('id, project_id, stage_order, stage_name, stamp_image_url')
      .eq('project_id', targetProjectId)
      .order('stage_order', { ascending: true });

    if (error) {
      console.error('Lỗi khi truy vấn project_stages:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err: any) {
    console.error('API Error /api/projects/[id]/stages:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}