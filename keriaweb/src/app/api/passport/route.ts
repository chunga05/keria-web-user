
// app/api/passport/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {}
          },
        },
      }
    );

    // =========================================================
    // 1. KIỂM TRA USER ĐĂNG NHẬP
    // =========================================================
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          nickname: 'Khách',
          passportCode: '---',
          departureDate: '--/--/----',
          location: 'Chưa cập nhật',
          userStamps: [],
          receivedStageIds: [],
          projects: [],
        },
        { status: 401 }
      );
    }

    console.log('📘 [Passport API] User:', user.id);

    // =========================================================
    // 2. LẤY THÔNG TIN USER
    // =========================================================
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('display_name, username, address, status')
      .eq('id', user.id)
      .maybeSingle();

    if (userData && (userData.status === 'banned' || userData.status === 'rejected')) {
      return NextResponse.json(
        { error: 'Tài khoản của bạn đã bị khóa hoặc từ chối.' },
        { status: 403 }
      );
    }

    if (userError) {
      console.warn(
        '⚠️ [Passport API] Không lấy được users:',
        userError.message
      );
    }

    // =========================================================
    // 3. LẤY PASSPORT
    // =========================================================
    const { data: passport, error: passportError } = await supabase
      .from('passports')
      .select('id, passport_code, issue_date')
      .eq('user_id', user.id)
      .maybeSingle();

    if (passportError) {
      console.warn(
        '⚠️ [Passport API] Không lấy được passport:',
        passportError.message
      );
    }

    // =========================================================
    // 4. LẤY TOÀN BỘ STAMP USER ĐÃ SỞ HỮU
    //
    // Dùng user_id trực tiếp vì passport_stamps hiện có:
    // id, user_id, stage_id, request_id, received_at, passport_id
    // =========================================================
    const { data: passportStamps, error: stampsError } = await supabase
      .from('passport_stamps')
      .select(`
        id,
        user_id,
        stage_id,
        request_id,
        received_at,
        passport_id
      `)
      .eq('user_id', user.id)
      .order('received_at', { ascending: true });

    if (stampsError) {
      console.error(
        '❌ [Passport API] Lỗi lấy passport_stamps:',
        stampsError.message
      );
    }

    const userStamps = passportStamps || [];

    console.log(
      '🏆 [Passport API] Stamp tìm thấy:',
      userStamps.length,
      userStamps
    );

    // Danh sách stage_id user đã sở hữu
    const receivedStageIds = userStamps.map((stamp: any) =>
      Number(stamp.stage_id)
    );

    console.log(
      '🎯 [Passport API] receivedStageIds:',
      receivedStageIds
    );

    // =========================================================
    // 5. LẤY TOÀN BỘ PROJECT
    // =========================================================
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('id, title')
      .eq('is_active', true)
      .order('id', { ascending: true });

    if (projectsError) {
      console.error(
        '❌ [Passport API] Lỗi lấy projects:',
        projectsError.message
      );
    }

    // =========================================================
    // 6. LẤY TOÀN BỘ PROJECT STAGES
    // =========================================================
    const { data: stagesData, error: stagesError } = await supabase
      .from('project_stages')
      .select(`
        id,
        project_id,
        stage_name,
        stamp_image_url,
        stage_order
      `)
      .order('stage_order', { ascending: true });

    if (stagesError) {
      console.error(
        '❌ [Passport API] Lỗi lấy project_stages:',
        stagesError.message
      );
    }

    // =========================================================
    // 7. MAP STAMP -> STAGE -> PROJECT
    // =========================================================

    // Dùng Set để tìm stage nhanh hơn
    const receivedStageSet = new Set(
      receivedStageIds.map((id) => Number(id))
    );

    const formattedProjects = (projectsData || []).map((project: any) => {
      // Các stage thuộc project này
      const projectStages = (stagesData || []).filter(
        (stage: any) =>
          Number(stage.project_id) === Number(project.id)
      );

      // Chỉ lấy stage mà user đã nhận stamp
      const ownedStamps = projectStages
        .filter((stage: any) =>
          receivedStageSet.has(Number(stage.id))
        )
        .map((stage: any) => {
          // Tìm bản ghi passport_stamps tương ứng
          const ownedRecord = userStamps.find(
            (stamp: any) =>
              Number(stamp.stage_id) === Number(stage.id)
          );

          return {
            id: Number(stage.id),
            stage_name: stage.stage_name || `Chặng ${stage.id}`,
            stamp_image_url:
              stage.stamp_image_url ||
              '/images/handbook/stamp.png',
            stage_order: Number(stage.stage_order || 0),
            received_at: ownedRecord?.received_at || null,
          };
        })
        .sort(
          (a: any, b: any) =>
            a.stage_order - b.stage_order
        );

      console.log(
        `📖 [Passport API] Project ${project.id} - ${project.title}:`,
        ownedStamps
      );

      return {
        id: Number(project.id),
        title: project.title,
        ownedStamps,
      };
    });

    // =========================================================
    // 8. FORMAT NGÀY KHỞI HÀNH
    // =========================================================
    const issueDate = passport?.issue_date
      ? new Date(passport.issue_date)
      : null;

    const formattedDepartureDate =
      issueDate && !isNaN(issueDate.getTime())
        ? issueDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : 'Chưa cập nhật';

    // =========================================================
    // 9. THÔNG TIN HIỂN THỊ
    // =========================================================
    const resolvedNickname =
      userData?.display_name ||
      userData?.username ||
      user.user_metadata?.full_name ||
      'Chani';

    const resolvedAddress =
      userData?.address || 'Chưa cập nhật';

    // =========================================================
    // 10. TRẢ DATA CHO HANDBOOK
    // =========================================================
    const responseData = {
      nickname: resolvedNickname,

      passportCode:
        passport?.passport_code || 'CHƯA CẤP MÃ',

      departureDate: formattedDepartureDate,

      location: resolvedAddress,

      userStamps,

      receivedStageIds,

      projects: formattedProjects,
    };

    console.log(
      '📘 [Passport API] FINAL:',
      JSON.stringify(responseData, null, 2)
    );

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error(
      '❌ [Passport API] Internal Error:',
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

