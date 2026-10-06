import React from "react";
import dynamic from "next/dynamic";
import { isFeatureEnabled, FEATURES } from "@/config/features";
import UnderConstruction from "@/components/UnderConstruction";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lịch trình Keria | DearKeriaVN",
  description: "Lịch trình thi đấu và hoạt động của Ryu 'Keria' Minseok",
};

/**
 * Dynamically import WIP component so unfinished code is split into an on-demand chunk
 * and never loaded by clients when the feature flag is disabled.
 */
const LazyScheduleView = dynamic(() => import("./WIPScheduleView"), {
  loading: () => (
    <div className="w-full min-h-[60vh] flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
    </div>
  ),
});

export default function SchedulePage() {
  const isEnabled = isFeatureEnabled(FEATURES.SCHEDULE);

  // Route-level Guard: Show UnderConstruction fallback when flag is disabled
  if (!isEnabled) {
    return (
      <UnderConstruction
        variant="page"
        featureName="Lịch trình Keria"
        estimatedRelease="Dự kiến cập nhật trong thời gian tới"
        showBackButton={true}
        backButtonHref="/hoat-dong/loi-nhan"
      />
    );
  }

  // Feature is enabled: render the dynamically loaded feature view
  return <LazyScheduleView />;
}
