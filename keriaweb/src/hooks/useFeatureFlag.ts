"use client";

import { useMemo } from "react";
import { isFeatureEnabled, FeatureKey } from "@/config/features";

/**
 * Hook to inspect feature flag state in Client Components.
 * Reactively evaluates the feature flag status.
 * 
 * @param feature The feature key to check (e.g. 'schedule', 'welcome_project')
 * @returns boolean indicating whether the feature is enabled
 * 
 * @example
 * ```tsx
 * const isScheduleActive = useFeatureFlag('schedule');
 * if (!isScheduleActive) return <UnderConstruction variant="card" />;
 * ```
 */
export function useFeatureFlag(feature: FeatureKey | string): boolean {
  return useMemo(() => isFeatureEnabled(feature), [feature]);
}
