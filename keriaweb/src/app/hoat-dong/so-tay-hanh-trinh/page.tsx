'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { BookOpen, Award, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { InstructionModal } from './instruction-modal';
import { NhanDauModal } from './nhan-dau-modal';

import { usePassportData } from '@/hooks/usePassportData';
import { supabase } from '@/lib/supabase';
import { getCurrentJwtUser } from '@/lib/auth';
import { isFeatureEnabled, FEATURES } from '@/config/features';
import UnderConstruction from '@/components/UnderConstruction';

export default function SoTayHanhTrinhPage() {
  const isEnabled = isFeatureEnabled(FEATURES.HANDBOOK);
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);
  const [isNhanDauOpen, setIsNhanDauOpen] = useState(false);

  // Phân trang hiển thị từng bên trên Mobile
  const [mobileSide, setMobileSide] = useState<'left' | 'right'>('left');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Touch swipe support cho mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      if (isMobile) handleMobileNext();
      else handleDesktopNext();
    } else if (diff < -45) {
      if (isMobile) handleMobilePrev();
      else handleDesktopPrev();
    }
    setTouchStartX(null);
  };

  // ============================================================
  // AUTH
  // ============================================================

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ============================================================
  // KIỂM TRA ĐĂNG NHẬP
  // ============================================================

  useEffect(() => {
    if (!isEnabled) {
      setCheckingAuth(false);
      return;
    }

    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log('🔐 [Handbook] Đang kiểm tra đăng nhập...');

        let activeUserId: string | null = null;

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.id) {
            activeUserId = user.id;
          }
        } catch {
          // Ignore supabase get user error, fallback to JWT
        }

        if (!activeUserId) {
          const jwtUser = await getCurrentJwtUser();
          if (jwtUser?.id) {
            activeUserId = jwtUser.id;
          }
        }

        if (!mounted) return;

        if (!activeUserId) {
          console.log('🚫 [Handbook] Chưa đăng nhập → chuyển sang login');
          setIsAuthenticated(false);
          router.replace('/login?next=/hoat-dong/so-tay-hanh-trinh');
          return;
        }

        console.log('✅ [Handbook] Đã đăng nhập:', activeUserId);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ [Handbook] Không thể kiểm tra đăng nhập:', error);
        if (mounted) {
          setIsAuthenticated(false);
          router.replace('/login?next=/hoat-dong/so-tay-hanh-trinh');
        }
      } finally {
        if (mounted) {
          setCheckingAuth(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  // ============================================================
  // PASSPORT DATA
  // ============================================================

  const {
    passportInfo,
    isLoading,
  } = usePassportData(isAuthenticated);

  // ============================================================
  // DEBUG
  // ============================================================

  useEffect(() => {
    if (!isAuthenticated) return;
  }, [passportInfo, isAuthenticated]);

  // ============================================================
  // PHÂN TRANG
  // ============================================================

  const [turnIndex, setTurnIndex] = useState(0);
  const [projectPages, setProjectPages] = useState<any[]>([]);
  const [maxTurnIndex, setMaxTurnIndex] = useState(0);

  // ============================================================
  // ĐỒNG BỘ PROJECT
  // ============================================================

  useEffect(() => {
    if (
      !isAuthenticated ||
      !passportInfo ||
      !Array.isArray(passportInfo.projects)
    ) {
      setProjectPages([]);
      setMaxTurnIndex(0);
      return;
    }

    const dynamicPages = [
      ...passportInfo.projects,
      null,
      null,
      null,
      null,
      null,
    ];

    setProjectPages(dynamicPages);

    setMaxTurnIndex(
      Math.ceil(dynamicPages.length / 2)
    );

    setTurnIndex(0);
  }, [
    passportInfo,
    isAuthenticated,
  ]);

  // ============================================================
  // ĐIỀU HƯỚNG PREV / NEXT (Hỗ trợ cả Mobile từng trang & Laptop 2 trang)
  // ============================================================

  const isMobileFirstPage = isMobile && isOpen && turnIndex === 0 && mobileSide === 'left';
  const isMobileLastPage = isMobile && isOpen && turnIndex >= maxTurnIndex && mobileSide === 'right';

  const handleMobilePrev = () => {
    if (!isOpen) return;
    if (mobileSide === 'right') {
      setMobileSide('left');
    } else {
      if (turnIndex > 0) {
        setTurnIndex((prev) => prev - 1);
        setMobileSide('right');
      } else {
        setIsOpen(false);
      }
    }
  };

  const handleMobileNext = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTurnIndex(0);
      setMobileSide('left');
      return;
    }
    if (mobileSide === 'left') {
      setMobileSide('right');
    } else {
      if (turnIndex < maxTurnIndex) {
        setTurnIndex((prev) => prev + 1);
        setMobileSide('left');
      }
    }
  };

  const handleDesktopPrev = () => {
    if (!isOpen) return;
    if (turnIndex === 0) {
      setIsOpen(false);
    } else {
      setTurnIndex((prev) => prev - 1);
    }
  };

  const handleDesktopNext = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTurnIndex(0);
    } else if (turnIndex < maxTurnIndex) {
      setTurnIndex((prev) => prev + 1);
    }
  };

  const handlePrevAction = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isMobile) {
      handleMobilePrev();
    } else {
      handleDesktopPrev();
    }
  };

  const handleNextAction = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isMobile) {
      handleMobileNext();
    } else {
      handleDesktopNext();
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    handlePrevAction(e);
  };

  const handleNext = (e: React.MouseEvent) => {
    handleNextAction(e);
  };

  // ============================================================
  // INDEX PROJECT
  // ============================================================

  const leftIdx = (turnIndex - 1) * 2;
  const rightIdx = leftIdx + 1;

  const leftProject =
    turnIndex > 0 &&
    leftIdx >= 0 &&
    leftIdx < projectPages.length
      ? projectPages[leftIdx]
      : undefined;

  const rightProject =
    turnIndex > 0 &&
    rightIdx >= 0 &&
    rightIdx < projectPages.length
      ? projectPages[rightIdx]
      : undefined;

  // ============================================================
  // PROJECT CHO MODAL NHẬN DẤU
  // ============================================================

  const activeProjectIdForModal =
    leftProject?.id ??
    rightProject?.id ??
    projectPages.find(
      (p) => p !== null
    )?.id;

  // ============================================================
  // FEATURE FLAG GUARD
  // ============================================================

  if (!isEnabled) {
    return (
      <UnderConstruction
        variant="page"
        featureName="Sổ tay hành trình"
        estimatedRelease="Dự kiến cập nhật trong thời gian tới"
        showBackButton={true}
        backButtonHref="/hoat-dong/loi-nhan"
      />
    );
  }

  // ============================================================
  // ĐANG KIỂM TRA ĐĂNG NHẬP
  // ============================================================

  if (checkingAuth) {
    return (
      <main className="relative w-screen h-screen overflow-hidden bg-[#7CB9E8] flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-5 shadow-xl text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#FF69B4]" />
          <p className="text-gray-600 font-semibold">
            Đang kiểm tra đăng nhập...
          </p>
        </div>
      </main>
    );
  }

  // ============================================================
  // CHƯA ĐĂNG NHẬP
  // ============================================================

  if (!isAuthenticated) {
    return null;
  }

  // ============================================================
  // GIAO DIỆN HANDBOOK
  // ============================================================

  return (
    <main className="relative w-full h-[calc(100dvh-68px)] md:h-[calc(100vh-80px)] min-h-[560px] overflow-hidden select-none bg-[#7CB9E8]">
      <section className="relative w-full h-full flex items-center justify-center">

        {/* =====================================================
            LỚP NỀN TỦ ĐỒ
            ===================================================== */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/images/locker.png"
            alt="Locker Background"
            fill
            priority
            sizes="100vw"
            className="w-full h-full object-cover"
          />
        </div>

        {/* =====================================================
            NÚT BẤM GÓC PHẢI
            ===================================================== */}
        <div className="absolute top-3 right-3 md:top-[5%] md:right-[5%] z-30 flex items-center gap-1.5 sm:gap-2 md:gap-4">
          <InteractiveHoverButton
            text="Hướng Dẫn"
            hoverText="Xem ngay"
            icon={<BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />}
            bgColor="#0091FF"
            expandColor="#0077D4"
            onClick={() => setIsInstructionOpen(true)}
          />

          <InteractiveHoverButton
            text="Nhận Dấu"
            hoverText="Check-in"
            icon={<Award className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />}
            bgColor="#FF69B4"
            expandColor="#E0559E"
            onClick={() => setIsNhanDauOpen(true)}
          />
        </div>

        {/* =====================================================
            CÁC NGÔI SAO TRANG TRÍ
            ===================================================== */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-[4%] md:top-[7%] left-[2%] md:left-[4%] w-[20%] md:w-[13%] aspect-square">
            <Image src="/images/element/darkblue.png" alt="Star" fill className="object-contain" />
          </div>
          <div className="absolute top-[5%] md:top-[6%] right-[-3%] md:right-[-2%] w-[28%] md:w-[18%] aspect-square">
            <Image src="/images/element/lightpink.png" alt="Star" fill className="object-contain" />
          </div>
          <div className="absolute bottom-[5%] -left-[1%] md:-left-[0.5%] w-[28%] md:w-[19%] aspect-square">
            <Image src="/images/element/lightblue.png" alt="Star" fill className="object-contain" />
          </div>
          <div className="absolute bottom-[1%] -left-[1%] md:-left-[0.5%] w-[18%] md:w-[12%] aspect-square">
            <Image src="/images/element/pink.png" alt="Star" fill className="object-contain" />
          </div>
          <div className="absolute bottom-[6%] md:bottom-[8%] right-[4%] md:right-[5%] w-[18%] md:w-[12%] aspect-square">
            <Image src="/images/element/blue.png" alt="Star" fill className="object-contain" />
          </div>
        </div>

        {/* =====================================================
            NÚT ĐIỀU HƯỚNG MÀN HÌNH (TRÁI & PHẢI)
            ===================================================== */}
        <button
          onClick={handlePrevAction}
          disabled={!isOpen}
          aria-label="Trang trước / Đóng sổ"
          className={`absolute left-1 sm:left-3 md:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-[4px] sm:rounded-md bg-[#0091FF] text-white items-center justify-center shadow-md transition-all duration-200 active:scale-90 hover:brightness-110 ${
            !isOpen || isMobileFirstPage ? 'hidden md:flex opacity-50 cursor-not-allowed' : 'flex opacity-100 cursor-pointer'
          }`}
        >
          <ArrowLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={handleNextAction}
          disabled={isMobile ? isMobileLastPage : (isOpen && turnIndex >= maxTurnIndex)}
          aria-label="Trang sau / Mở sổ"
          className={`absolute right-1 sm:right-3 md:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-[4px] sm:rounded-md bg-[#FF69B4] text-white flex items-center justify-center shadow-md transition-all duration-200 active:scale-90 hover:brightness-110 ${
            (isMobile ? isMobileLastPage : (isOpen && turnIndex >= maxTurnIndex)) ? 'opacity-40 cursor-not-allowed' : 'opacity-100 cursor-pointer'
          }`}
        >
          <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 stroke-[2.5]" />
        </button>

        {/* =====================================================
            CONTAINER CUỐN SỔ (Responsive Mobile hiển thị từng bên, Desktop 2 trang)
            ===================================================== */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`
            relative z-20 aspect-[720/1024] md:aspect-[792/1070] [perspective:3000px]
            w-[86vw] max-w-[410px] md:w-[44vw] lg:w-[36vw] xl:w-[35%]
            transition-all duration-[700ms] ease-[cubic-bezier(0.25,1,0.5,1)]
            ${isOpen
              ? 'overflow-hidden md:overflow-visible translate-x-0 md:translate-x-[50%] scale-100 md:scale-100 lg:scale-100 xl:scale-[1.02]'
              : 'overflow-visible translate-x-0 scale-100 md:scale-[1.55] lg:scale-[1.28] xl:scale-100'
            }
          `}
        >
          {/* NÚT ĐÓNG SỔ (MOBILE) */}
          {isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                setTurnIndex(0);
                setMobileSide('left');
              }}
              className="md:hidden absolute top-[2%] left-[3%] z-50 px-2.5 py-0.5 rounded-full bg-white/90 hover:bg-white text-[9px] font-bold text-gray-700 shadow-md backdrop-blur-xs transition-all active:scale-95"
            >
              Đóng sổ ✕
            </button>
          )}

          {/* ===================================================
              A. RUỘT SỔ MỞ (Mobile trượt từng bên, Desktop mở cả 2 trang)
              =================================================== */}
          <div
            className={`
              absolute top-0 h-full select-none
              transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)]
              ${isOpen
                ? 'opacity-100 delay-100 pointer-events-auto [transform:scale(1)]'
                : 'opacity-0 pointer-events-none [transform:scale(0.95)]'
              }
              w-[200%] left-0
              ${mobileSide === 'right' ? '-translate-x-1/2' : 'translate-x-0'}
              md:left-[-100%] md:w-[200%] md:translate-x-0
              md:drop-shadow-[0_15px_35px_rgba(0,0,0,0.35)]
            `}
          >
            <Image
              src="/images/handbook/openbook.png"
              alt="Open Book Inside"
              fill
              className="w-full h-full object-fill md:object-contain pointer-events-none"
            />

            {/* NÚT ĐÓNG SỔ (DESKTOP) */}
            <button
              onClick={() => {
                setIsOpen(false);
                setTurnIndex(0);
              }}
              className="hidden md:block absolute top-[4%] left-[10%] z-40 px-2 py-0.5 md:px-3 md:py-1 xl:px-[1%] xl:py-[0.5%] rounded-full bg-white/80 hover:bg-white text-[8px] sm:text-[9px] md:text-[11px] lg:text-[12px] xl:text-[0.8vw] font-bold text-gray-700 shadow-sm transition-all"
            >
              Đóng sổ ✕
            </button>

            {/* NÚT LẬT TRANG TRÁI (DESKTOP) */}
            {turnIndex > 0 && (
              <button
                onClick={handlePrev}
                className="hidden xl:flex absolute top-1/2 -left-[4%] -translate-y-1/2 z-40 w-[6%] aspect-square rounded-full bg-white/90 hover:bg-white shadow-lg items-center justify-center text-[#0086ff] hover:scale-110 active:scale-95 transition-all"
              >
                <ChevronLeft className="w-[50%] h-[50%]" />
              </button>
            )}

            {/* NÚT LẬT TRANG PHẢI (DESKTOP) */}
            {turnIndex < maxTurnIndex && (
              <button
                onClick={handleNext}
                className="hidden xl:flex absolute top-1/2 -right-[4%] -translate-y-1/2 z-40 w-[6%] aspect-square rounded-full bg-white/90 hover:bg-white shadow-lg items-center justify-center text-[#0086ff] hover:scale-110 active:scale-95 transition-all"
              >
                <ChevronRight className="w-[50%] h-[50%]" />
              </button>
            )}

            {/* SỐ TRANG GÓC DƯỚI */}
            <div className="hidden md:block absolute bottom-[3%] left-1/2 -translate-x-1/2 z-30 px-2.5 py-0.5 md:px-3.5 md:py-1 xl:px-[2%] xl:py-[0.5%] rounded-full bg-black/40 text-white text-[10px] lg:text-[11px] xl:text-[0.7vw] font-bold backdrop-blur-xs whitespace-nowrap">
              {turnIndex === 0
                ? 'Trang bìa & Passport'
                : `Lượt trang ${turnIndex} / ${maxTurnIndex}`}
            </div>

            {/* LOADING */}
            {isLoading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 md:px-4 md:py-2 xl:px-[4%] xl:py-[1.5%] shadow-lg text-[9px] sm:text-[10px] md:text-[12px] lg:text-[13px] xl:text-[0.8vw] font-bold text-gray-600">
                  Đang mở sổ tay...
                </div>
              </div>
            )}

            {/* LƯỢT 0: 2 TRANG ĐẦU GỐC */}
            {turnIndex === 0 && (
              <>
                <div className="absolute top-[8%] left-[13%] w-[35%] h-[85%] sm:h-[86%] md:h-[88%] rounded-[14px] overflow-hidden drop-shadow-sm pointer-events-none z-10">
                  <Image src="/images/handbook/page1.png" alt="Page 1" fill className="w-full h-full object-contain" />
                  <div className="absolute top-[40%] left-[12%] w-[76%] aspect-[430/190]">
                    <Image src="/images/handbook/title_new.png" alt="Theo Dấu Chân Cún" fill className="w-full h-full object-contain drop-shadow" />
                  </div>
                </div>

                <div className="absolute top-[8%] right-[13.3%] w-[35%] h-[85%] sm:h-[86%] md:h-[88%] rounded-[14px] drop-shadow-sm z-10 overflow-visible p-[4%] pb-[5%] md:p-[5%] xl:p-[6%] flex flex-col justify-between">
                  <Image src="/images/handbook/page2.png" alt="Page 2" fill className="w-full h-full object-contain pointer-events-none -z-10" />
                  
                  <div className="relative w-full h-[50%] md:h-[52%] lg:h-[54%]">
                    <div className="absolute top-[12%] md:top-[14%] xl:top-[15%] -left-[12%] w-[65%] aspect-[3/4]">
                      <div className="relative w-full h-full">
                        <Image src="/images/handbook/anhbia_inner_new.png" alt="Anime Character" fill className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <div className="absolute top-[5%] left-[34%] w-[18%] aspect-square pointer-events-none z-20 rotate-6">
                      <Image src="/images/handbook/crown.png" alt="Crown" fill className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute -top-[7%] -left-[27%] w-[30%] aspect-[1/2] pointer-events-none z-20">
                      <Image src="/images/handbook/ghim.png" alt="Clip Star" fill className="w-full h-full object-contain drop-shadow-sm" />
                    </div>
                    <div className="absolute bottom-[8%] -left-[17%] w-[17%] aspect-square pointer-events-none z-20">
                      <Image src="/images/handbook/heart.png" alt="Heart sticker" fill className="w-full h-full object-contain drop-shadow-sm" />
                    </div>
                    <div className="absolute top-[15%] right-[-29%] w-[22%] aspect-square pointer-events-none z-20 rotate-12 drop-shadow-sm">
                      <Image src="/images/handbook/vientrang.png" alt="Star White Border" fill className="w-full h-full object-contain" />
                    </div>
                    
                    <div className="absolute top-[34%] right-[-7%] w-[65%] flex flex-col items-start gap-[2%] z-10">
                      <div className="relative w-full aspect-[260/100]">
                        <Image src="/images/handbook/smalltitle.png" alt="KERIA" fill className="w-full h-full object-contain" />
                      </div>
                      <div className="relative z-10 left-[7%] -mt-[14%] ml-[1%] w-[85%] aspect-[240/60] drop-shadow-sm">
                        <Image src="/images/handbook/pawport.png" alt="PAWPORT" fill className="w-full h-full object-contain" />
                      </div>
                    </div>

                    <div className="absolute bottom-[2%] md:bottom-[0%] lg:bottom-[-2%] xl:bottom-[-5%] right-[1%] w-[40%] md:w-[42%] lg:w-[45%] aspect-square pointer-events-none z-20">
                      <Image src="/images/handbook/arrow.png" alt="Arrow" fill className="w-full h-full object-contain drop-shadow-sm" />
                    </div>
                  </div>

                  {/* THÔNG TIN USER */}
                  <div className="absolute left-[13%] bottom-[3%] sm:bottom-[4%] md:bottom-[7%] lg:bottom-[9%] xl:bottom-[12%] w-[75%] flex flex-col gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-[6%] px-[2%] pb-[1%]">
                    <div className="flex flex-col">
                      <span className="text-[8.5px] sm:text-[9.5px] md:text-[10px] lg:text-[11px] xl:text-[0.8vw] text-gray-700 tracking-tight leading-none mb-0.5 md:mb-1 font-medium">Tên/Nickname</span>
                      <div className="w-full bg-white/80 rounded-[3px] md:rounded-md px-1.5 md:px-2.5 text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[1vw] font-semibold text-gray-800 shadow-sm border border-black/5 font-['SVN-BeCool'] antialiased h-[18px] sm:h-[20px] md:h-[22px] lg:h-[26px] xl:h-auto xl:min-h-[2.2vw] flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                        {passportInfo.nickname}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8.5px] sm:text-[9.5px] md:text-[10px] lg:text-[11px] xl:text-[0.8vw] text-gray-700 tracking-tight leading-none mb-0.5 md:mb-1 font-medium">Ngày khởi hành</span>
                      <div className="w-full bg-white/80 rounded-[3px] md:rounded-md px-1.5 md:px-2.5 text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[1vw] font-semibold text-gray-800 shadow-sm border border-black/5 font-['SVN-BeCool'] antialiased h-[18px] sm:h-[20px] md:h-[22px] lg:h-[26px] xl:h-auto xl:min-h-[2.2vw] flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                        {passportInfo.departureDate}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8.5px] sm:text-[9.5px] md:text-[10px] lg:text-[11px] xl:text-[0.8vw] text-gray-700 tracking-tight leading-none mb-0.5 md:mb-1 font-medium">Địa bàn hoạt động</span>
                      <div className="w-full bg-white/80 rounded-[3px] md:rounded-md px-1.5 md:px-2.5 text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[1vw] font-semibold text-gray-800 shadow-sm border border-black/5 font-['SVN-BeCool'] antialiased h-[18px] sm:h-[20px] md:h-[22px] lg:h-[26px] xl:h-auto xl:min-h-[2.2vw] flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                        {passportInfo.location}
                      </div>
                    </div>
                    <div className="w-full text-center mt-0.5 md:mt-1 xl:mt-[2%]">
                      <span className="text-[7px] sm:text-[8px] md:text-[8px] lg:text-[9px] xl:text-[0.55vw] font-medium text-gray-400">Passport by: DearKeriaVN</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* LƯỢT TIẾP THEO */}
            {turnIndex > 0 && (
              <>
                {/* TRANG TRÁI */}
                <div className="absolute top-[8%] left-[13%] w-[35%] h-[85%] sm:h-[86%] md:h-[88%] rounded-[14px] drop-shadow-sm z-10 overflow-visible p-[4%] pb-[5%] md:p-[5%] xl:p-[6%] flex flex-col justify-between">
                  <Image src="/images/handbook/page3.png" alt="Left Page Pink" fill className="w-full h-full object-contain pointer-events-none -z-10" />
                  
                  <div className="relative z-10 text-center border-b border-pink-300/60 pb-[2%] mt-[12%] md:mt-[14%] xl:mt-[15%]">
                    <span className="text-[9.5px] sm:text-[10.5px] md:text-[11px] lg:text-[12px] xl:text-[0.8vw] font-black uppercase tracking-wider text-[#ff5596]">
                      {leftProject ? `DỰ ÁN: ${leftProject.title}` : 'TRANG CÒN TRỐNG'}
                    </span>
                    <p className="text-[7.5px] sm:text-[8.5px] md:text-[9px] lg:text-[10px] xl:text-[0.65vw] text-gray-400 font-semibold mt-0.5 md:mt-1 xl:mt-[2%]">
                      Trang {leftIdx + 1}
                    </p>
                  </div>

                  <div className="relative z-10 flex-1 mt-[4%] md:mt-[4.5%] xl:mt-[5%] overflow-y-auto px-[2%] flex flex-col justify-start">
                    {leftProject && Array.isArray(leftProject.ownedStamps) && leftProject.ownedStamps.length > 0 ? (
                      <div className="grid grid-cols-2 gap-y-[6%] md:gap-y-[7%] xl:gap-y-[8%] gap-x-[4%] items-start justify-items-center">
                        {leftProject.ownedStamps.map((stamp: any) => (
                          <div key={stamp.id} className="flex flex-col items-center group cursor-pointer w-full">
                            <div className="relative w-[65%] aspect-[4/3] -rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-transform duration-300 drop-shadow-md">
                              <Image
                                src={stamp.stamp_image_url || '/images/handbook/stamp.png'}
                                alt={stamp.stage_name}
                                fill
                                sizes="15vw"
                                className="object-contain"
                                unoptimized={!!stamp.stamp_image_url?.startsWith('http')}
                              />
                            </div>
                            <span className="text-[6px] sm:text-[7px] md:text-[10px] lg:text-[11px] xl:text-[0.65vw] font-black uppercase text-gray-700 mt-1 md:mt-1.5 xl:mt-[4%] tracking-tight text-center truncate w-[90%]">
                              {stamp.stage_name}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : leftProject !== null && leftProject !== undefined ? (
                      <div className="text-center py-[8%] md:py-[9%] xl:py-[10%]">
                        <p className="text-[7px] sm:text-[8px] md:text-[11px] lg:text-[12px] xl:text-[0.8vw] font-bold text-gray-400">Chưa thu thập được dấu nào</p>
                        <p className="text-[5.5px] sm:text-[6.5px] md:text-[9px] lg:text-[10px] xl:text-[0.65vw] text-gray-400 mt-0.5 md:mt-1 xl:mt-[2%]">Hãy tham gia dự án để lấy dấu nhé!</p>
                      </div>
                    ) : (
                      <div className="text-center py-[8%] md:py-[9%] xl:py-[10%] flex flex-col items-center justify-start">
                        <div className="w-4 h-4 md:w-6 md:h-6 xl:w-[15%] xl:aspect-square rounded-full border border-dashed border-pink-300 flex items-center justify-center text-pink-300 mb-1 md:mb-1.5 xl:mb-[4%] font-bold text-[9px] md:text-[14px] xl:text-[1.2vw]">
                          +
                        </div>
                        <p className="text-[6.5px] sm:text-[7.5px] md:text-[10.5px] lg:text-[11.5px] xl:text-[0.75vw] font-bold text-pink-400 uppercase tracking-wider">Trang còn trống</p>
                        <p className="text-[5.5px] sm:text-[6.5px] md:text-[9px] lg:text-[10px] xl:text-[0.65vw] text-gray-400 mt-0.5 md:mt-1 xl:mt-[2%]">Dự án sắp ra mắt</p>
                      </div>
                    )}
                  </div>
                  <div className="relative z-10 w-full text-center pt-[2%] md:pt-[1.8%] xl:pt-[2%] mb-1.5 sm:mb-2 md:mb-1 xl:mb-[2%]">
                    <span className="text-[7.5px] sm:text-[8.5px] md:text-[8px] lg:text-[9px] xl:text-[0.55vw] font-semibold text-pink-400 uppercase tracking-wider inline-block leading-normal">All for one, one for keria</span>
                  </div>
                </div>

                {/* TRANG PHẢI */}
                <div className="absolute top-[8%] right-[13.3%] w-[35%] h-[85%] sm:h-[86%] md:h-[88%] rounded-[14px] drop-shadow-sm z-10 overflow-visible p-[4%] pb-[5%] md:p-[5%] xl:p-[6%] flex flex-col justify-between">
                  <Image src="/images/handbook/page4.png" alt="Right Page Blue" fill className="w-full h-full object-contain pointer-events-none -z-10" />
                  
                  <div className="relative z-10 text-center border-b border-blue-300/60 pb-[2%] mt-[12%] md:mt-[14%] xl:mt-[15%]">
                    <span className="text-[9.5px] sm:text-[10.5px] md:text-[11px] lg:text-[12px] xl:text-[0.8vw] font-black uppercase tracking-wider text-[#0086ff]">
                      {rightProject ? `DỰ ÁN: ${rightProject.title}` : rightProject === null ? 'TRANG CÒN TRỐNG' : 'HOÀN THÀNH SỔ'}
                    </span>
                    <p className="text-[7.5px] sm:text-[8.5px] md:text-[9px] lg:text-[10px] xl:text-[0.65vw] text-gray-400 font-semibold mt-0.5 md:mt-1 xl:mt-[2%]">
                      {rightProject === undefined ? 'KẾT THÚC' : `Trang ${rightIdx + 1}`}
                    </p>
                  </div>

                  <div className="relative z-10 flex-1 mt-[4%] md:mt-[4.5%] xl:mt-[5%] overflow-y-auto px-[2%] flex flex-col justify-start">
                    {rightProject && Array.isArray(rightProject.ownedStamps) && rightProject.ownedStamps.length > 0 ? (
                      <div className="grid grid-cols-2 gap-y-[6%] md:gap-y-[7%] xl:gap-y-[8%] gap-x-[4%] items-start justify-items-center">
                        {rightProject.ownedStamps.map((stamp: any) => (
                          <div key={stamp.id} className="flex flex-col items-center group cursor-pointer w-full">
                            <div className="relative w-[65%] aspect-[4/3] -rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-transform duration-300 drop-shadow-md">
                              <Image
                                src={stamp.stamp_image_url || '/images/handbook/stamp.png'}
                                alt={stamp.stage_name}
                                fill
                                sizes="15vw"
                                className="object-contain"
                                unoptimized={!!stamp.stamp_image_url?.startsWith('http')}
                              />
                            </div>
                            <span className="text-[6px] sm:text-[7px] md:text-[10px] lg:text-[11px] xl:text-[0.65vw] font-black uppercase text-gray-700 mt-1 md:mt-1.5 xl:mt-[4%] tracking-tight text-center truncate w-[90%]">
                              {stamp.stage_name}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : rightProject !== null && rightProject !== undefined ? (
                      <div className="text-center py-[8%] md:py-[9%] xl:py-[10%]">
                        <p className="text-[7px] sm:text-[8px] md:text-[11px] lg:text-[12px] xl:text-[0.8vw] font-bold text-gray-400">Chưa thu thập được dấu nào</p>
                        <p className="text-[5.5px] sm:text-[6.5px] md:text-[9px] lg:text-[10px] xl:text-[0.65vw] text-gray-400 mt-0.5 md:mt-1 xl:mt-[2%]">Hãy tham gia dự án để lấy dấu nhé!</p>
                      </div>
                    ) : rightProject === null ? (
                      <div className="text-center py-[8%] md:py-[9%] xl:py-[10%] flex flex-col items-center justify-start">
                        <div className="w-4 h-4 md:w-6 md:h-6 xl:w-[15%] xl:aspect-square rounded-full border border-dashed border-[#0086ff]/40 flex items-center justify-center text-[#0086ff]/60 mb-1 md:mb-1.5 xl:mb-[4%] font-bold text-[9px] md:text-[14px] xl:text-[1.2vw]">
                          +
                        </div>
                        <p className="text-[6.5px] sm:text-[7.5px] md:text-[10.5px] lg:text-[11.5px] xl:text-[0.75vw] font-bold text-[#0086ff]/80 uppercase tracking-wider">Trang còn trống</p>
                        <p className="text-[5.5px] sm:text-[6.5px] md:text-[9px] lg:text-[10px] xl:text-[0.65vw] text-gray-400 mt-0.5 md:mt-1 xl:mt-[2%]">Dự án sắp ra mắt</p>
                      </div>
                    ) : (
                      <div className="text-center py-[10%] md:py-[12%] xl:py-[15%] flex flex-col items-center justify-start">
                        <p className="text-[8px] sm:text-[10px] md:text-[13px] lg:text-[14px] xl:text-[1vw] font-black text-[#0086ff] uppercase tracking-wider">Cảm ơn bạn!</p>
                        <p className="text-[6px] sm:text-[7px] md:text-[10px] lg:text-[11px] xl:text-[0.7vw] text-gray-500 mt-1 md:mt-2 xl:mt-[4%] w-[80%]">
                          Cảm ơn bạn đã đồng hành cùng Keria trong mọi chặng đường.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="relative z-10 w-full text-center pt-[2%] md:pt-[1.8%] xl:pt-[2%] mb-1.5 sm:mb-2 md:mb-1 xl:mb-[2%]">
                    <span className="text-[7.5px] sm:text-[8.5px] md:text-[8px] lg:text-[9px] xl:text-[0.55vw] font-semibold text-blue-400 uppercase tracking-wider inline-block leading-normal">All for one, one for keria</span>
                  </div>
                </div>
              </>
            )}

            {/* GÁY SỔ */}
            <div className="absolute top-[7%] left-1/2 -translate-x-1/2 w-[7.6%] h-[90%] pointer-events-none z-20">
              <Image src="/images/handbook/midgap.png" alt="Mid Gap Leather Spine" fill className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            </div>
          </div>

          {/* =====================================================
              B. CÁNH BÌA TRƯỚC (Cải tiến Hover Hint & Lật Bìa)
              ===================================================== */}
          <div
            onClick={() => {
              setIsOpen(true);
              setTurnIndex(0);
              setMobileSide('left');
            }}
            className={`
              relative z-10 w-full h-full origin-left
              transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]
              [transform-style:preserve-3d]
              ${isOpen
                ? '[transform:rotateY(-180deg)] opacity-0 pointer-events-none'
                : '[transform:rotateY(0deg)] opacity-100 drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)] cursor-pointer hover:[transform:rotateY(-8deg)] hover:drop-shadow-[10px_20px_30px_rgba(0,0,0,0.45)]'
              }
            `}
          >
            <div className="relative z-10 w-full h-full">
              <Image src="/images/handbook/handbook.png" alt="Handbook Cover" fill priority className="w-full h-full object-contain pointer-events-none" />
            </div>

            <div className="absolute top-[17%] left-[18%] w-[50%] aspect-square z-20 pointer-events-none">
              <div className="absolute inset-[15%] rounded-[16px] overflow-hidden">
                <Image src="/images/handbook/anhbia_new.png" alt="Idol Cover" fill className="w-full h-full object-cover object-top" />
              </div>
              <div className="absolute inset-0 pointer-events-none">
                <Image src="/images/handbook/khunganh.png" alt="Photo Frame" fill className="w-full h-full object-contain" />
              </div>
              <div className="absolute -top-[70%] left-[-35%] w-[85%] aspect-[320/560] pointer-events-none z-30 -rotate-6">
                <Image src="/images/handbook/ruybang_new.png" alt="Ribbon" fill className="w-full h-full object-contain" />
              </div>
            </div>

            <div className="absolute bottom-[30%] left-[20%] w-[60%] aspect-[430/190] z-20 cursor-pointer transition-transform duration-300 ease-out hover:scale-105 active:scale-95">
              <Image src="/images/handbook/title_new.png" alt="Theo Dấu Chân Cún Title" fill className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] hover:drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] transition-all duration-300" />
            </div>
          </div>

        </div>

        {/* SỐ TRANG GÓC DƯỚI (MOBILE) */}
        {isOpen && (
          <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-black/40 text-white text-[10px] font-bold backdrop-blur-xs whitespace-nowrap">
            {turnIndex === 0
              ? (mobileSide === 'left' ? 'Trang mở đầu' : 'Passport')
              : `Trang ${(turnIndex - 1) * 2 + (mobileSide === 'left' ? 1 : 2)}`}
          </div>
        )}
      </section>

      {/* =======================================================
          MODALS
          ======================================================= */}
      <InstructionModal
        isOpen={isInstructionOpen}
        onClose={() => setIsInstructionOpen(false)}
      />

      <NhanDauModal
        isOpen={isNhanDauOpen}
        onClose={() => setIsNhanDauOpen(false)}
        projectId={activeProjectIdForModal}
      />

    </main>
  );
}