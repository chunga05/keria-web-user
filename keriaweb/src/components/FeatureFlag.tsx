import React from "react";
import UnderConstruction, { UnderConstructionProps } from "./UnderConstruction";
import { isFeatureEnabled, FeatureKey } from "@/config/features";

export interface FeatureFlagProps {
  /**
   * The feature flag key (e.g. 'schedule', 'welcome_project')
   * or a boolean expression.
   */
  flag: FeatureKey | boolean;
  /**
   * The WIP feature component(s) to render when enabled.
   */
  children: React.ReactNode;
  /**
   * Custom fallback to render when the feature flag is disabled.
   * If omitted, falls back to the UnderConstruction component.
   */
  fallback?: React.ReactNode;
  /**
   * Layout variant for default UnderConstruction fallback.
   * Defaults to 'card'.
   */
  fallbackVariant?: "page" | "card" | "inline" | "banner";
  /**
   * Optional name of the feature to display in UnderConstruction.
   */
  featureName?: string;
  /**
   * Custom description to display in UnderConstruction.
   */
  description?: string;
  /**
   * Custom title to display in UnderConstruction.
   */
  title?: string;
  /**
   * If true, renders nothing (null) instead of UnderConstruction when disabled.
   */
  silent?: boolean;
  /**
   * Whether to show back button on fallback.
   */
  showBackButton?: boolean;
  /**
   * Custom href for back button.
   */
  backButtonHref?: string;
  /**
   * Custom className passed to UnderConstruction fallback.
   */
  className?: string;
}

/**
 * FeatureFlag Component
 * 
 * Conditionally renders children if the specified feature flag is enabled.
 * If disabled, renders either a custom fallback or the reusable UnderConstruction UI.
 * 
 * @example
 * ```tsx
 * // Component-level with inline/card placeholder
 * <FeatureFlag flag="schedule" fallbackVariant="card" featureName="Lịch trình Keria">
 *   <ScheduleWidget />
 * </FeatureFlag>
 * 
 * // Page-level with full-page Under Construction UI
 * <FeatureFlag flag="welcome_project" fallbackVariant="page" featureName="Welcome to Vietnam">
 *   <LazyWelcomeProject />
 * </FeatureFlag>
 * 
 * // Silent mode (renders nothing if disabled)
 * <FeatureFlag flag="demo_feature" silent>
 *   <ExperimentalBanner />
 * </FeatureFlag>
 * ```
 */
export default function FeatureFlag({
  flag,
  children,
  fallback,
  fallbackVariant = "card",
  featureName,
  description,
  title,
  silent = false,
  showBackButton,
  backButtonHref,
  className,
}: FeatureFlagProps) {
  const enabled = typeof flag === "boolean" ? flag : isFeatureEnabled(flag);

  if (enabled) {
    return <>{children}</>;
  }

  // Flag is disabled:
  if (fallback !== undefined) {
    return <>{fallback}</>;
  }

  if (silent) {
    return null;
  }

  return (
    <UnderConstruction
      variant={fallbackVariant}
      featureName={featureName}
      title={title}
      description={description}
      showBackButton={showBackButton}
      backButtonHref={backButtonHref}
      className={className}
    />
  );
}

/**
 * Higher-Order Component (HOC) to wrap any component with a feature flag guard.
 * 
 * @example
 * ```tsx
 * const GuardedSchedule = withFeatureFlag(ScheduleView, 'schedule', {
 *   fallbackVariant: 'page',
 *   featureName: 'Lịch trình Keria',
 * });
 * ```
 */
export function withFeatureFlag<P extends object>(
  Component: React.ComponentType<P>,
  flag: FeatureKey | boolean,
  options?: Omit<FeatureFlagProps, "children" | "flag">
) {
  return function WithFeatureFlagWrapper(props: P) {
    return (
      <FeatureFlag flag={flag} {...options}>
        <Component {...props} />
      </FeatureFlag>
    );
  };
}
