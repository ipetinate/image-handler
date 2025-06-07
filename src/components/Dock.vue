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
  (e: "open-settings"): void;
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
const itemScales = ref<number[]>([]);

/*
 * Hooks
 */
const { dockRef, dockItems, handleItemClick } = useDock(props.allWindows, emit);

/*
 * Event Handlers
 */
function handleIconMouseEnter(index: number) {
  focusedIndex.value = index;
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

          <!-- Dock App Icon with Tooltip -->
          <Tooltip v-else :text="item.title">
            <AppIcon
              :item="item"
              :index="index"
              :is-focused="focusedIndex === index"
              @mouseenter="handleIconMouseEnter"
              @mouseleave="handleIconMouseLeave"
              @click="handleItemClick"
            />
          </Tooltip>
        </template>
      </div>
    </div>
  </div>
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
  padding: 2px 6px;
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
  gap: 12px;
}

.dock-separator {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1px;

  &__line {
    width: 1px;
    height: 70%;
    background: rgba(255, 255, 255, 0.15);
  }
}
</style>
