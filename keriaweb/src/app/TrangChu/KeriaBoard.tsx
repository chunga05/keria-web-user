"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Post } from "@/hooks/postServices"; 
import { getCachedPosts } from "@/app/actions/post";

export default function KeriaBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // LOAD POSTS VỚI REDIS CACHE
  // =========================================================
  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getCachedPosts(1, 10);
        if (!cancelled) {
          setPosts(data);
        }
      } catch (error) {
        console.error("❌ Không thể tải Posts:", error);
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      className="
        relative
        w-full
        bg-[#F3F4F6]
        flex
        flex-col
        items-center
        pt-[150px]
        overflow-visible
      "
    >
      {/* Nâng max-w lên 1280px để ở 100% hiển thị rộng rãi, đầm mắt hơn */}
      <div className="w-[65%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] w-full">
          {loading ? (
            <div className="col-span-2 flex justify-center py-[100px]">
              <p className="text-gray-500 text-[15px]">
                Đang tải bài viết...
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className="col-span-2 flex justify-center py-[100px]">
              <p className="text-gray-500 text-[15px]">
                Chưa có bài viết nào được đăng.
              </p>
            </div>
          ) : (
            posts.map((post, index) => {
              const thumbnail =
                post.image_urls &&
                post.image_urls.length > 0
                  ? post.image_urls[0]
                  : "/images/Frame 1495 (2).png";

              const formattedDate = post.created_at
                ? new Date(
                    post.created_at
                  ).toLocaleDateString("vi-VN")
                : "";

              return (
                <motion.article
                  key={post.id}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.55,
                    ease: "easeOut",
                    delay: index * 0.07,
                  }}
                  className="
                    group
                    bg-white
                    rounded-[18px]
                    px-[28px]
                    py-[22px]
                    flex
                    flex-col
                    justify-between
                    min-h-[440px]
                    shadow-[0_10px_35px_rgba(236,72,153,0.08)]
                    transition-shadow
                    duration-400
                    ease-out
                    hover:shadow-[0_22px_50px_rgba(236,72,153,0.22)]
                  "
                >
                  {/* Khung ảnh tăng chiều cao lên h-[360px], giữ trọn vẹn ảnh không bị crop */}
                  <div
                  className="
                    relative
                    w-full
                    h-[360px]
                    rounded-[14px]
                    overflow-hidden
                    mb-[10px]
                    bg-gray-100
                  "
                >
                  <Image
                    src={thumbnail}
                    alt="Post Image"
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="
                      object-cover
                      w-full
                      h-full
                      transition-transform
                      duration-500
                      ease-out
                      group-hover:scale-110
                    "
                  />
                </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mb-[12px]
                      text-[13px]
                      text-gray-500
                    "
                  >
                    <div className="flex items-center gap-[10px]">
                      <div
                        className="
                          w-[26px]
                          h-[26px]
                          rounded-full
                          bg-pink-100
                          flex
                          items-center
                          justify-center
                          overflow-hidden
                        "
                      >
                        <span className="text-[11px] font-bold text-pink-500">
                          D
                        </span>
                      </div>

                      <span className="font-semibold text-gray-800 text-[14px]">
                        DearKeriaVN
                      </span>
                    </div>

                    <span>{formattedDate}</span>
                  </div>

                  <p
                    className="
                      text-gray-600
                      text-[14px]
                      leading-relaxed
                      mb-[16px]
                      line-clamp-3
                      flex-grow
                      whitespace-pre-line
                    "
                  >
                    {post.content || "Không có nội dung."}
                  </p>

                  <div
                    className="
                      flex
                      items-center
                      justify-end
                      pt-[12px]
                      border-t
                      border-gray-100
                      text-gray-500
                      text-[15px]
                    "
                  >
                    <button
                      type="button"
                      className="
                        hover:text-black
                        transition-colors
                        cursor-pointer
                        font-bold
                      "
                    >
                      ↗
                    </button>
                  </div>
                </motion.article>
              );
            })
          )}
        </div>
      </div>

      <div
        className="
          relative
          w-full
          pointer-events-none
          mt-[80px]
          translate-y-[80px]
          z-20
        "
      >
        <Image
          src="/images/vachngan3.png"
          alt="Vách ngăn giấy rách"
          width={1440}
          height={100}
          sizes="100vw"
          className="
            w-full
            h-auto
            object-cover
            object-bottom
            drop-shadow-md
          "
        />
      </div>
    </section>
  );
}