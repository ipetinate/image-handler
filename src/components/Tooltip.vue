<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

/*
 * Custom Types
 */
interface Props {
  text: string;
}

/*
 * Vue Definitions
 */
defineProps<Props>();

/*
 * Refs
 */
const triggerRef = ref<HTMLElement>();
const tooltipRef = ref<HTMLElement>();
const showTooltip = ref(false);

/*
 * Methods
 */
function updateTooltipPosition() {
  if (!triggerRef.value || !tooltipRef.value || !showTooltip.value) return;

  // Find the actual scaled element (dock-item)
  const scaledElement = triggerRef.value.querySelector(
    ".dock-item"
  ) as HTMLElement;
  const targetElement = scaledElement || triggerRef.value;

  const rect = targetElement.getBoundingClientRect();
  const triggerRect = triggerRef.value.getBoundingClientRect();

  // Position tooltip above the visual top of the scaled element
  const tooltipHeight = tooltipRef.value.offsetHeight;
  const gap = 8;

  // Calculate position relative to the trigger wrapper
  const leftOffset = rect.left - triggerRect.left + rect.width / 2;
  const topOffset = rect.top - triggerRect.top - tooltipHeight - gap;

  tooltipRef.value.style.left = `${leftOffset}px`;
  tooltipRef.value.style.top = `${topOffset}px`;
  tooltipRef.value.style.transform = "translateX(-50%)";
}

function handleMouseEnter() {
  showTooltip.value = true;
  requestAnimationFrame(() => {
    updateTooltipPosition();
  });
}

function handleMouseLeave() {
  showTooltip.value = false;
}

/*
 * Lifecycle
 */
onMounted(() => {
  if (showTooltip.value) {
    updateTooltipPosition();
  }
});

onBeforeUnmount(() => {
  // Cleanup if needed
});
</script>

<template>
  <div
    ref="triggerRef"
    class="tooltip-trigger"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Wrapper fora da tooltip -->
    <div class="tooltip-slot">
      <slot />
    </div>

    <!-- Tooltip posicionada acima -->
    <div v-if="showTooltip" ref="tooltipRef" class="tooltip">
      <div class="tooltip__content">
        {{ text }}
        <div class="tooltip__arrow" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tooltip-trigger {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.tooltip-slot {
  /* Wrapper que pode crescer com scale() */
  transform-origin: bottom center;
}

/* Tooltip acima do slot */
.tooltip {
  position: absolute;
  z-index: 99999;
  pointer-events: none;
  opacity: 0;
  animation: tooltipShow 0.15s ease forwards;
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
  font-weight: 500;
}

.tooltip__arrow {
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

@keyframes tooltipShow {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}
</style>
