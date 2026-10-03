/**
 * Centralized Feature Flag Configuration
 * 
 * Manages feature flags controlled via environment variables.
 * Designed for Next.js App Router (usable in both Server and Client Components).
 * Missing, undefined, empty, or invalid environment variables safely fall back to `false`.
 */

export interface FeatureFlagDefinition {
  /** Human-readable name of the feature */
  name: string;
  /** Environment variable name backing this flag */
  envVar: string;
  /** Safe default value when env variable is missing or invalid */
  defaultValue: boolean;
  /** Description of what this feature is */
  description?: string;
}

/**
 * Safely parses a boolean environment variable.
 * 
 * Truthy inputs: 'true', '1', 'yes', 'on', 'enable', 'enabled' (case-insensitive) -> true
 * Falsy inputs: 'false', '0', 'no', 'off', 'disable', 'disabled', '' -> false
 * Invalid or missing inputs -> fallback to defaultValue (default: false)
 */
export function parseBooleanEnv(value: string | undefined | null, defaultValue = false): boolean {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "on", "enable", "enabled"].includes(normalized)) {
    return true;
  }
  if (["false", "0", "no", "off", "disable", "disabled", ""].includes(normalized)) {
    return false;
  }
  return defaultValue;
}

/**
 * Feature Flag Registry - String Keys
 */
export const FEATURES = {
  // Lịch trình Keria (/kerias/lich-trinh)
  SCHEDULE: "schedule",
  // 'Welcome to Vietnam' Project (/project/welcome-to-vietnam)
  WELCOME_PROJECT: "welcome_project",
  // Stream Donation feature (/stream-donation)
  STREAM_DONATION: "stream_donation",
  // Sổ tay hành trình (/hoat-dong/so-tay-hanh-trinh)
  HANDBOOK: "handbook",
  // Lời nhắn (/hoat-dong/loi-nhan)
  WISHES: "wishes",
  // Thành tích (/thanh-tich)
  ACHIEVEMENTS: "achievements",
  // Supporting Project (/content)
  SUPPORTING_PROJECT: "supporting_project",
  // Demo feature for testing / previewing feature flag toggles
  DEMO_FEATURE: "demo_feature",
} as const;

export type FeatureKey = (typeof FEATURES)[keyof typeof FEATURES];

/**
 * Metadata definition and safe defaults for each feature flag
 */
export const FEATURE_DEFINITIONS: Record<FeatureKey, FeatureFlagDefinition> = {
  [FEATURES.SCHEDULE]: {
    name: "Lịch trình Keria",
    envVar: "NEXT_PUBLIC_ENABLE_SCHEDULE",
    defaultValue: false,
    description: "Trang hiển thị lịch thi đấu và hoạt động của Keria",
  },
  [FEATURES.WELCOME_PROJECT]: {
    name: "'Welcome to Vietnam' Project",
    envVar: "NEXT_PUBLIC_ENABLE_WELCOME_PROJECT",
    defaultValue: false,
    description: "Dự án chào mừng Keria đến Việt Nam",
  },
  [FEATURES.STREAM_DONATION]: {
    name: "Stream Donations",
    envVar: "NEXT_PUBLIC_ENABLE_STREAM_DONATION",
    defaultValue: true,
    description: "Trang thống kê và bảng vàng stream donations",
  },
  [FEATURES.HANDBOOK]: {
    name: "Sổ tay hành trình",
    envVar: "NEXT_PUBLIC_ENABLE_HANDBOOK",
    defaultValue: false,
    description: "Sổ tay điện tử tương tác và thu thập tem hành trình",
  },
  [FEATURES.WISHES]: {
    name: "Lời nhắn",
    envVar: "NEXT_PUBLIC_ENABLE_WISHES",
    defaultValue: true,
    description: "Tường gửi lời nhắn chúc mừng Keria",
  },
  [FEATURES.ACHIEVEMENTS]: {
    name: "Thành tích",
    envVar: "NEXT_PUBLIC_ENABLE_ACHIEVEMENTS",
    defaultValue: false,
    description: "Trang thành tích và danh hiệu của Keria (/thanh-tich)",
  },
  [FEATURES.SUPPORTING_PROJECT]: {
    name: "Supporting Project",
    envVar: "NEXT_PUBLIC_ENABLE_SUPPORTING_PROJECT",
    defaultValue: false,
    description: "Dự án tiếp sức / Supporting Projects (/content)",
  },
  [FEATURES.DEMO_FEATURE]: {
    name: "Demo Feature",
    envVar: "NEXT_PUBLIC_ENABLE_DEMO_FEATURE",
    defaultValue: false,
    description: "Tính năng thử nghiệm để kiểm tra cơ chế feature flag",
  },
};

