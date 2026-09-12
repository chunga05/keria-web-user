"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getPosts, Post } from "@/hooks/postServices"; // Nhớ trỏ đúng đường dẫn file service

export default function KeriaBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Tải danh sách bài viết khi vào trang
  useEffect(() => {
    async function fetchKeriaPosts() {
      setLoading(true);
      const { data } = await getPosts();
      if (data) {
        setPosts(data);
      }
      setLoading(false);
    }
    fetchKeriaPosts();
  }, []);

  return (
    <section className="relative w-full h-auto bg-[#f3f4f6] flex flex-col items-center mx-auto [container-type:inline-size] pt-[clamp(40px,6cqw,80px)]">
      
      {/* Khung chứa các bài viết */}
      <div className="relative w-[70%] mb-[clamp(60px,10vw,180px)] grid grid-cols-1 md:grid-cols-2 gap-[clamp(16px,1.6cqw,24px)] z-10">
        
        {loading ? (
          <p className="col-span-full text-center text-gray-500 py-10">Đang tải bài viết...</p>
        ) : posts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-10">Chưa có bài viết nào được đăng.</p>
        ) : (
          posts.map((post) => {
            // Lấy ảnh đầu tiên làm thumbnail, nếu không có dùng ảnh mặc định
            const thumbnail = post.image_urls && post.image_urls.length > 0 
              ? post.image_urls[0] 
              : "/images/Frame 1495 (2).png";

            // Định dạng ngày tháng
            const formattedDate = new Date(post.created_at).toLocaleDateString("vi-VN");

            return (
              <div 
                key={post.id} 
                className="bg-white rounded-[clamp(12px,1.1cqw,16px)] px-[clamp(16px,2.2cqw,32px)] py-[clamp(12px,1.4cqw,20px)] shadow-sm flex flex-col justify-between min-h-[clamp(350px,35cqw,450px)]"
              >
                {/* Phần Ảnh */}
                <div className="relative w-full h-[clamp(200px,25cqw,320px)] rounded-[clamp(8px,0.8cqw,12px)] overflow-hidden mb-[clamp(10px,1.1cqw,16px)] bg-gray-100">
                  <Image 
                    src={thumbnail} 
                    alt="Post Image" 
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Tác giả & Ngày đăng */}
                <div className="flex items-center justify-between mb-[clamp(8px,0.8cqw,12px)] text-[clamp(10px,0.8cqw,12px)] text-gray-500">
                  <div className="flex items-center gap-[clamp(4px,0.5cqw,8px)]">
                    <div className="w-[clamp(20px,1.6cqw,24px)] h-[clamp(20px,1.6cqw,24px)] rounded-full bg-pink-100 flex items-center justify-center overflow-hidden">
                      <span className="text-[clamp(8px,0.7cqw,10px)] font-bold text-pink-500">D</span>
                    </div>
                    <span className="font-semibold text-gray-800">DearKeriaVN</span>
                  </div>
                  <span>{formattedDate}</span>
                </div>

                {/* Nội dung bài viết */}
                <p className="text-gray-600 text-[clamp(12px,1cqw,14px)] leading-relaxed mb-[clamp(10px,1.1cqw,16px)] line-clamp-3 flex-grow whitespace-pre-line">
                  {post.content || "Không có nội dung."}
                </p>

                {/* Tương tác (Chỉ hiển thị, không bấm được) */}
                <div className="flex items-center justify-between pt-[clamp(8px,0.8cqw,12px)] border-t border-gray-100 text-gray-500 text-[clamp(12px,1cqw,14px)]">
                  <div className="flex items-center gap-[clamp(12px,1.1cqw,16px)]">
                    <div className="flex items-center gap-1 text-gray-500">
                      <span>🤍</span> <span>{post.likes_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <span>💬</span> <span>{post.comments_count || 0}</span>
                    </div>
                  </div>
                  <button className="hover:text-black transition-colors">
                    <span>↗</span>
                  </button>
                </div>

              </div>
            );
          })
        )}

      </div>

      {/* Vách ngăn trang trí */}
      <div className="absolute bottom-0 left-0 w-full z-60 flex items-end translate-y-[80%] pointer-events-none">
        <Image 
          src="/images/vachngan3.png" 
          alt="Vách ngăn giấy rách" 
          width={1440} 
          height={100} 
          className="w-full h-auto object-cover drop-shadow-md object-bottom"
        />
      </div>

    </section>
  );
}