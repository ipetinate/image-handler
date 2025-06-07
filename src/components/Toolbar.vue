<script lang="ts" setup>
import { ref } from "vue";
import { usePlatform } from "../hooks/usePlatform";

import Icon from "./Icon.vue";

/*
 * Custom Types
 */

type IconName =
  | "drop"
  | "upload"
  | "rotate-left"
  | "rotate-right"
  | "grid"
  | "download"
  | "trash"
  | "flip-vertical"
  | "flip-horizontal"
  | "reset"
  | "zoom-in"
  | "zoom-out"
  | "zoom-plus"
  | "zoom-minus"
  | "percentage";

type Props = {
  gridEnabled: boolean;
  hasImage: boolean;
};

type Events = {
  (e: "flip-vertical"): void;
  (e: "flip-horizontal"): void;
  (e: "rotate-left"): void;
  (e: "rotate-right"): void;
  (e: "toggle-grid"): void;
  (e: "download"): void;
  (e: "remove"): void;
  (e: "reset-transformations"): void;
  (e: "zoom-to-fill"): void;
  (e: "zoom-to-fit"): void;
  (e: "zoom-increase"): void;
  (e: "zoom-decrease"): void;
};

interface ToolbarAction {
  id: string;
  event:
    | "flip-vertical"
    | "flip-horizontal"
    | "rotate-left"
    | "rotate-right"
    | "toggle-grid"
    | "download"
    | "remove"
    | "reset-transformations"
    | "zoom-to-fill"
    | "zoom-to-fit"
    | "zoom-increase"
    | "zoom-decrease";
  icon: IconName;
  title: string;
  group: "transform" | "view" | "file";
}

/*
 * Vue Definitions
 */

const emit = defineEmits<Events>();
defineProps<Props>();

/*
 * Hooks
 */
const { modifierKey } = usePlatform();

/*
 * Refs & Reactives
 */
const hoveredAction = ref<string | null>(null);
const tooltipPosition = ref({ x: 0, y: 0 });
const tooltipText = ref("");
const showTooltip = ref(false);
const animationFrame = ref<number | null>(null);

/*
 * Actions Dictionary
 */

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  // Transform group
  {
    id: "flip-vertical",
    event: "flip-vertical",
    icon: "flip-vertical",
    title: `Espelhar vertical (${modifierKey.value}⇧V)`,
    group: "transform",
  },
  {
    id: "flip-horizontal",
    event: "flip-horizontal",
    icon: "flip-horizontal",
    title: `Espelhar horizontal (${modifierKey.value}⇧H)`,
    group: "transform",
  },
  {
    id: "rotate-left",
    event: "rotate-left",
    icon: "rotate-left",
    title: `Girar esquerda (${modifierKey.value}R)`,
    group: "transform",
  },
  {
    id: "rotate-right",
    event: "rotate-right",
    icon: "rotate-right",
    title: `Girar direita (${modifierKey.value}⇧R)`,
    group: "transform",
  },
  // View group
  {
    id: "zoom-to-fill",
    event: "zoom-to-fill",
    icon: "zoom-in",
    title: "Preencher grid (ativa grade)",
    group: "view",
  },
  {
    id: "zoom-to-fit",
    event: "zoom-to-fit",
    icon: "zoom-out",
    title: "Ajustar à grid (ativa grade)",
    group: "view",
  },
  {
    id: "toggle-grid",
    event: "toggle-grid",
    icon: "grid",
    title: `Mostrar grid (${modifierKey.value}G)`,
    group: "view",
  },
  // File group
  {
    id: "reset-transformations",
    event: "reset-transformations",
    icon: "reset",
    title: `Reverter alterações (${modifierKey.value}⇧U)`,
    group: "file",
  },
  {
    id: "download",
    event: "download",
    icon: "download",
    title: "Salvar imagem",
    group: "file",
  },
  {
    id: "remove",
    event: "remove",
    icon: "trash",
    title: `Remover imagem (${modifierKey.value}⇧D)`,
    group: "file",
  },
] as const;

/*
 * Computed Groups
 */

const transformActions = TOOLBAR_ACTIONS.filter(
  (action) => action.group === "transform"
);
const viewActions = TOOLBAR_ACTIONS.filter((action) => action.group === "view");
const fileActions = TOOLBAR_ACTIONS.filter((action) => action.group === "file");

/*
 * Methods
 */

