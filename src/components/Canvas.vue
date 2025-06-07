<script lang="ts" setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from "vue";
import { usePlatform } from "../hooks/usePlatform";

import Icon from "./Icon.vue";
import ZoomControls from "./ZoomControls.vue";

/*
 * Custom Types
 */

type Props = {
  imageUrl: string | null;
  rotation: number;
  flipX: number;
  flipY: number;
  showGrid: boolean;
  imageScale: number;
  imageOffsetX: number;
  imageOffsetY: number;
};

type Events = {
  (e: "file-selected", file: File): void;
  (e: "image-position-changed", offsetX: number, offsetY: number): void;
  (e: "zoom-change", scale: number): void;
  (e: "zoom-increase"): void;
  (e: "zoom-decrease"): void;
};

/*
 * Vue Definitions
 */

const emit = defineEmits<Events>();
const props = defineProps<Props>();

/*
 * Hooks
 */
const { isMacOS } = usePlatform();

/*
 * Refs & Reactives
 */

const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const isDraggingImage = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const currentOffset = ref({ x: 0, y: 0 });
const canvasRef = ref<HTMLDivElement | null>(null);

// Touch/pinch gesture tracking
const touches = ref<Touch[]>([]);
const lastPinchDistance = ref(0);
const initialScale = ref(1);

/*
 * Watchers
 */

// Reset file input when image is removed
watch(
  () => props.imageUrl,
  (newUrl, oldUrl) => {
    if (oldUrl && !newUrl && fileInput.value) {
      // Reset file input value when image is removed
      fileInput.value.value = "";
    }
  }
);

// Update current offset when props change
watch(
  () => [props.imageOffsetX, props.imageOffsetY],
  () => {
    currentOffset.value = { x: props.imageOffsetX, y: props.imageOffsetY };
  },
  { immediate: true }
);

/*
 * Computeds
 */

const imageStyles = computed(() => ({
  transform: `
    translate(${currentOffset.value.x}px, ${currentOffset.value.y}px) 
    scale(${props.imageScale}) 
    rotate(${props.rotation}deg) 
    scale(${props.flipX}, ${props.flipY})
  `,
  cursor: props.imageScale > 1 ? "grab" : "default",
}));

const showZoomControls = computed(() => !!props.imageUrl);

/*
 * Methods
 */

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files && files[0]) {
    emit("file-selected", files[0]);
    // Reset input after selection to allow selecting the same file again
    target.value = "";
  }
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  isDragging.value = false;
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    emit("file-selected", e.dataTransfer.files[0]);
  }
}

function handleCanvasClick() {
  if (!props.imageUrl && fileInput.value) {
    fileInput.value.click();
  }
}

function startImageDrag(e: MouseEvent) {
  if (props.imageScale > 1 && props.imageUrl) {
    e.preventDefault();
    isDraggingImage.value = true;
    dragStart.value = {
      x: e.clientX - currentOffset.value.x,
      y: e.clientY - currentOffset.value.y,
    };

    document.addEventListener("mousemove", handleImageDrag);
    document.addEventListener("mouseup", stopImageDrag);
  }
}

function handleImageDrag(e: MouseEvent) {
  if (isDraggingImage.value) {
    const newOffset = {
      x: e.clientX - dragStart.value.x,
      y: e.clientY - dragStart.value.y,
    };
    currentOffset.value = newOffset;
  }
}

function stopImageDrag() {
  if (isDraggingImage.value) {
    isDraggingImage.value = false;
    emit(
      "image-position-changed",
      currentOffset.value.x,
      currentOffset.value.y
    );

    document.removeEventListener("mousemove", handleImageDrag);
    document.removeEventListener("mouseup", stopImageDrag);
  }
}

function handleWheel(e: WheelEvent) {
  if (!props.imageUrl) return;

  const isModifierPressed = isMacOS.value ? e.metaKey : e.ctrlKey;

  if (isModifierPressed) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const newScale = Math.max(0.25, Math.min(props.imageScale + delta, 5));
    emit("zoom-change", newScale);
  }
}

