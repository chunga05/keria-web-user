// app/api/projects/[id]/stages/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = Number(id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'ID dự án không hợp lệ' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Query các chặng thuộc project từ Supabase
    const { data, error } = await supabase
      .from('project_stages')
      .select('id, project_id, stage_order, stage_name, stamp_image_url')
      .eq('project_id', projectId)
      .order('stage_order', { ascending: true });

    if (error) {
      console.error('Lỗi khi truy vấn project_stages:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error('API Error /api/projects/[id]/stages:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}