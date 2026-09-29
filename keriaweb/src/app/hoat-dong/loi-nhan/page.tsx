"use client";

import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import Image from "next/image";

import { useWishes } from "../../../hooks/usewishes";

import { getCurrentJwtUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import fpPromise from "@fingerprintjs/fingerprintjs";


// ============================================================
// DESIGN
// ============================================================

const DESIGN_WIDTH = 1200;

// ============================================================
// PAGE
// ============================================================

export default function ToMyDearestPage() {
  // ==========================================================
// FINGERPRINT (NHẬN DIỆN THIẾT BỊ)
// ==========================================================
    const [visitorId, setVisitorId] = useState<string | null>(null);

    useEffect(() => {
      // Khởi tạo và lấy ID thiết bị khi load trang
      const initFingerprint = async () => {
        try {
          const fp = await fpPromise.load();
          const result = await fp.get();
          setVisitorId(result.visitorId);
        } catch (error) {
          console.error("Lỗi khi lấy fingerprint:", error);
        }
      };
      initFingerprint();
    }, []);
  // ==========================================================
  // SCALE
  // ==========================================================

  const scaleContainerRef =
    useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);

  // ==========================================================
  // FILTER
  // ==========================================================

  const [filter, setFilter] =
    useState("Mới nhất");

  const [currentPage, setCurrentPage] =
    useState(1);

  // ==========================================================
  // WISH FORM
  // ==========================================================

  const [guestName, setGuestName] =
    useState("");

  const [wishContent, setWishContent] =
    useState("");

  // ==========================================================
  // USER ĐĂNG NHẬP
  // ==========================================================

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [isCheckingAuth, setIsCheckingAuth] =
    useState(true);

  // ==========================================================
  // HOOK WISH
  // ==========================================================

  const {
  messages,
  isLoading,
  isSubmitting,
  totalPages,
  userReactions,
  fetchWishes,
  submitWish,
  handleReact,
} = useWishes(1, 9, visitorId);

  // ==========================================================
  // TÍNH SCALE
  // ==========================================================

  useEffect(() => {
    const element =
      scaleContainerRef.current;

    if (!element) return;

    const updateScale = () => {
      const width =
        element.clientWidth;

      if (!width) return;

      const nextScale =
        width / DESIGN_WIDTH;

      setScale(nextScale);
    };

    updateScale();

    const observer =
      new ResizeObserver(() => {
        updateScale();
      });

    observer.observe(element);

    window.addEventListener(
      "resize",
      updateScale
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "resize",
        updateScale
      );
    };
  }, []);

  // ==========================================================
  // KIỂM TRA USER ĐĂNG NHẬP
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        setIsCheckingAuth(true);

        const currentUser = await getCurrentJwtUser();

        if (!mounted) return;

        // ------------------------------------------------------
        // CHƯA ĐĂNG NHẬP
        // ------------------------------------------------------

        if (!currentUser) {
          setIsLoggedIn(false);
          setGuestName("");
          return;
        }

        // ------------------------------------------------------
        // ĐÃ ĐĂNG NHẬP
        // ------------------------------------------------------

        setIsLoggedIn(true);

        const {
          data: user,
          error,
        } = await supabase
          .from("users")
          .select(
            "display_name, username"
          )
          .eq(
            "id",
            currentUser.id
          )
          .maybeSingle();

        if (error) {
          console.error(
            "❌ Không lấy được thông tin user:",
            error
          );

          setGuestName(
            currentUser.user_metadata
              ?.full_name ||
              currentUser.user_metadata
                ?.name ||
              currentUser.email?.split(
                "@"
              )[0] ||
              "Thành viên"
          );

          return;
        }

        // ------------------------------------------------------
        // ƯU TIÊN TÊN
        // ------------------------------------------------------

        const displayName =
          user?.display_name ||
          user?.username ||
          currentUser.user_metadata
            ?.full_name ||
          currentUser.user_metadata?.name ||
          currentUser.email?.split(
            "@"
          )[0] ||
          "Thành viên";

        setGuestName(displayName);
      } catch (error) {
        console.error(
          "❌ Lỗi kiểm tra đăng nhập:",
          error
        );

        if (mounted) {
          setIsLoggedIn(false);
          setGuestName("");
        }
      } finally {
        if (mounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkUser();

    // ========================================================
    // THEO DÕI AUTH
    // ========================================================

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event) => {
        if (!mounted) return;

        const currentUser = await getCurrentJwtUser();

        if (!currentUser) {
          setIsLoggedIn(false);
          setGuestName("");
          return;
        }

        setIsLoggedIn(true);

        const { data: user } =
          await supabase
            .from("users")
            .select(
              "display_name, username"
            )
            .eq(
              "id",
              currentUser.id
            )
            .maybeSingle();

        if (!mounted) return;

        const displayName =
          user?.display_name ||
          user?.username ||
          currentUser.user_metadata
            ?.full_name ||
          currentUser.user_metadata?.name ||
          currentUser.email?.split(
            "@"
          )[0] ||
          "Thành viên";

        setGuestName(displayName);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ==========================================================
  // ĐỔI FILTER -> RESET PAGE
  // ==========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // ==========================================================
  // FETCH WISH
  // ==========================================================

  useEffect(() => {
    fetchWishes(
      filter,
      currentPage
    );
  }, [
    filter,
    currentPage,
    fetchWishes,
  ]);

  // ==========================================================
  // SEND WISH
  // ==========================================================

  const handleSend = () => {
    // --------------------------------------------------------
    // KIỂM TRA FINGERPRINT & THỜI GIAN (24 GIỜ)
    // --------------------------------------------------------
    if (visitorId) {
      const lastWishTime = localStorage.getItem(`lastWishTime_${visitorId}`);
      if (lastWishTime) {
        const timePassed = Date.now() - parseInt(lastWishTime, 10);
        const hours24 = 24 * 60 * 60 * 1000; // 24 giờ tính bằng milliseconds

        if (timePassed < hours24) {
          alert("Mỗi thiết bị chỉ được gửi 1 lời chúc trong vòng 24 giờ. Vui lòng quay lại sau!");
          return;
        }
      }
    }

    // --------------------------------------------------------
    // CHƯA LOGIN
    // --------------------------------------------------------
    if (!isLoggedIn && !guestName.trim()) {
      alert("Vui lòng nhập tên người gửi.");
      return;
    }

    // --------------------------------------------------------
    // CONTENT
    // --------------------------------------------------------
    if (!wishContent.trim()) {
      alert("Vui lòng nhập lời chúc.");
      return;
    }

    // --------------------------------------------------------
    // SUBMIT
    // --------------------------------------------------------
    submitWish(
      guestName,
      wishContent,
      () => {
        setWishContent("");

        // ----------------------------------------------------
        // LƯU THỜI GIAN GỬI VÀO LOCAL STORAGE KHI THÀNH CÔNG
        // ----------------------------------------------------
        if (visitorId) {
          localStorage.setItem(`lastWishTime_${visitorId}`, Date.now().toString());
        }

        // ----------------------------------------------------
        // NẾU CHƯA LOGIN -> XÓA TÊN
        // ----------------------------------------------------
        if (!isLoggedIn) {
          setGuestName("");
        }

        // ----------------------------------------------------
        // RESET PAGE
        // ----------------------------------------------------
        setCurrentPage(1);
        fetchWishes("Mới nhất", 1);
      }
    );
  };
  // ==========================================================
  // PAGINATION
  // ==========================================================

  const safeTotalPages =
    Math.max(
      1,
      totalPages
    );

  const pagesArray =
    Array.from(
      {
        length:
          safeTotalPages,
      },
      (_, i) => i + 1
    );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main
      className="
        min-h-screen
        w-full
        bg-[#F4F5F7]
        font-sans
      "
      style={{
        paddingTop: 150,
        paddingBottom: 100,
      }}
    >
      {/* ====================================================== */}
      {/* OUTER SCALE CONTAINER                                  */}
      {/* ====================================================== */}

      <div
        ref={scaleContainerRef}
        className="
          mx-auto
          w-[60%]
        "
      >
        {/* ==================================================== */}
        {/* DESIGN CANVAS                                        */}
        {/* ==================================================== */}

        <div
          className="
            relative
            w-[1200px]
            origin-top-left
          "
          style={{
            zoom: scale,
          }}
        >
          {/* ================================================= */}
          {/* FORM NHẬP LỜI CHÚC */}
          {/* ================================================= */}

          <div
            className="
              relative
              mx-auto
              w-[80%]
              rounded-1xl
              bg-white
              shadow-sm
            "
            style={{
              marginBottom: 48,
              paddingLeft: 60,
              paddingRight: 60,
              paddingTop: 72,
              paddingBottom: 48,
            }}
          >
            {/* ================================================= */}
            {/* LOGO TO MY DEAREST */}
            {/* ================================================= */}

            <div
              className="
                absolute
                left-1/2
                -translate-x-1/2
                drop-shadow-md
              "
              style={{
                top: -38,
                width: 384,
              }}
            >
              <Image
                src="/images/tomydear.png"
                alt="To My Dearest"
                width={461}
                height={88}
                priority
                className="
                  h-auto
                  w-full
                  object-contain
                "
              />
            </div>

            {/* ================================================= */}
            {/* TITLE */}
            {/* ================================================= */}

            <h2
              className="
                text-center
                font-black
                tracking-wide
                text-black
              "
              style={{
                marginBottom: 36,
                fontSize: 24,
              }}
            >
              <span className="text-[#FF76C3]">
                ♥
              </span>{" "}
              LỜI CHÚC MỪNG SINH NHẬT
              TỚI KERIA{" "}
              <span className="text-[#FF76C3]">
                ♥
              </span>
            </h2>

            {/* ================================================= */}
            {/* TÊN NGƯỜI GỬI */}
            {/* ================================================= */}

            {!isCheckingAuth &&
              !isLoggedIn && (
                <div
                  style={{
                    marginBottom: 28,
                  }}
                >
                  <label
                    className="
                      mb-2
                      block
                      font-bold
                      text-gray-800
                    "
                    style={{
                      fontSize: 14,
                    }}
                  >
                    Tên người gửi
                  </label>

                  <input
                    type="text"
                    placeholder="Name"
                    value={guestName}
                    onChange={(e) =>
                      setGuestName(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-100
                      bg-[#FAFAFA]
                      px-4
                      py-3
                      outline-none
                      focus:border-[#FF76C3]
                      focus:ring-1
                      focus:ring-[#FF76C3]
                    "
                    style={{
                      fontSize: 14,
                    }}
                  />
                </div>
              )}

            {/* ================================================= */}
            {/* USER ĐĂNG NHẬP */}
            {/* ================================================= */}

            {!isCheckingAuth &&
              isLoggedIn && (
                <div
                  className="
                    rounded-lg
                    bg-pink-50
                    text-gray-600
                  "
                  style={{
                    marginBottom: 28,
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 11,
                    paddingBottom: 11,
                    fontSize: 13,
                  }}
                >
                  Đang gửi lời chúc với tên{" "}
                  <span className="font-bold text-[#FF76C3]">
                    {guestName}
                  </span>
                </div>
              )}

            {/* ================================================= */}
            {/* NỘI DUNG */}
            {/* ================================================= */}

            <div
              style={{
                marginBottom: 36,
              }}
            >
              <label
                className="
                  mb-2
                  block
                  font-bold
                  text-gray-800
                "
                style={{
                  fontSize: 14,
                }}
              >
                Viết lời chúc mừng sinh nhật
                tới Keria
              </label>

              <textarea
                rows={5}
                placeholder="Nhập lời chúc..."
                value={wishContent}
                onChange={(e) =>
                  setWishContent(
                    e.target.value
                  )
                }
                className="
                  w-full
                  resize-none
                  rounded-lg
                  border
                  border-gray-100
                  bg-[#FAFAFA]
                  px-4
                  py-3
                  outline-none
                  focus:border-[#FF76C3]
                  focus:ring-1
                  focus:ring-[#FF76C3]
                "
                style={{
                  fontSize: 14,
                }}
              />
            </div>

            {/* ================================================= */}
            {/* SEND */}
            {/* ================================================= */}

            <div
              className="
                flex
                justify-center
              "
            >
              <button
                onClick={handleSend}
                disabled={
                  isSubmitting ||
                  isCheckingAuth
                }
                className={`
                  rounded-md
                  px-10
                  py-3
                  font-bold
                  text-white
                  shadow-sm
                  transition-transform
                  ${
                    isSubmitting ||
                    isCheckingAuth
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-[#FF76C3] hover:scale-105"
                  }
                `}
                style={{
                  fontSize: 14,
                }}
              >
                {isSubmitting
                  ? "Đang gửi..."
                  : "Gửi Lời Chúc"}
              </button>
            </div>
          </div>

          {/* ================================================= */}
          {/* BỘ LỌC */}
          {/* ================================================= */}

          <div
            className="
              flex
              justify-start
            "
            style={{
              marginLeft: "5%",
              marginBottom: 30,
            }}
          >
            <div className="relative">
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(
                    e.target.value
                  )
                }
                className="
                  appearance-none
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  font-bold
                  text-gray-800
                  outline-none
                  shadow-sm
                  focus:border-[#0070F3]
                "
                style={{
                  paddingLeft: 20,
                  paddingRight: 40,
                  paddingTop: 10,
                  paddingBottom: 10,
                  fontSize: 14,
                }}
              >
                <option value="Mới nhất">
                  Mới nhất
                </option>

                <option value="Cũ nhất">
                  Cũ nhất
                </option>
              </select>

              {/* ================================================= */}
              {/* ARROW */}
              {/* ================================================= */}

              <div
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* DANH SÁCH WISH */}
          {/* ================================================= */}

          {isLoading ? (
  <div
    className="flex justify-center"
    style={{
      paddingTop: 80,
      paddingBottom: 80,
    }}
  >
    <span
      className="font-bold text-gray-500"
      style={{
        fontSize: 14,
      }}
    >
      Đang tải lời chúc...
    </span>
  </div>
) : messages.length === 0 ? (
  <div
    className="flex justify-center"
    style={{
      paddingTop: 80,
      paddingBottom: 80,
    }}
  >
    <span
      className="font-bold text-gray-500"
      style={{
        fontSize: 14,
      }}
    >
      Chưa có lời chúc nào.
    </span>
  </div>
) : (
  /*
   * ==========================================================
   * VÙNG WISH RIÊNG
   *
   * 1200px = canvas chính
   * 1080px = canvas của danh sách lời nhắn
   *
   * => Card nhỏ hơn nhưng tỷ lệ nội bộ vẫn giữ nguyên
   * ==========================================================
   */
  <div
    className="mx-auto"
    style={{
      width: 1080,
    }}
  >
    <div
      className="columns-3"
      style={{
        columnGap: 20,
      }}
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`
            relative
            mb-5
            break-inside-avoid
            flex
            flex-col
            justify-between
            transition-transform
            hover:-translate-y-1
            ${
              msg.bgColor === "blue"
                ? "bg-[#9CE2FF]"
                : "bg-[#FFCBE8]"
            }
          `}
          style={{
            padding: 20,
          }}
        >
          {/* ================================================= */}
          {/* STAR */}
          {/* ================================================= */}

          {msg.decorationStar !== "none" && (
            <div
              className="
                absolute
                z-10
                rotate-12
                opacity-90
              "
              style={{
                right: -14,
                top: -14,
                width: 54,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  stroke={
                    msg.decorationStar === "pink"
                      ? "#FF76C3"
                      : "#0070F3"
                  }
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          {/* ================================================= */}
          {/* AVATAR */}
          {/* ================================================= */}

          <div
            className="
              flex
              items-center
            "
            style={{
              marginBottom: 12,
              gap: 10,
            }}
          >
            {/* AVATAR + FRAME */}

            <div
              className="
                relative
                flex
                shrink-0
                items-center
                justify-center
              "
              style={{
                width: 42,
                height: 42,
              }}
            >
              {/* FRAME */}

              {msg.frameUrl && (
                <div
                  className="
                    pointer-events-none
                    absolute
                    z-10
                  "
                  style={{
                    inset: "-25%",
                  }}
                >
                  <Image
                    src={msg.frameUrl}
                    alt="avatar-frame"
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              {/* AVATAR */}

              {msg.avatar && (
                <div
                  className="
                    overflow-hidden
                    rounded-full
                    bg-gray-300
                  "
                  style={{
                    width: "83.33%",
                    height: "83.33%",
                  }}
                >
                  <Image
                    src={msg.avatar}
                    alt={msg.author}
                    width={36}
                    height={36}
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                </div>
              )}
            </div>

            {/* USER INFO */}

            <div>
              <div
                className="
                  flex
                  items-center
                "
                style={{
                  gap: 3,
                }}
              >
                <span
                  className="
                    font-bold
                    text-gray-900
                  "
                  style={{
                    fontSize: 13,
                  }}
                >
                  {msg.author}
                </span>

                {msg.hasGoldStar && (
                  <span
                    className="text-yellow-400"
                    style={{
                      fontSize: 12,
                    }}
                  >
                    ⭐
                  </span>
                )}
              </div>

              <span
                className="
                  block
                  text-gray-600
                "
                style={{
                  fontSize: 10,
                }}
              >
                {msg.date}
              </span>
            </div>
          </div>

          {/* ================================================= */}
          {/* CONTENT */}
          {/* ================================================= */}

          <p
            className="
              flex-grow
              break-words
              font-medium
              leading-relaxed
              text-black
            "
            style={{
              marginBottom: 24,
              fontSize: 12,
            }}
          >
            {msg.content}
          </p>

          {/* ================================================= */}
          {/* REACTIONS */}
          {/* ================================================= */}

          <div
            className="
              flex
              flex-wrap
              justify-center
            "
            style={{
              gap: 16,
            }}
          >
           {(msg.reactions || []).map(
              (
                reaction: any,
                index: number
              ) => {
                const hasReacted = userReactions[msg.id]?.includes(
                  reaction.type
                );

                return (
                  <button
                    key={index}
                    onClick={() =>
                      handleReact(
                        msg.id,
                        reaction.type,
                        reaction.count
                      )
                    }
                    className={`
                      flex
                      flex-col
                      items-center
                      rounded-lg
                      transition-all
                      ${
                        hasReacted
                          ? "bg-white/50 scale-110 shadow-sm"
                          : "hover:scale-125 active:scale-95"
                      }
                    `}
                    style={{
                      gap: 3,
                      padding: 5,
                    }}
                  >
                    <span
                      className="leading-none"
                      style={{
                        fontSize: 18,
                      }}
                    >
                      {reaction.emoji}
                    </span>

                    <span
                      className={`
                        font-bold
                        ${
                          hasReacted
                            ? "text-pink-600"
                            : "text-gray-800"
                        }
                      `}
                      style={{
                        fontSize: 9,
                      }}
                    >
                      {reaction.count}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
          {/* ================================================= */}
          {/* PAGINATION */}
          {/* ================================================= */}

          {!isLoading && (
            <div
              className="
                flex
                items-center
                justify-center
              "
              style={{
                marginTop: 48,
                gap: 24,
              }}
            >
              {/* PREVIOUS */}

              <button
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      Math.max(
                        1,
                        prev - 1
                      )
                  )
                }
                disabled={
                  currentPage <= 1
                }
                className={`
                  flex
                  items-center
                  justify-center
                  rounded
                  bg-[#00A3FF]
                  text-white
                  shadow-sm
                  transition-all
                  ${
                    currentPage <= 1
                      ? "cursor-not-allowed opacity-50"
                      : "hover:scale-105 hover:bg-[#0070F3]"
                  }
                `}
                style={{
                  width: 32,
                  height: 32,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>

              {/* PAGE NUMBERS */}

              <div
                className="
                  flex
                "
                style={{
                  gap: 8,
                  marginLeft: 8,
                  marginRight: 8,
                }}
              >
                {pagesArray.map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() =>
                        setCurrentPage(
                          pageNum
                        )
                      }
                      className={`
                        flex
                        items-center
                        justify-center
                        rounded
                        font-bold
                        shadow-sm
                        transition-all
                        ${
                          currentPage ===
                          pageNum
                            ? "bg-[#0F0F4F] text-white"
                            : "bg-transparent text-gray-700 hover:bg-white hover:shadow-sm"
                        }
                      `}
                      style={{
                        width: 32,
                        height: 32,
                        fontSize: 14,
                      }}
                    >
                      {pageNum}
                    </button>
                  )
                )}
              </div>

              {/* NEXT */}

              <button
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      Math.min(
                        safeTotalPages,
                        prev + 1
                      )
                  )
                }
                disabled={
                  currentPage >=
                  safeTotalPages
                }
                className={`
                  flex
                  items-center
                  justify-center
                  rounded
                  bg-[#FF76C3]
                  text-white
                  shadow-sm
                  transition-all
                  ${
                    currentPage >=
                    safeTotalPages
                      ? "cursor-not-allowed opacity-50"
                      : "hover:scale-105 hover:bg-[#FF4D91]"
                  }
                `}
                style={{
                  width: 32,
                  height: 32,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}