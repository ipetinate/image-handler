import { ref, computed } from "vue";

/*
 * Custom Types
 */
export type PlatformType =
  | "macOS"
  | "Windows"
  | "Linux"
  | "iOS"
  | "Android"
  | "Unknown";

/*
 * Global State
 */
const platform = ref<PlatformType>("Unknown");

/*
 * Methods
 */
function detectPlatform(): PlatformType {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform?.toLowerCase() || "";

  // iOS detection (must come before macOS as iOS can contain 'mac')
  if (
    /iphone|ipad|ipod/.test(userAgent) ||
    (platform.includes("mac") && "ontouchend" in document)
  ) {
    return "iOS";
  }

  // Android detection
  if (/android/.test(userAgent)) {
    return "Android";
  }

  // macOS detection
  if (platform.includes("mac") || /mac os x/.test(userAgent)) {
    return "macOS";
  }

  // Windows detection
  if (platform.includes("win") || /windows/.test(userAgent)) {
    return "Windows";
  }

  // Linux detection
  if (platform.includes("linux") || /linux/.test(userAgent)) {
    return "Linux";
  }

  return "Unknown";
}

/*
 * Computed Properties
 */
const isMacOS = computed(() => platform.value === "macOS");
const isWindows = computed(() => platform.value === "Windows");
const isLinux = computed(() => platform.value === "Linux");
const isiOS = computed(() => platform.value === "iOS");
const isAndroid = computed(() => platform.value === "Android");
const isMobile = computed(
  () => platform.value === "iOS" || platform.value === "Android"
);
const isDesktop = computed(() =>
  ["macOS", "Windows", "Linux"].includes(platform.value)
);

// Modifier key for keyboard shortcuts
const modifierKey = computed(() => {
  return isMacOS.value ? "⌘" : "Ctrl";
});

const modifierKeyName = computed(() => {
  return isMacOS.value ? "Cmd" : "Ctrl";
});

// Key codes for keyboard events
const modifierKeyCode = computed(() => {
  return isMacOS.value ? "metaKey" : "ctrlKey";
});

/*
 * Hook Export
 */
export function usePlatform() {
  // Initialize platform detection on first use
  if (platform.value === "Unknown") {
    platform.value = detectPlatform();
  }

  return {
    // Platform detection
    platform: platform.value,
    isMacOS,
    isWindows,
    isLinux,
    isiOS,
    isAndroid,
    isMobile,
    isDesktop,

    // Keyboard shortcuts
    modifierKey,
    modifierKeyName,
    modifierKeyCode,

    // Methods
    detectPlatform,
  };
}
