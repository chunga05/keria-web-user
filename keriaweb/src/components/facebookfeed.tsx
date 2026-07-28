"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
} from "lucide-react";

interface FacebookPost {
  id: number;
  name: string;
  date: string;
  content: string;
  image: string;
  likes: string;
  comments: string;
}

const posts: FacebookPost[] = [
  {
    id: 1,
    name: "DearKeriaVN",
    date: "10-01-2024",
    content:
      "Pellentesque tincidunt massa nec eros ornare vulputate....",
    image: "/images/Frame 1496.png",
    likes: "1000",
    comments: "100",
  },
  {
    id: 2,
    name: "DearKeriaVN",
    date: "10-01-2024",
    content:
      "Pellentesque tincidunt massa nec eros ornare vulputate....",
    image: "/images/Frame 1496.png",
    likes: "1000",
    comments: "100",
  },
  {
    id: 3,
    name: "DearKeriaVN",
    date: "10-01-2024",
    content:
      "Pellentesque tincidunt massa nec eros ornare vulputate....",
    image: "/images/Frame 1496.png",
    likes: "1000",
    comments: "100",
  },
];

export default function FacebookFeed() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const container = sliderRef.current;

    const scrollAmount = container.clientWidth / 3;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-[#f5f5f5] py-16 md:py-20">
      <div className="relative mx-auto w-full max-w-[1280px] px-10 md:px-16">

        {/* =========================
            NÚT TRÁI
        ========================== */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Previous Facebook posts"
          className="
            absolute
            left-2 md:left-0
            top-1/2
            z-20
            flex
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            bg-[#009FE3]
            text-white
            shadow-md
            transition-all
            duration-200
            hover:scale-105
            hover:shadow-lg
          "
        >
          <ChevronLeft
            size={25}
            strokeWidth={1.5}
          />
        </button>

        {/* =========================
            NÚT PHẢI
        ========================== */}
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Next Facebook posts"
          className="
            absolute
            right-2 md:right-0
            top-1/2
            z-20
            flex
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            bg-[#F45BA9]
            text-white
            shadow-md
            transition-all
            duration-200
            hover:scale-105
            hover:shadow-lg
          "
        >
          <ChevronRight
            size={25}
            strokeWidth={1.5}
          />
        </button>

        {/* =========================
            FACEBOOK FEED
        ========================== */}
        <div
          ref={sliderRef}
          className="
            flex
            gap-4
            overflow-x-auto
            scroll-smooth
            scrollbar-hide
            snap-x
            snap-mandatory
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {posts.map((post) => (
            <article
              key={post.id}
              className="
                w-full
                shrink-0
                snap-start
                rounded-2xl
                bg-white
                p-4
                shadow-sm

                sm:w-[calc(50%-8px)]

                lg:w-[calc(33.333333%-11px)]
              "
            >
              {/* =========================
                  HEADER
              ========================== */}
              <div className="flex items-center justify-between">

                {/* Avatar + Name */}
                <div className="flex items-center gap-2">

                  {/* Avatar */}
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-pink-50">
                    <Image
                      src="/images/DEARKERIAVN LOGO 1.png"
                      alt="DearKeriaVN"
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>

                  {/* Name + Date */}
                  <div>
                    <p className="text-[14px] font-semibold leading-tight text-[#333]">
                      {post.name}
                    </p>

                    <p className="mt-0.5 text-[11px] leading-tight text-gray-400">
                      {post.date}
                    </p>
                  </div>
                </div>

                {/* Facebook Icon */}
                <div
                  className="
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#1877F2]
                    text-white
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-white"
                    aria-hidden="true"
                  >
                    <path d="M14 8h3V4h-3c-3.31 0-5 1.79-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.55.45-1 1-1z" />
                  </svg>
                </div>
              </div>

              {/* =========================
                  CONTENT
              ========================== */}
              <p className="mt-3 text-[13px] leading-[1.5] text-[#555]">
                {post.content}

                <span className="ml-1 cursor-pointer text-[#009FE3]">
                  See more
                </span>
              </p>

              {/* =========================
                  POST IMAGE
              ========================== */}
              <div
                className="
                  relative
                  mt-3
                  aspect-square
                  w-full
                  overflow-hidden
                  rounded-lg
                  bg-gray-100
                "
              >
                <Image
                  src={post.image}
                  alt="DearKeriaVN Facebook post"
                  fill
                  sizes="
                    (max-width: 640px) 90vw,
                    (max-width: 1024px) 45vw,
                    30vw
                  "
                  className="object-cover"
                />
              </div>

              {/* =========================
                  ACTIONS
              ========================== */}
              <div className="mt-3 flex items-center gap-5">

                {/* Like */}
                <div className="flex items-center gap-2 text-gray-500">
                  <Heart
                    size={20}
                    strokeWidth={1.5}
                  />

                  <span className="text-[12px]">
                    {post.likes}
                  </span>
                </div>

                {/* Comment */}
                <div className="flex items-center gap-2 text-gray-500">
                  <MessageCircle
                    size={20}
                    strokeWidth={1.5}
                  />

                  <span className="text-[12px]">
                    {post.comments}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}