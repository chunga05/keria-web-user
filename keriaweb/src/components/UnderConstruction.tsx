import React from "react";
import Link from "next/link";
import { Construction, Sparkles, Clock, ArrowLeft, Home, Hammer, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UnderConstructionProps {
  /** Main heading text. Defaults to "Tính năng này đang được phát triển" */
  title?: string;
  /** Detailed subtitle / description */
  description?: string;
  /** Optional name of the specific feature under development */
  featureName?: string;
  /** Layout style: 'page' (full-page route), 'card' (contained widget), 'inline' (minimal inline banner), 'banner' */
  variant?: "page" | "card" | "inline" | "banner";
  /** Whether to show the back to home button (defaults to true for 'page', false for 'card' and 'inline') */
  showBackButton?: boolean;
  /** Custom label for back button */
  backButtonText?: string;
  /** Target href for back button (defaults to '/hoat-dong/loi-nhan') */
  backButtonHref?: string;
  /** Optional estimated launch text (e.g. "Dự kiến ra mắt: Q4/2026") */
  estimatedRelease?: string;
  /** Additional custom class names */
  className?: string;
  /** Optional custom action elements or buttons */
  children?: React.ReactNode;
}

export default function UnderConstruction({
  title = "Tính năng này đang được phát triển",
  description = "Chúng mình đang tích cực hoàn thiện tính năng này để đem đến trải nghiệm tốt nhất cho các bạn. Hãy quay lại sau nhé!",
  featureName,
  variant = "page",
  showBackButton,
  backButtonText = "Đến trang Lời chúc",
  backButtonHref = "/hoat-dong/loi-nhan",
  estimatedRelease,
  className,
  children,
}: UnderConstructionProps) {
  const shouldShowBack = showBackButton ?? (variant === "page");
  const resolvedHref = !backButtonHref || backButtonHref === "/" ? "/hoat-dong/loi-nhan" : backButtonHref;
  const resolvedButtonText = !backButtonText || backButtonText === "Quay về Trang chủ" ? "Đến trang Lời chúc" : backButtonText;

  // 1. INLINE VARIANT (Non-blocking compact placeholder)
  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl",
          "bg-white/5 border border-white/10 backdrop-blur-sm",
          "text-neutral-300 text-sm",
          className
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
          <Construction className="h-4 w-4 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">
              {featureName ? `${featureName} - ` : ""}
              {title}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium whitespace-nowrap">
              Đang phát triển
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{description}</p>
        </div>
        {children}
      </div>
    );
  }

  // 2. BANNER VARIANT (Top or section announcement)
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "w-full bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-pink-500/10",
          "border-y border-white/10 px-4 py-3 backdrop-blur-md",
          className
        )}
      >
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
              <Construction className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {featureName ? `${featureName}: ` : ""}
                {title}
              </p>
              <p className="text-xs text-neutral-300">{description}</p>
            </div>
          </div>
          {shouldShowBack && (
            <Link
              href={resolvedHref}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>{resolvedButtonText}</span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // 3. CARD VARIANT (Contained placeholder inside a section or dashboard)
  if (variant === "card") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl p-6 sm:p-8 text-center",
          "bg-white/[0.04] border border-dashed border-white/20 backdrop-blur-md",
          "flex flex-col items-center justify-center min-h-[260px]",
          className
        )}
      >
        {/* Subtle decorative background glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Construction Icon */}
        <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-sky-400/20 border border-white/10 text-amber-400 shadow-inner">
          <Construction className="h-7 w-7 animate-pulse" />
          <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-pink-400" />
        </div>

        {/* Feature badge */}
        {featureName && (
          <span className="inline-flex items-center gap-1 px-3 py-1 mb-2 rounded-full text-xs font-medium bg-sky-500/15 text-sky-300 border border-sky-500/30">
            <Hammer className="h-3 w-3" />
            {featureName}
          </span>
        )}

        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-neutral-300 max-w-md leading-relaxed mb-4">{description}</p>

        {estimatedRelease && (
          <div className="inline-flex items-center gap-1.5 text-xs text-neutral-400 bg-white/5 px-3 py-1 rounded-full mb-4">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>{estimatedRelease}</span>
          </div>
        )}

        {shouldShowBack && (
          <Link
            href={resolvedHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all hover:scale-[1.02]"
          >
            <ArrowLeft className="h-4 w-4" />
            {resolvedButtonText}
          </Link>
        )}

        {children}
      </div>
    );
  }

  // 4. PAGE VARIANT (Full page route placeholder with clean back-to-home button)
  return (
    <div
      className={cn(
        "relative w-full min-h-[65vh] flex flex-col items-center justify-center px-4 py-16 text-center select-none",
        className
      )}
    >
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-tr from-[#0084FF]/15 via-[#FF61B6]/10 to-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-lg w-full flex flex-col items-center p-8 sm:p-10 rounded-3xl bg-neutral-900/70 border border-white/10 backdrop-blur-xl shadow-2xl">
        
        {/* Animated Icon Avatar */}
        <div className="relative mb-6">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400/20 via-sky-500/20 to-pink-500/20 border border-white/15 shadow-lg shadow-sky-500/10">
            <Construction className="h-10 w-10 text-amber-300 animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white shadow-md animate-bounce">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Feature Name Tag */}
        {featureName && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 mb-3 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-300 border border-sky-400/30 shadow-sm">
            <Hammer className="h-3.5 w-3.5" />
            <span>{featureName}</span>
          </div>
        )}

        {/* Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 mb-4 rounded-full text-xs font-semibold bg-amber-400/15 text-amber-300 border border-amber-400/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>Đang hoàn thiện</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          {title}
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-md mb-6">
          {description}
        </p>

        {/* Estimated Release if available */}
        {estimatedRelease && (
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-400 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6">
            <Clock className="h-4 w-4 text-sky-400" />
            <span>{estimatedRelease}</span>
          </div>
        )}

        {/* Back to Wishes Button & Custom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          {shouldShowBack && (
            <Link
              href={resolvedHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/25 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              <Heart className="h-4 w-4" />
              <span>{resolvedButtonText}</span>
            </Link>
          )}

          {children}
        </div>

        {/* Small subtle footer note */}
        <p className="mt-8 text-xs text-neutral-500">
          DearKeriaVN · Cùng nhau đồng hành cùng Ryu &quot;Keria&quot; Minseok
        </p>
      </div>
    </div>
  );
}
