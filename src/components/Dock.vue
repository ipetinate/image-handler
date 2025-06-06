<script lang="ts" setup>
import type { WindowInstance } from "../stores/useWindowStore";

import { ref, onMounted, watch } from "vue";

import { useDock } from "../hooks/useDock";

import AppIcon from "./AppIcon.vue";
import Tooltip from "./Tooltip.vue";

/*
 * Custom Types
 */
interface Props {
  hasOpenWindows: boolean;
  allWindows: WindowInstance[];
}

interface Emits {
  (e: "restore-window", windowId: string): void;
  (e: "bring-to-front", windowId: string): void;
  (e: "create-new-window"): void;
}

/*
 * Vue Definitions
 */
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

/*
 * Local state
 */
const focusedIndex = ref(-1);
const tooltipPosition = ref({ x: 0, y: 0 });
const itemScales = ref<number[]>([]);

/*
 * Hooks
 */
const { dockRef, dockItems, handleItemClick } = useDock(props.allWindows, emit);

/*
 * Event Handlers
 */
function handleIconMouseEnter(index: number, event: MouseEvent) {
  const wrapper = event.currentTarget as HTMLElement;
  const dockItem = wrapper.querySelector(".dock-item") as HTMLElement;

  if (wrapper && dockItem) {
    focusedIndex.value = index;

    // Get the position of the actual dock-item (the scaled icon)
    const itemRect = dockItem.getBoundingClientRect();

    // Position tooltip at the center horizontal and just above the top of the icon
    tooltipPosition.value = {
      x: itemRect.left + itemRect.width / 2,
      y: itemRect.top, // Exatamente na borda superior do ícone
    };
  }
}

function handleIconMouseLeave() {
  focusedIndex.value = -1;
  itemScales.value = new Array(dockItems.value.length).fill(1);
}

/*
 * Initialize scales
 */
onMounted(() => {
  itemScales.value = new Array(dockItems.value.length).fill(1);
});

watch(dockItems, () => {
  itemScales.value = new Array(dockItems.value.length).fill(1);
});
</script>

<template>
  <div class="dock-container">
    <div ref="dockRef" class="dock">
      <div class="dock-inner">
        <template v-for="(item, index) in dockItems" :key="item.id">
          <!-- Separator Visual Element -->
          <div v-if="item.type === 'separator'" class="dock-separator">
            <div class="dock-separator__line"></div>
          </div>

          <!-- Dock App Icon -->
          <AppIcon
            v-else
            :item="item"
            :index="index"
            :is-focused="focusedIndex === index"
            @mouseenter="handleIconMouseEnter"
            @mouseleave="handleIconMouseLeave"
            @click="handleItemClick"
          />
        </template>
      </div>
    </div>
  </div>

  <!-- Tooltip -->
  <Tooltip
    :visible="focusedIndex >= 0 && !!dockItems[focusedIndex]"
    :text="dockItems[focusedIndex]?.title || ''"
    :position="tooltipPosition"
  />
</template>

<style lang="scss" scoped>
.dock-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  pointer-events: none;
}

.dock {
  height: 80px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
  padding: 8px;
}

.dock-inner {
  padding: 2px;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: rgba(83, 83, 83, 0.25);
  backdrop-filter: blur(13px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  min-width: 120px;
  overflow: visible;
}

.dock-separator {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  &__line {
    width: 1px;
    height: 70%;
    background: rgba(255, 255, 255, 0.15);
  }
}

// Dark mode
@media (prefers-color-scheme: dark) {
  .dock-inner {
    background: rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .dock-item {
    transition: none !important;
  }
}
</style>
