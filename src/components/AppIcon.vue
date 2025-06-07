<script lang="ts" setup>
import type { DockItem } from "../hooks/useDock";

/*
 * Custom Types
 */
interface Props {
  item: DockItem;
  index: number;
  isFocused: boolean;
}

interface Emits {
  (e: "mouseenter", index: number): void;
  (e: "mouseleave"): void;
  (e: "click", item: DockItem): void;
}

/*
 * Vue Definitions
 */
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

/*
 * Event Handlers
 */
function handleMouseEnter() {
  emit("mouseenter", props.index);
}

function handleMouseLeave() {
  emit("mouseleave");
}

function handleClick() {
  emit("click", props.item);
}
</script>

<template>
  <div
    class="dock-item-wrapper"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <div
      class="dock-item"
      :class="{
        'dock-item--minimized': item.isMinimized,
        'dock-item--focused': isFocused,
      }"
      :style="{
        transform: isFocused ? 'scale(2.2)' : 'scale(1)',
        zIndex: isFocused ? 10 : 1,
      }"
    >
      <!-- Icon -->
      <div class="dock-icon">
        <img :src="item.icon" :alt="item.title" class="dock-icon__image" />
      </div>
    </div>

    <!-- Open indicator -->
    <div
      v-if="
        !item.isMinimized &&
        item.window &&
        (item.type === 'window' || item.type === 'settings')
      "
      class="dock-indicator"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.dock-item-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dock-item {
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  cursor: pointer;
  transform-origin: 50% 100%;
  position: relative;
  will-change: transform;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.dock-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.dock-indicator {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

// Dark mode
@media (prefers-color-scheme: dark) {
  .dock-indicator {
    background: rgba(255, 255, 255, 0.9);
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .dock-item {
    transition: none !important;
  }
}
</style>
