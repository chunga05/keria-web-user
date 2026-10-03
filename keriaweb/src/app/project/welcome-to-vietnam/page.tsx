import React from "react";
import dynamic from "next/dynamic";
import { isFeatureEnabled, FEATURES } from "@/config/features";
import UnderConstruction from "@/components/UnderConstruction";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "'Welcome to Vietnam' Project | Dear Keria VN",
  description: "Dự án chào đón Keria đến Việt Nam cùng cộng đồng Dear Keria VN",
};

/**
 * Dynamically import WIP component so unfinished code is split into an on-demand chunk
 * and never loaded by clients when the feature flag is disabled.
 */
const LazyWelcomeProjectView = dynamic(() => import("./WIPWelcomeProjectView"), {
  loading: () => (
    <div className="w-full min-h-[60vh] flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-400 border-t-transparent" />
    </div>
  ),
});

export default function WelcomeToVietnamPage() {
  const isEnabled = isFeatureEnabled(FEATURES.WELCOME_PROJECT);

  // Route-level Guard: Show UnderConstruction fallback when flag is disabled
  if (!isEnabled) {
    return (
      <UnderConstruction
        variant="page"
        featureName="'Welcome to Vietnam' Project"
        description="Dự án đang trong giai đoạn lên kế hoạch và chuẩn bị các hoạt động đặc biệt. Chúng mình sẽ sớm công bố chi tiết!"
        estimatedRelease="Dự kiến công bố trong thời gian tới"
        showBackButton={true}
        backButtonHref="/"
      />
    );
  }

  // Feature is enabled: render the dynamically loaded feature view
  return <LazyWelcomeProjectView />;
}
