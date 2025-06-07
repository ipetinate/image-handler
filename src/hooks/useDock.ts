import type { WindowInstance } from "../stores/useWindowStore";

import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";

import { generateConsistentColoredIcon } from "../utils/generateColoredIcon";

import appIcon from "../assets/quick-img-tweakr.png";
import addNewIcon from "../assets/icons/qit-add-new.png";
import settingsIcon from "../assets/icons/qit-settings.png";

export interface DockItem {
  id: string;
  type: "window" | "app" | "separator" | "plus" | "settings";
  window?: WindowInstance;
  title: string;
  icon: string;
  isMinimized: boolean;
}

export interface DockEmits {
  (e: "restore-window", windowId: string): void;
  (e: "bring-to-front", windowId: string): void;
  (e: "create-new-window"): void;
  (e: "open-settings"): void;
}

export function useDock(allWindows: WindowInstance[], emit: DockEmits) {
  /*
   * Refs & Reactives
   */
  const dockRef = ref<HTMLElement>();
  const focusedIndex = ref(-1);
  const mouseX = ref(0);
  const mouseY = ref(0);
  const isHovered = ref(false);
  const tooltipPosition = ref({ x: 0, y: 0 });
  const dockWidth = ref("auto");

  /*
   * Computeds
   */
  const sortedWindows = computed(() => {
    return [...allWindows].sort((a, b) => {
      const aNum = Number(a.id.split("-")[1]);
      const bNum = Number(b.id.split("-")[1]);
      return aNum - bNum;
    });
  });

  const dockItems = computed<DockItem[]>(() => {
    const items: DockItem[] = [];

    // Add window items with colored icons
    sortedWindows.value.forEach((window) => {
      if (window.id === "settings-window") {
        // Special handling for settings window
        items.push({
          id: window.id,
          type: "settings",
          window,
          title: "Settings",
          icon: settingsIcon,
          isMinimized: window.isMinimized,
        });
      } else {
        items.push({
          id: window.id,
          type: "window",
          window,
          title: window.fileName || "Quick Img Tweakr",
          icon: generateConsistentColoredIcon(window.id),
          isMinimized: window.isMinimized,
        });
      }
    });

    // Add default app if no windows
    if (sortedWindows.value.length === 0) {
      items.push({
        id: "default-app",
        type: "app",
        title: "Quick Img Tweakr",
        icon: appIcon,
        isMinimized: false,
      });
    }

    // Add separator if we have windows
    if (sortedWindows.value.length > 0) {
      items.push({
        id: "separator",
        type: "separator",
        title: "",
        icon: "",
        isMinimized: false,
      });
    }

    // Add plus button
    items.push({
      id: "plus-button",
      type: "plus",
      title: "Open new window",
      icon: addNewIcon,
      isMinimized: false,
    });

    // Add settings button only if settings window doesn't exist
    const hasSettingsWindow = sortedWindows.value.some(
      (w) => w.id === "settings-window"
    );
    if (!hasSettingsWindow) {
      items.push({
        id: "settings",
        type: "settings",
        title: "Settings",
        icon: settingsIcon,
        isMinimized: false,
      });
    }

    return items;
  });

  /*
   * Initialization & Reset Functions
   */
  function initializeDockSpacing() {
    if (!dockRef.value) return;

    const items = dockRef.value.querySelectorAll(
      ".dock-item:not(.dock-separator)"
    );

    items.forEach((item) => {
      const element = item as HTMLElement;
      element.style.transform = "scale(1)";
      element.style.transformOrigin = "50% 100%";
      element.style.marginLeft = "0px"; // Half of base 12px gap
      element.style.marginRight = "0px"; // Half of base 12px gap
      element.style.transition =
        "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), margin 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    });

    dockWidth.value = "auto";
  }

  function resetMagnification() {
    initializeDockSpacing();
  }

  /*
   * Magnification Logic
   */
  function applyMagnificationByDistance() {
    if (!dockRef.value) return;

    const items = dockRef.value.querySelectorAll(
      ".dock-item:not(.dock-separator)"
    );
    const maxDistance = 140;
    const baseItemWidth = 50;

    // Find the closest item to mouse (center of magnification)
    let closestIndex = -1;
    let minDistance = Infinity;

    items.forEach((item, index) => {
      const element = item as HTMLElement;
      const rect = element.getBoundingClientRect();
      const dockRect = dockRef.value!.getBoundingClientRect();

      const itemCenterX = rect.left + rect.width / 2 - dockRect.left;
      const itemCenterY = rect.top + rect.height / 2 - dockRect.top;

      const distance = Math.sqrt(
        Math.pow(mouseX.value - itemCenterX, 2) +
          Math.pow(mouseY.value - itemCenterY, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    let totalExtraWidth = 0;

    // Apply macOS-style magnification
    items.forEach((item, index) => {
      let scale = 1.0;

      // Only apply magnification if mouse is close enough to dock
      if (minDistance <= maxDistance && closestIndex >= 0) {
        const distanceFromCenter = Math.abs(index - closestIndex);

        // macOS-style scaling based on distance from center icon
        switch (distanceFromCenter) {
          case 0: // Center icon (mouse is here)
            scale = 2;
            break;
          case 1: // Adjacent icons
            scale = 1.5;
            break;
          case 2: // Second level icons
            scale = 1.25;
            break;
          default: // All other icons
            scale = 1.0;
            break;
        }
      }

      // Calculate margins considering the base 12px gap already exists
      const extraSize = (scale - 1) * baseItemWidth;
      const baseGap = 6; // Half of the 12px gap on each side
      const totalMarginNeeded = baseGap + extraSize / 2;

      // Apply the scale and margins to the icon
      const element = item as HTMLElement;
      element.style.transform = `scale(${scale})`;
      element.style.transformOrigin = "50% 100%";
      element.style.marginLeft = `${totalMarginNeeded}px`;
      element.style.marginRight = `${totalMarginNeeded}px`;
      element.style.transition =
        "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94), margin 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

      // Calculate extra space this scaled item needs
      const extraWidth = (scale - 1) * baseItemWidth;
      totalExtraWidth += extraWidth;
    });

    // Calculate base width (no magnification)
    const numberOfItems = items.length;
    const baseItemsWidth = numberOfItems * baseItemWidth;
    const numberOfGaps = Math.max(0, numberOfItems - 1) * 12; // 12px gaps
    const separators = dockItems.value.filter(
      (item) => item.type === "separator"
    ).length;
    const separatorWidth = separators * 24;
    const dockPadding = 80;
    const baseDockWidth =
      baseItemsWidth + numberOfGaps + separatorWidth + dockPadding;

    // Add extra width when there's magnification
    const finalDockWidth = baseDockWidth + totalExtraWidth;

    // Just set the width, no position changes
    dockWidth.value = `${Math.max(finalDockWidth, 200)}px`;
  }

  /*
   * Event Handlers
   */
  function handleMouseMove(event: MouseEvent) {
    if (!dockRef.value) return;

    const dockRect = dockRef.value.getBoundingClientRect();
    mouseX.value = event.clientX - dockRect.left;
    mouseY.value = event.clientY - dockRect.top;

    applyMagnificationByDistance();

    // Find the closest item to the mouse for tooltip
    const closestIndex = findClosestItem();
    if (closestIndex !== -1 && closestIndex !== focusedIndex.value) {
      focusedIndex.value = closestIndex;
      updateTooltipPosition(closestIndex);
    } else if (focusedIndex.value >= 0) {
      updateTooltipPosition(focusedIndex.value);
    }
  }

  function findClosestItem(): number {
    if (!dockRef.value) return -1;

    const items = dockRef.value.querySelectorAll(
      ".dock-item:not(.dock-separator)"
    );
    let closestIndex = -1;
    let minDistance = Infinity;
    const maxTooltipDistance = 80; // Distance threshold for showing tooltip

    items.forEach((item, index) => {
      const element = item as HTMLElement;
      const rect = element.getBoundingClientRect();
      const dockRect = dockRef.value!.getBoundingClientRect();

      const itemCenterX = rect.left + rect.width / 2 - dockRect.left;
      const itemCenterY = rect.top + rect.height / 2 - dockRect.top;

      const distance = Math.sqrt(
        Math.pow(mouseX.value - itemCenterX, 2) +
          Math.pow(mouseY.value - itemCenterY, 2)
      );

      if (distance < minDistance && distance <= maxTooltipDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function handleMouseEnter(index: number) {
    focusedIndex.value = index;
    isHovered.value = true;
    updateTooltipPosition(index);
  }

  function updateTooltipPosition(index: number) {
    if (!dockRef.value) return;

    const items = dockRef.value.querySelectorAll(
      ".dock-item:not(.dock-separator)"
    );
    const targetItem = items[index] as HTMLElement;

    if (targetItem) {
      const rect = targetItem.getBoundingClientRect();

      // Get current transform to account for magnification
      const computedStyle = window.getComputedStyle(targetItem);
      const transform = computedStyle.transform;

      // Calculate the center considering current scale and position
      let centerX = rect.left + rect.width / 2;
      let centerY = rect.top;

      // If the item is transformed, adjust for the visual center
      if (transform && transform !== "none") {
        const matrix = new DOMMatrix(transform);
        const translateY = matrix.f; // translateY from transform matrix

        // Adjust Y position based on the current translation
        centerY = rect.top + translateY;
      }

      tooltipPosition.value = {
        x: centerX,
        y: centerY - 5, // 5px above the icon (closer)
      };
    }
  }

  function handleMouseLeave() {
    isHovered.value = false;
    focusedIndex.value = -1;
    resetMagnification();
  }

  function handleItemClick(item: DockItem) {
    if (item.type === "window" && item.window) {
      if (item.window.isMinimized) {
        emit("restore-window", item.window.id);
      } else {
        emit("bring-to-front", item.window.id);
      }
    } else if (item.type === "plus" || item.type === "app") {
      emit("create-new-window");
    } else if (item.type === "settings") {
      emit("open-settings");
    }
  }

  /*
   * Lifecycle Management
   */
  function setupEventListeners() {
    if (dockRef.value) {
      dockRef.value.addEventListener("mousemove", handleMouseMove);
      dockRef.value.addEventListener("mouseleave", handleMouseLeave);

      // Initialize spacing after DOM is ready
      nextTick(() => {
        initializeDockSpacing();
      });
    }
  }

  function cleanupEventListeners() {
    if (dockRef.value) {
      dockRef.value.removeEventListener("mousemove", handleMouseMove);
      dockRef.value.removeEventListener("mouseleave", handleMouseLeave);
    }
  }

  onMounted(setupEventListeners);
  onBeforeUnmount(cleanupEventListeners);

  return {
    // Refs
    dockRef,
    focusedIndex,
    mouseX,
    mouseY,
    isHovered,
    tooltipPosition,
    dockWidth,

    // Computed
    dockItems,
    sortedWindows,

    // Methods
    handleMouseEnter,
    handleItemClick,
  };
}
