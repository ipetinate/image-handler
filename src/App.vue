<script lang="ts" setup>
import { onMounted } from "vue";

import { useDownload } from "./hooks/useDownload";
import { useWindowStore } from "./stores/useWindowStore";

import Canvas from "./components/Canvas.vue";
import Toolbar from "./components/Toolbar.vue";
import Window from "./components/Window.vue";
import Modal from "./components/Modal.vue";
import Dock from "./components/Dock.vue";

import bannerImg from "./assets/quick-img-tweakr-banner.png";

/*
 * Custom Types
 */

type Position = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/*
 * Hooks
 */

const windowStore = useWindowStore();
const {
  showDownloadModal,
  downloadingWindowId,
  handleDownloadConfirm,
  handleDownloadCancel,
  handleDownload,
  getCurrentDownloadFileName,
} = useDownload();

/*
 * Methods
 */

function handleCreateNewWindow() {
  windowStore.createWindow();
}

function handlePositionChange(windowId: string, pos: Position) {
  windowStore.updateWindowPosition(windowId, pos);
}

function handleBringToFront(windowId: string) {
  windowStore.bringToFront(windowId);
}

function handleDownloadConfirmWrapper(fileName: string) {
  const windowInstance = downloadingWindowId.value
    ? windowStore.getWindow(downloadingWindowId.value) || null
    : null;

  handleDownloadConfirm(fileName, windowInstance);
}

function getCurrentDownloadFileNameWrapper(): string {
  const windowInstance = downloadingWindowId.value
    ? windowStore.getWindow(downloadingWindowId.value) || null
    : null;

  return getCurrentDownloadFileName(windowInstance);
}

/*
 * Lifecycle Hooks
 */

onMounted(() => {
  windowStore.createWindow();
});
</script>

<template>
  <div class="banner">
    <img :src="bannerImg" alt="Quick Img Tweakr" class="banner-image" />
  </div>

  <!-- Render all non-minimized windows -->
  <template
    v-for="windowInstance in windowStore.openWindows"
    :key="windowInstance.id"
  >
    <Window
      :window-id="windowInstance.id"
      :initial-position="windowInstance.position"
      :z-index="windowInstance.zIndex"
      :is-animating-minimize="windowInstance.isAnimatingMinimize"
      :is-animating-restore="windowInstance.isAnimatingRestore"
      :file-name="windowInstance.fileName"
      :has-image="!!windowInstance.imageUrl"
      @minimize="windowStore.minimizeWindow"
      @close="windowStore.closeWindow"
      @position-change="(pos) => handlePositionChange(windowInstance.id, pos)"
      @bring-to-front="handleBringToFront"
    >
      <Toolbar
        :grid-enabled="windowInstance.showGrid"
        :has-image="!!windowInstance.imageUrl"
        @flip-vertical="windowStore.flipVertical(windowInstance.id)"
        @flip-horizontal="windowStore.flipHorizontal(windowInstance.id)"
        @rotate-left="windowStore.rotateLeft(windowInstance.id)"
        @rotate-right="windowStore.rotateRight(windowInstance.id)"
        @toggle-grid="windowStore.toggleGrid(windowInstance.id)"
        @download="handleDownload(windowInstance.id)"
        @remove="windowStore.removeImage(windowInstance.id)"
      />

      <Canvas
        :image-url="windowInstance.imageUrl"
        :rotation="windowInstance.rotation"
        :flip-x="windowInstance.flipX"
        :flip-y="windowInstance.flipY"
        :show-grid="windowInstance.showGrid"
        @file-selected="(file: File) => windowStore.loadFileToWindow(windowInstance.id, file)"
      />
    </Window>
  </template>

  <Modal
    :show="showDownloadModal"
    title="Salvar Imagem"
    :file-name="getCurrentDownloadFileNameWrapper()"
    @close="handleDownloadCancel"
    @confirm="handleDownloadConfirmWrapper"
  />

  <Dock
    :has-open-windows="windowStore.hasOpenWindows"
    :all-windows="windowStore.windows"
    @restore-window="windowStore.restoreWindow"
    @bring-to-front="handleBringToFront"
    @create-new-window="handleCreateNewWindow"
  />
</template>

<style lang="scss" scoped>
.banner {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.banner-image {
  width: 180px;
  height: auto;
  display: block;
}
</style>
