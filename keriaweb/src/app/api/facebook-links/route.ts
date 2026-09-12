import { NextResponse } from "next/server";

export async function GET() {
  const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
  const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

  if (!PAGE_ID || !ACCESS_TOKEN) {
    return NextResponse.json({ error: "Thiếu cấu hình Facebook" }, { status: 500 });
  }

  try {
    // Gọi API lấy trực tiếp trường 'permalink_url' của 4 bài mới nhất
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${PAGE_ID}/posts?fields=permalink_url&limit=4&access_token=${ACCESS_TOKEN}`,
      { next: { revalidate: 3600 } } // Cache 1 tiếng để tránh gọi API quá nhiều
    );
    
    const data = await res.json();

    if (data.error) throw new Error(data.error.message);

    // Trích xuất ra mảng chỉ chứa các link url
    const urls = data.data
      .map((post: any) => post.permalink_url)
      .filter(Boolean); // Lọc bỏ các bài không có link

    return NextResponse.json(urls);
  } catch (error) {
    console.error("Lỗi khi lấy link Facebook:", error);
    return NextResponse.json({ error: "Lỗi kết nối" }, { status: 500 });
  }
}