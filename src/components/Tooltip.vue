<script lang="ts" setup>
/*
 * Custom Types
 */
interface Props {
  text: string;
  position: { x: number; y: number };
  visible: boolean;
}

/*
 * Vue Definitions
 */
defineProps<Props>();
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="tooltip"
      :style="{
        left: position.x + 'px',
        top: position.y + 'px',
      }"
    >
      <div class="tooltip__content">
        {{ text }}
        <div class="tooltip__arrow"></div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.tooltip {
  position: fixed;
  z-index: 99999;
  pointer-events: none;
  transform: translate(-50%, -100%);
}

.tooltip__content {
  background: rgba(0, 0, 0, 0.85);
  color: rgba(255, 255, 255, 0.95);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  animation: tooltipFadeIn 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-weight: 500;
  margin-bottom: 7px; /* 5px da seta + 2px de distância = 7px total */
}

.tooltip__arrow {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgba(0, 0, 0, 0.85);
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -90%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1);
  }
}
</style>
