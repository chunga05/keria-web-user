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
  // CUSTOM MODAL
  // ==========================================================

  const [modal, setModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });

  const showModal = (message: string) => {
    setModal({ isOpen: true, message });
  };

  const closeModal = () => {
    setModal({ isOpen: false, message: "" });
  };

  const [selectedWish, setSelectedWish] = useState<any>(null);

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
} = useWishes(1, 9, visitorId, showModal);

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
            currentUser.display_name ||
            currentUser.username ||
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
          currentUser.display_name ||
          user?.username ||
          currentUser.username ||
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
          currentUser.display_name ||
          user?.username ||
          currentUser.username ||
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
          showModal("Bạn chỉ được gửi lời chúc sau mỗi 24h. Vui lòng quay lại sau nhé!");
          return;
        }
      }
    }

    // --------------------------------------------------------
    // CHƯA LOGIN
    // --------------------------------------------------------
    if (!isLoggedIn && !guestName.trim()) {
      showModal("Vui lòng nhập tên người gửi.");
      return;
    }

    // --------------------------------------------------------
    // CONTENT
    // --------------------------------------------------------
    if (!wishContent.trim()) {
      showModal("Vui lòng nhập lời chúc.");
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
        pt-[100px] lg:pt-[150px]
        pb-[60px] lg:pb-[100px]
      "
    >
      {/* ====================================================== */}
      {/* OUTER SCALE CONTAINER                                  */}
      {/* ====================================================== */}

      <div
        className="
          mx-auto
          w-[92%]
          lg:w-[60%]
          max-w-[1200px]
        "
      >
        {/* ==================================================== */}
        {/* DESIGN CANVAS                                        */}
        {/* ==================================================== */}

        <div
          className="
            relative
            w-full
          "
        >
          {/* ================================================= */}
          {/* FORM NHẬP LỜI CHÚC */}
          {/* ================================================= */}

          <div
            className="
              relative
              mx-auto
              w-full lg:w-[80%]
              rounded-[16px] lg:rounded-1xl
              bg-white
              shadow-sm
              mb-8 lg:mb-12
              px-5 sm:px-8 lg:px-[60px]
              pt-14 lg:pt-[72px]
              pb-8 lg:pb-[48px]
            "
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
                w-[220px] sm:w-[280px] lg:w-[384px]
                -top-[22px] sm:-top-[28px] lg:-top-[38px]
              "
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
                text-lg lg:text-[24px]
                mb-6 lg:mb-9
              "
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
                <div className="mb-5 lg:mb-7">
                  <label
                    className="
                      mb-2
                      block
                      font-bold
                      text-gray-800
                      text-sm lg:text-[14px]
                    "
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
                      text-sm lg:text-[14px]
                    "
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
                    mb-5 lg:mb-7
                    px-4 py-3
                    text-xs lg:text-[13px]
                  "
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

            <div className="mb-6 lg:mb-9">
              <label
                className="
                  mb-2
                  block
                  font-bold
                  text-gray-800
                  text-sm lg:text-[14px]
                "
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
                  text-sm lg:text-[14px]
                "
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
                  text-sm lg:text-[14px]
                  ${
                    isSubmitting ||
                    isCheckingAuth
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-[#FF76C3] hover:scale-105"
                  }
                `}
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
              mx-auto
              w-full lg:w-[90%] xl:w-[1080px]
              mb-6 lg:mb-8
            "
          >
            <div className="relative w-[200px] lg:w-[240px]">
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(
                    e.target.value
                  )
                }
                className="
                  appearance-none
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  font-bold
                  text-gray-800
                  outline-none
                  shadow-sm
                  focus:border-[#0070F3]
                  px-4 lg:px-5
                  py-3 lg:py-[10px]
                  text-sm lg:text-[14px]
                "
              >
                <option value="Mới nhất">
                  Mới nhất
                </option>

                <option value="Cũ nhất">
                  Cũ nhất
                </option>

                <option value="Nhiều lượt wish nhất">
                  Nhiều lượt wish nhất
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
    className="flex justify-center py-20"
  >
    <span
      className="font-bold text-gray-500 text-sm lg:text-[14px]"
    >
      Đang tải lời chúc...
    </span>
  </div>
) : messages.length === 0 ? (
  <div
    className="flex justify-center py-20"
  >
    <span
      className="font-bold text-gray-500 text-sm lg:text-[14px]"
    >
      Chưa có lời chúc nào.
    </span>
  </div>
) : (
  /*
   * ==========================================================
   * VÙNG WISH RIÊNG
   * ==========================================================
   */
  <div className="mx-auto w-full lg:w-[90%] xl:w-[1080px]">
    <div className="columns-1 md:columns-2 lg:columns-3 gap-3 md:gap-4">
      {messages.map((msg, index) => {
        return (
          <div
            key={msg.id}
            className={`
              relative
              mb-3 md:mb-4
              break-inside-avoid
              flex
              flex-col
              justify-start
              transition-transform
              hover:-translate-y-1
              px-4 py-3 md:px-5 lg:px-6
              ${
                msg.bgColor === "blue"
                  ? "bg-[#9CE2FF]"
                  : "bg-[#FFCBE8]"
              }
            `}
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
              mb-2
              gap-2 lg:gap-3
            "
          >
            {/* AVATAR + FRAME */}

            <div
              className="
                relative
                flex
                shrink-0
                items-center
                justify-center
                w-[42px] h-[42px]
                lg:w-[48px] lg:h-[48px]
              "
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

              <div
                className="
                  overflow-hidden
                  rounded-full
                  bg-[#FDE2EC]
                  text-[#FF76C3]
                  font-bold
                  flex
                  items-center
                  justify-center
                  w-[83.33%]
                  h-[83.33%]
                "
              >
                {msg.avatar ? (
                  <Image
                    src={msg.avatar}
                    alt={msg.author}
                    width={48}
                    height={48}
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                ) : (
                  <span className="text-xs lg:text-sm uppercase">
                    {msg.author?.trim()?.charAt(0) || "K"}
                  </span>
                )}
              </div>
            </div>

            {/* USER INFO */}

            <div>
              <div
                className="
                  flex
                  items-center
                  gap-1
                "
              >
                <span
                  className="
                    font-bold
                    text-gray-900
                    text-[13px] lg:text-[15px]
                  "
                >
                  {msg.author}
                </span>

                {msg.hasGoldStar && (
                  <span
                    className="text-yellow-400 text-[12px] lg:text-[14px]"
                  >
                    ⭐
                  </span>
                )}
              </div>

              <span
                className="
                  block
                  text-gray-600
                  text-[10px] lg:text-[12px]
                "
              >
                {msg.date}
              </span>
            </div>
          </div>

          {/* ================================================= */}
          {/* CONTENT */}
          {/* ================================================= */}

          <div className="flex-grow mb-2 flex flex-col">
            <p
              className={`
                break-words
                font-medium
                leading-relaxed
                text-black
                text-[12px] lg:text-[14px]
                ${msg.content?.length > 250 ? 'line-clamp-6' : ''}
              `}
            >
              {msg.content}
            </p>
            {msg.content?.length > 250 && (
              <button
                onClick={() => setSelectedWish(msg)}
                className="text-gray-600 hover:text-black hover:underline text-[12px] lg:text-[13px] self-start mt-1 font-bold transition-colors"
              >
                Xem thêm...
              </button>
            )}
          </div>

          {/* ================================================= */}
          {/* REACTIONS */}
          {/* ================================================= */}

          <div
            className="
              flex
              flex-wrap
              justify-center
              gap-3 lg:gap-4
            "
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
                        reaction.count,
                        hasReacted
                      )
                    }
                    className={`
                      flex
                      flex-col
                      items-center
                      rounded-lg
                      transition-all
                      gap-1 p-1
                      ${
                        hasReacted
                          ? "bg-white/50 scale-110 shadow-sm"
                          : "hover:scale-125 active:scale-95"
                      }
                    `}
                  >
                    {reaction.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={reaction.imageUrl}
                        alt={reaction.type}
                        className="w-5 h-5 lg:w-[25px] lg:h-[25px] object-contain block"
                      />
                    ) : (
                      <span
                        className="leading-none text-[16px] lg:text-[18px]"
                      >
                        {reaction.emoji}
                      </span>
                    )}

                    <span
                      className={`
                        font-bold
                        text-[9px] lg:text-[11px]
                        ${
                          hasReacted
                            ? "text-pink-600"
                            : "text-gray-800"
                        }
                      `}
                    >
                      {reaction.count}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>
        );
      })}
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
                mt-8 lg:mt-12
                gap-4 lg:gap-6
              "
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
                  w-8 h-8 lg:w-[32px] lg:h-[32px]
                  ${
                    currentPage <= 1
                      ? "cursor-not-allowed opacity-50"
                      : "hover:scale-105 hover:bg-[#0070F3]"
                  }
                `}
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
                  gap-1 lg:gap-2
                  mx-1 lg:mx-2
                "
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
                        w-8 h-8 lg:w-[32px] lg:h-[32px]
                        text-sm lg:text-[14px]
                        ${
                          currentPage ===
                          pageNum
                            ? "bg-[#0F0F4F] text-white"
                            : "bg-transparent text-gray-700 hover:bg-white hover:shadow-sm"
                        }
                      `}
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
                  w-8 h-8 lg:w-[32px] lg:h-[32px]
                  ${
                    currentPage >=
                    safeTotalPages
                      ? "cursor-not-allowed opacity-50"
                      : "hover:scale-105 hover:bg-[#FF4D91]"
                  }
                `}
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
      {/* ====================================================== */}
      {/* CUSTOM MODAL                                           */}
      {/* ====================================================== */}

      {modal.isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          onClick={closeModal}
        >
          <div
            className="relative flex flex-col items-center rounded-2xl bg-white shadow-2xl"
            style={{
              width: 340,
              paddingTop: 36,
              paddingBottom: 32,
              paddingLeft: 32,
              paddingRight: 32,
              gap: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* LOGO */}
            <div style={{ marginBottom: 12, width: 160 }}>
              <Image
                src="/images/DEARKERIAVN LOGO 1.png"
                alt="DearKeria Logo"
                width={320}
                height={120}
                className="h-auto w-full object-contain"
              />
            </div>

            {/* HEART ICON — góc trên trái, tràn ra ngoài khung */}
            <div
              className="absolute"
              style={{
                top: -28,
                left: -20,
                width: 72,
              }}
            >
              <Image
                src="/images/Heart 2.png"
                alt="heart"
                width={144}
                height={144}
                className="h-auto w-full object-contain"
              />
            </div>

            {/* MESSAGE */}
            <p
              className="text-center font-semibold text-gray-700"
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              {modal.message}
            </p>

            {/* OK BUTTON */}
            <button
              onClick={closeModal}
              className="rounded-full bg-[#FF76C3] font-bold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 40,
                paddingRight: 40,
                fontSize: 14,
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* WISH DETAILS MODAL                                     */}
      {/* ====================================================== */}
      {selectedWish && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setSelectedWish(null)}
        >
          <div
            className="relative flex flex-col w-full max-w-lg max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center gap-3 mb-5">
                <div className="overflow-hidden rounded-full bg-[#FDE2EC] text-[#FF76C3] font-bold flex items-center justify-center w-12 h-12 shrink-0">
                  {selectedWish.avatar ? (
                    <Image src={selectedWish.avatar} alt={selectedWish.author} width={48} height={48} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm uppercase">{selectedWish.author?.trim()?.charAt(0) || "K"}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-900 text-[15px]">{selectedWish.author}</span>
                    {selectedWish.hasGoldStar && <span className="text-yellow-400 text-[14px]">⭐</span>}
                  </div>
                  <span className="block text-gray-500 text-[12px]">{selectedWish.date}</span>
                </div>
              </div>
              <p className="whitespace-pre-wrap font-medium leading-relaxed text-black text-[14px] lg:text-[15px]">
                {selectedWish.content}
              </p>
            </div>
            
            <div className="p-4 border-t flex justify-end bg-gray-50">
              <button
                onClick={() => setSelectedWish(null)}
                className="rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-2 transition-colors text-[14px]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}