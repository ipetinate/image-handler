<script lang="ts" setup>
import { ref } from 'vue';

import Canvas from './components/Canvas.vue';
import Toolbar from './components/Toolbar.vue';
import Window from './components/Window.vue';

const file = ref<File | null>(null);
const imageUrl = ref<string | null>(null);
const rotation = ref(0);
const flipX = ref(1);
const flipY = ref(1);
const showGrid = ref(false);

function loadFile(f: File) {
  file.value = f;
  imageUrl.value = URL.createObjectURL(f);
  resetTransforms();
}

function resetTransforms() {
  rotation.value = 0;
  flipX.value = 1;
  flipY.value = 1;
}

function rotateLeft() {
  rotation.value -= 90;
}

function rotateRight() {
  rotation.value += 90;
}

function flipHorizontal() {
  flipX.value *= -1;
}

function flipVertical() {
  flipY.value *= -1;
}

function removeImage() {
  file.value = null;
  imageUrl.value = null;
  resetTransforms();
}

function downloadImage() {
  if (!imageUrl.value) return;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = imageUrl.value;

  img.onload = () => {
    const canvas = document.createElement('canvas');

    const swapSize = Math.abs(rotation.value % 180) === 90;
    const width = swapSize ? img.height : img.width;
    const height = swapSize ? img.width : img.height;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();

    ctx.translate(width / 2, height / 2);
    ctx.rotate((rotation.value * Math.PI) / 180);
    ctx.scale(flipX.value, flipY.value);

    ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);

    ctx.restore();

    const link = document.createElement('a');
    link.download = file.value?.name ?? 'image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
}
</script>

<template>
  <Window>
    <Toolbar
      :grid-enabled="showGrid"
      @flip-vertical="flipVertical"
      @flip-horizontal="flipHorizontal"
      @rotate-left="rotateLeft"
      @rotate-right="rotateRight"
      @toggle-grid="showGrid = !showGrid"
      @download="downloadImage"
      @remove="removeImage"
    />

    <Canvas
      :image-url="imageUrl"
      :rotation="rotation"
      :flip-x="flipX"
      :flip-y="flipY"
      :show-grid="showGrid"
      @file-selected="loadFile"
    />
  </Window>
</template>
