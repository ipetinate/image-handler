<script lang="ts" setup>
import { ref, nextTick } from "vue";

import Icon from "./Icon.vue";
import Tooltip from "./Tooltip.vue";

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
  | "flip-horizontal";

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
    | "remove";
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
    title: "Espelhar vertical",
    group: "transform",
  },
  {
    id: "flip-horizontal",
    event: "flip-horizontal",
    icon: "flip-horizontal",
    title: "Espelhar horizontal",
    group: "transform",
  },
  {
    id: "rotate-left",
    event: "rotate-left",
    icon: "rotate-left",
    title: "Girar esquerda",
    group: "transform",
  },
  {
    id: "rotate-right",
    event: "rotate-right",
    icon: "rotate-right",
    title: "Girar direita",
    group: "transform",
  },
  // View group
  {
    id: "toggle-grid",
    event: "toggle-grid",
    icon: "grid",
    title: "Mostrar grid",
    group: "view",
  },
  // File group
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
    title: "Remover imagem",
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
  };

  eventMap[action.event]();
}

function updateTooltipPosition(element: HTMLElement) {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }

  animationFrame.value = requestAnimationFrame(() => {
    const rect = element.getBoundingClientRect();

    // Position tooltip at the center horizontal and above the button
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

  // Show tooltip after a brief delay
  nextTick(() => {
    showTooltip.value = true;
  });

  // Continue updating position while hovering (for any dynamic changes)
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
  <Tooltip
    :visible="showTooltip"
    :text="tooltipText"
    :position="tooltipPosition"
  />
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
</style>