function handleActionClick(action: ToolbarAction) {
  const eventMap = {
    "flip-vertical": () => emit("flip-vertical"),
    "flip-horizontal": () => emit("flip-horizontal"),
    "rotate-left": () => emit("rotate-left"),
    "rotate-right": () => emit("rotate-right"),
    "toggle-grid": () => emit("toggle-grid"),
    download: () => emit("download"),
    remove: () => emit("remove"),
    "reset-transformations": () => emit("reset-transformations"),
    "zoom-to-fill": () => emit("zoom-to-fill"),
    "zoom-to-fit": () => emit("zoom-to-fit"),
    "zoom-increase": () => emit("zoom-increase"),
    "zoom-decrease": () => emit("zoom-decrease"),
  };

  eventMap[action.event]();
}

function updateTooltipPosition(element: HTMLElement) {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }

  animationFrame.value = requestAnimationFrame(() => {
    const rect = element.getBoundingClientRect();

    // Position tooltip at the center horizontal and exactly at the top border of the button
    tooltipPosition.value = {
      x: rect.left + rect.width / 2,
      y: rect.top,
    };
  });
}

function handleMouseEnter(event: MouseEvent, action: ToolbarAction) {
  const element = event.currentTarget as HTMLElement;

  hoveredAction.value = action.id;
  tooltipText.value = action.title;

  updateTooltipPosition(element);

  showTooltip.value = true;

  const updateLoop = () => {
    if (hoveredAction.value === action.id) {
      updateTooltipPosition(element);
      requestAnimationFrame(updateLoop);
    }
  };
  requestAnimationFrame(updateLoop);
}

function handleMouseLeave() {
  hoveredAction.value = null;
  showTooltip.value = false;

  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
    animationFrame.value = null;
  }
}
</script>

<template>
  <div class="toolbar">
    <template v-if="hasImage">
      <!-- Transform Actions -->
      <button
        v-for="action in transformActions"
        :key="action.id"
        @click="handleActionClick(action)"
        @mouseenter="handleMouseEnter($event, action)"
        @mouseleave="handleMouseLeave"
        class="toolbar-button"
        :class="{ 'toolbar-button--hovered': hoveredAction === action.id }"
      >
        <Icon :name="action.icon" />
      </button>

      <!-- View Actions -->
      <button
        v-for="action in viewActions"
        :key="action.id"
        @click="handleActionClick(action)"
        @mouseenter="handleMouseEnter($event, action)"
        @mouseleave="handleMouseLeave"
        class="toolbar-button"
        :class="{ 'toolbar-button--hovered': hoveredAction === action.id }"
      >
        <Icon :name="action.icon" />
      </button>

      <!-- Spacer -->
      <div class="spacer" />

      <!-- File Actions -->
      <button
        v-for="action in fileActions"
        :key="action.id"
        @click="handleActionClick(action)"
        @mouseenter="handleMouseEnter($event, action)"
        @mouseleave="handleMouseLeave"
        class="toolbar-button"
        :class="{ 'toolbar-button--hovered': hoveredAction === action.id }"
      >
        <Icon :name="action.icon" />
      </button>
    </template>
  </div>

  <!-- Tooltip -->
  <div
    v-if="showTooltip"
    class="toolbar-tooltip"
    :style="{
      left: tooltipPosition.x + 'px',
      top: tooltipPosition.y + 'px',
    }"
  >
    <div class="toolbar-tooltip__content">
      {{ tooltipText }}
      <div class="toolbar-tooltip__arrow" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  .spacer {
    flex: 1;
  }

  .toolbar-button {
    background: none;
    border: none;
    cursor: pointer;
    width: 32px;
    height: 32px;
    padding: 4px;
    border-radius: 6px;
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform-origin: center center;
    position: relative;

    &:hover {
      background-color: #f0f0f0;
      transform: scale(1.1);
    }

    &--hovered {
      transform: scale(1.1);
      background-color: #f0f0f0;
    }

    svg {
      width: 100%;
      height: 100%;
      transition: transform 0.1s ease;
    }
  }
}

.toolbar-tooltip {
  position: fixed;
  z-index: 99999;
  pointer-events: none;
  transform: translateX(-50%);
  margin-top: -8px;

  &__content {
    background: rgba(0, 0, 0, 0.85);
    color: rgba(255, 255, 255, 0.95);
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 11px;
    white-space: nowrap;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      sans-serif;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    position: relative;
    font-weight: 500;
    animation: tooltipShow 0.15s ease forwards;
    transform: translateY(-100%);
  }

  &__arrow {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid rgba(0, 0, 0, 0.85);
  }
}

@keyframes tooltipShow {
  from {
    opacity: 0;
    transform: translateY(-100%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(-100%) scale(1);
  }
}
</style>