function handleTouchStart(e: TouchEvent) {
  if (!props.imageUrl) return;

  touches.value = Array.from(e.touches);

  if (touches.value.length === 2) {
    // Prevent default browser pinch-to-zoom
    e.preventDefault();

    const touch1 = touches.value[0];
    const touch2 = touches.value[1];

    if (touch1 && touch2) {
      const distance = getTouchDistance(touch1, touch2);
      lastPinchDistance.value = distance;
      initialScale.value = props.imageScale;
    }
  }
}

function handleTouchMove(e: TouchEvent) {
  if (!props.imageUrl) return;

  touches.value = Array.from(e.touches);

  if (touches.value.length === 2) {
    e.preventDefault();

    const touch1 = touches.value[0];
    const touch2 = touches.value[1];

    if (touch1 && touch2 && lastPinchDistance.value > 0) {
      const distance = getTouchDistance(touch1, touch2);
      const scaleFactor = distance / lastPinchDistance.value;
      const newScale = Math.max(
        0.25,
        Math.min(initialScale.value * scaleFactor, 5)
      );
      emit("zoom-change", newScale);
    }
  }
}

function handleTouchEnd(e: TouchEvent) {
  touches.value = Array.from(e.touches);

  if (touches.value.length < 2) {
    lastPinchDistance.value = 0;
    initialScale.value = 1;
  }
}

function getTouchDistance(touch1: Touch, touch2: Touch): number {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function handleKeydown(e: KeyboardEvent) {
  if (!props.imageUrl) return;

  const isModifierPressed = isMacOS.value ? e.metaKey : e.ctrlKey;

  if (isModifierPressed) {
    if (e.key === "=" || e.key === "+") {
      e.preventDefault();
      emit("zoom-increase");
    } else if (e.key === "-") {
      e.preventDefault();
      emit("zoom-decrease");
    }
  }
}

function handleZoomControlsIncrease() {
  emit("zoom-increase");
}

function handleZoomControlsDecrease() {
  emit("zoom-decrease");
}

function handleZoomControlsChange(scale: number) {
  emit("zoom-change", scale);
}

/*
 * Lifecycle
 */
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div
    ref="canvasRef"
    class="canvas"
    :class="{ dragging: isDragging }"
    @drop="onDrop"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @click="handleCanvasClick"
    @wheel="handleWheel"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="file-input"
      @change="onFileChange"
    />

    <template v-if="!imageUrl">
      <div class="placeholder">
        <Icon name="upload" />
        <p v-if="!isDragging">Clique ou arraste uma imagem aqui</p>
        <p v-else>Solte a imagem</p>
      </div>
    </template>

    <template v-else>
      <div class="image-wrapper">
        <img
          :src="imageUrl"
          class="image"
          :style="imageStyles"
          @mousedown="startImageDrag"
          :class="{ dragging: isDraggingImage }"
        />
        <div v-if="showGrid" class="grid"></div>

        <!-- Floating Zoom Controls -->
        <ZoomControls
          :image-scale="imageScale"
          :visible="showZoomControls"
          @zoom-increase="handleZoomControlsIncrease"
          @zoom-decrease="handleZoomControlsDecrease"
          @zoom-change="handleZoomControlsChange"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.canvas {
  width: 100%;
  height: 100%;
  border: 2px dashed #ddd;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;

  &.dragging {
    border-color: #999;
  }
}

.file-input {
  display: none;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #999;
  text-align: center;

  svg {
    width: 48px;
    height: 48px;
  }
}

.image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s;
  user-select: none;

  &.dragging {
    cursor: grabbing !important;
    transition: none;
  }
}

.grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.2) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 1px, transparent 1px);
  background-size: 100px 100px;
  pointer-events: none;
}
</style>
