"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Post } from "@/hooks/postServices"; 
import { getCachedPosts } from "@/app/actions/post";
import { getMediaUrl } from "@/lib/utils";

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
        pt-[80px] md:pt-[150px]
        pb-[40px] md:pb-[50px] overflow-visible
      "
    >
      <div className="w-[92%] md:w-[65%] mx-auto mb-[80px] ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] md:gap-[40px] w-full">
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
                  ? getMediaUrl(post.image_urls[0])
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
                    p-[16px] md:px-[28px] md:py-[22px]
                    flex
                    flex-col
                    justify-between
                    min-h-[auto] md:min-h-[440px]
                    shadow-[0_10px_35px_rgba(236,72,153,0.08)]
                    transition-shadow
                    duration-400
                    ease-out
                    hover:shadow-[0_22px_50px_rgba(236,72,153,0.22)]
                  "
                >
                  <div
                  className="
                    relative
                    w-full
                    h-[300px] md:h-[360px]
                    rounded-[14px]
                    overflow-hidden
                    mb-[12px] md:mb-[10px]
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
                      text-gray-700
                      text-[14px] md:text-[15px]
                      leading-relaxed
                      mb-[16px]
                      line-clamp-4
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
                      justify-between
                      pt-[12px]
                      text-gray-500
                      text-[15px]
                    "
                  >
                    {/* Left: Interactions */}
                    <div className="flex items-center gap-[20px]">
                      <button className="flex items-center gap-[6px] hover:text-pink-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[22px] h-[22px]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        <span className="text-[14px] font-medium text-gray-600">1000</span>
                      </button>
                      <button className="flex items-center gap-[6px] hover:text-pink-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[22px] h-[22px]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                        </svg>
                        <span className="text-[14px] font-medium text-gray-600">100</span>
                      </button>
                    </div>

                    {/* Right: Share */}
                    <button
                      type="button"
                      className="
                        hover:text-pink-500
                        transition-colors
                        cursor-pointer
                      "
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[22px] h-[22px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                      </svg>
                    </button>
                  </div>
                </motion.article>
              );
            })
          )}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none translate-y-[45%] z-20"
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