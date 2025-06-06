<script lang="ts" setup>
import { computed, ref } from "vue";

import Icon from "./Icon.vue";

/*
 * Custom Types
 */

type Props = {
  imageUrl: string | null;
  rotation: number;
  flipX: number;
  flipY: number;
  showGrid: boolean;
};

type Events = {
  (e: "file-selected", file: File): void;
};

/*
 * Vue Definitions
 */

const emit = defineEmits<Events>();
const props = defineProps<Props>();

/*
 * Refs & Reactives
 */

const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

/*
 * Computeds
 */

const imageStyles = computed(() => ({
  transform: `rotate(${props.rotation}deg) scale(${props.flipX}, ${props.flipY})`,
}));

/*
 * Methods
 */

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files && files[0]) {
    emit("file-selected", files[0]);
  }
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  isDragging.value = false;
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    emit("file-selected", e.dataTransfer.files[0]);
  }
}
</script>

<template>
  <div
    class="canvas"
    :class="{ dragging: isDragging }"
    @drop="onDrop"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @click="!imageUrl && fileInput?.click()"
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
        <img :src="imageUrl" class="image" :style="imageStyles" />
        <div v-if="showGrid" class="grid"></div>
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