/**
 * Check whether a specific feature is enabled.
 * 
 * Uses explicit static references to `process.env.NEXT_PUBLIC_*` so Next.js Turbopack/Webpack
 * can properly inline values at compile time for client components while remaining dynamic
 * on the server runtime.
 * 
 * Safely returns false if the feature is undefined, missing, or falsy.
 */
export function isFeatureEnabled(key: FeatureKey | string): boolean {
  const def = (FEATURE_DEFINITIONS as Record<string, FeatureFlagDefinition>)[key];
  const defaultValue = def ? def.defaultValue : false;

  let rawEnvValue: string | undefined;

  switch (key) {
    case FEATURES.SCHEDULE:
      rawEnvValue = process.env.NEXT_PUBLIC_ENABLE_SCHEDULE;
      break;
    case FEATURES.WELCOME_PROJECT:
      rawEnvValue = process.env.NEXT_PUBLIC_ENABLE_WELCOME_PROJECT;
      break;
    case FEATURES.STREAM_DONATION:
      rawEnvValue = process.env.NEXT_PUBLIC_ENABLE_STREAM_DONATION;
      break;
    case FEATURES.HANDBOOK:
      rawEnvValue = process.env.NEXT_PUBLIC_ENABLE_HANDBOOK;
      break;
    case FEATURES.WISHES:
      rawEnvValue = process.env.NEXT_PUBLIC_ENABLE_WISHES;
      break;
    case FEATURES.ACHIEVEMENTS:
      rawEnvValue = process.env.NEXT_PUBLIC_ENABLE_ACHIEVEMENTS;
      break;
    case FEATURES.SUPPORTING_PROJECT:
      rawEnvValue = process.env.NEXT_PUBLIC_ENABLE_SUPPORTING_PROJECT ?? process.env.NEXT_PUBLIC_ENABLE_CONTENT;
      break;
    case FEATURES.DEMO_FEATURE:
      rawEnvValue = process.env.NEXT_PUBLIC_ENABLE_DEMO_FEATURE;
      break;
    default:
      rawEnvValue = undefined;
  }

  return parseBooleanEnv(rawEnvValue, defaultValue);
}

/**
 * Access object for all current feature flag states
 */
export const featureFlags = {
  get schedule() {
    return isFeatureEnabled(FEATURES.SCHEDULE);
  },
  get welcomeProject() {
    return isFeatureEnabled(FEATURES.WELCOME_PROJECT);
  },
  get streamDonation() {
    return isFeatureEnabled(FEATURES.STREAM_DONATION);
  },
  get handbook() {
    return isFeatureEnabled(FEATURES.HANDBOOK);
  },
  get wishes() {
    return isFeatureEnabled(FEATURES.WISHES);
  },
  get achievements() {
    return isFeatureEnabled(FEATURES.ACHIEVEMENTS);
  },
  get supportingProject() {
    return isFeatureEnabled(FEATURES.SUPPORTING_PROJECT);
  },
  get demoFeature() {
    return isFeatureEnabled(FEATURES.DEMO_FEATURE);
  },
};
