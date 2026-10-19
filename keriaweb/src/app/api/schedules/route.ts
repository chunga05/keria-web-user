import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export interface ScheduleItem {
  id: string;
  title: string;
  type: "match" | "stream" | "event";
  tournament?: string | null;
  opponent?: string | null;
  opponent_logo?: string | null;
  event_date: string;
  location?: string | null;
  bo?: string | null;
  score?: string | null;
  status: "upcoming" | "live" | "finished";
  stream_url?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Dữ liệu dự phòng chất lượng cao khi DB chưa có hoặc lỗi kết nối tạm thời
const FALLBACK_SCHEDULES: ScheduleItem[] = [
  {
    id: "match-t1-geng",
    title: "T1 vs Gen.G - Đại chiến LCK",
    type: "match",
    tournament: "LCK 2026 Regular Season",
    opponent: "Gen.G",
    opponent_logo: "/images/teams/geng.svg",
    event_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    location: "LoL Park, Seoul, Hàn Quốc",
    bo: "BO3",
    score: null,
    status: "upcoming",
    stream_url: "https://www.youtube.com/@LCKvietnam",
    description: "Trận tâm điểm vòng bảng LCK giữa hai đối thủ truyền kiếp T1 và Gen.G.",
  },
  {
    id: "stream-chzzk-rank",
    title: "Chzzk Live Stream - Keria Solo Q Thách Đấu Hàn",
    type: "stream",
    tournament: "Livestream cá nhân",
    opponent: null,
    opponent_logo: null,
    event_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    location: "Chzzk Live Channel",
    bo: null,
    score: null,
    status: "upcoming",
    stream_url: "https://chzzk.naver.com/4b39bbf870fc6cf72a514d7c0e6203cf",
    description: "Keria lên sóng livestream luyện tập tướng mới và giao lưu cùng người hâm mộ.",
  },
  {
    id: "match-t1-hle",
    title: "T1 vs Hanwha Life Esports",
    type: "match",
    tournament: "LCK 2026 Regular Season",
    opponent: "Hanwha Life Esports",
    opponent_logo: "/images/teams/hle.svg",
    event_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    location: "LoL Park, Seoul, Hàn Quốc",
    bo: "BO3",
    score: null,
    status: "upcoming",
    stream_url: "https://www.youtube.com/@LCKvietnam",
    description: "Cuộc đối đầu kịch tính tại vòng bảng LCK.",
  },
  {
    id: "event-fansign",
    title: "T1 Fan Meeting & Keria Fansign Special",
    type: "event",
    tournament: "Sự kiện cộng đồng",
    opponent: null,
    opponent_logo: null,
    event_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    location: "T1 Base Camp, Seoul",
    bo: null,
    score: null,
    status: "upcoming",
    stream_url: "https://t1.gg",
    description: "Sự kiện ký tặng và giao lưu thân mật giữa T1 Keria và người hâm mộ.",
  },
  {
    id: "match-t1-dk",
    title: "T1 vs Dplus KIA",
    type: "match",
    tournament: "LCK 2026 Regular Season",
    opponent: "Dplus KIA",
    opponent_logo: "/images/teams/dk.svg",
    event_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    location: "LoL Park, Seoul, Hàn Quốc",
    bo: "BO3",
    score: null,
    status: "upcoming",
    stream_url: "https://www.youtube.com/@LCKvietnam",
    description: "T1 đối đầu Dplus KIA.",
  },
  {
    id: "match-t1-kt",
    title: "T1 vs KT Rolster - Telecom War",
    type: "match",
    tournament: "LCK 2026 Regular Season",
    opponent: "KT Rolster",
    opponent_logo: "/images/teams/kt.svg",
    event_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: "LoL Park, Seoul, Hàn Quốc",
    bo: "BO3",
    score: "2 - 1",
    status: "finished",
    stream_url: "https://www.youtube.com/@LCKvietnam",
    description: "T1 chiến thắng thuyết phục 2-1 trong trận Telecom War nghẹt thở.",
  },
  {
    id: "match-t1-kdf",
    title: "T1 vs Kwangdong Freecs",
    type: "match",
    tournament: "LCK 2026 Regular Season",
    opponent: "Kwangdong Freecs",
    opponent_logo: "/images/teams/kdf.png",
    event_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    location: "LoL Park, Seoul, Hàn Quốc",
    bo: "BO3",
    score: "2 - 0",
    status: "finished",
    stream_url: "https://www.youtube.com/@LCKvietnam",
    description: "Chiến thắng áp đảo 2-0 với màn trình diễn POG xuất sắc từ Keria.",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "all" | "match" | "stream" | "event"
    const status = searchParams.get("status"); // "all" | "upcoming" | "live" | "finished"

    let query = supabase
      .from("schedules")
      .select("*")
      .order("event_date", { ascending: true });

    if (type && type !== "all") {
      query = query.eq("type", type);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Dùng fallback schedules nếu DB chưa có hoặc có lỗi kết nối
      let filtered = [...FALLBACK_SCHEDULES];
      if (type && type !== "all") {
        filtered = filtered.filter((i) => i.type === type);
      }
      if (status && status !== "all") {
        filtered = filtered.filter((i) => i.status === status);
      }

      return NextResponse.json(
        {
          success: true,
          data: filtered,
          source: "fallback",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        source: "database",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Lỗi API Schedules:", error);
    return NextResponse.json(
      {
        success: true,
        data: FALLBACK_SCHEDULES,
        source: "fallback_error",
      },
      { status: 200 }
    );
  }
}
