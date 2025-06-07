<script lang="ts" setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import { useDownload } from "./hooks/useDownload";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useToast } from "./hooks/useToast";
import { useWindowStore } from "./stores/useWindowStore";
import { useSettingsStore } from "./stores/useSettingsStore";

import Canvas from "./components/Canvas.vue";
import Toolbar from "./components/Toolbar.vue";
import Window from "./components/Window.vue";
import Modal from "./components/Modal.vue";
import Dock from "./components/Dock.vue";
import LoginButton from "./components/LoginButton.vue";
import SettingsContent from "./components/SettingsContent.vue";
import Toast from "./components/Toast.vue";

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

const router = useRouter();
const windowStore = useWindowStore();
const settingsStore = useSettingsStore();
const { toasts, removeToast } = useToast();
useKeyboardShortcuts();
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

function handleOpenSettings() {
  const existingSettings = windowStore.getSettingsWindow();
  if (existingSettings) {
    if (existingSettings.isMinimized) {
      windowStore.restoreWindow("settings-window");
    } else {
      windowStore.bringToFront("settings-window");
    }
  } else {
    windowStore.createSettingsWindow();
    settingsStore.openSettingsWindow();
    // Navigate to last visited route
    router.push(`/settings/${settingsStore.lastVisitedRoute}`);
  }
}

function handleMinimizeSettings() {
  windowStore.minimizeWindow("settings-window");
  // Navigate away from settings routes when minimized
  router.push("/");
}

function handleCloseWindow(windowId: string) {
  if (windowId === "settings-window") {
    settingsStore.closeSettingsWindow();
    router.push("/");
  }
  windowStore.closeWindow(windowId);
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

  <div class="login-area">
    <LoginButton @open-settings="handleOpenSettings" />
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
        @reset-transformations="
          windowStore.resetTransformations(windowInstance.id)
        "
        @zoom-to-fill="windowStore.zoomToFill(windowInstance.id)"
        @zoom-to-fit="windowStore.zoomToFit(windowInstance.id)"
        @zoom-increase="windowStore.zoomIncrease(windowInstance.id)"
        @zoom-decrease="windowStore.zoomDecrease(windowInstance.id)"
      />

      <Canvas
        :image-url="windowInstance.imageUrl"
        :rotation="windowInstance.rotation"
        :flip-x="windowInstance.flipX"
        :flip-y="windowInstance.flipY"
        :show-grid="windowInstance.showGrid"
        :image-scale="windowInstance.imageScale"
        :image-offset-x="windowInstance.imageOffsetX"
        :image-offset-y="windowInstance.imageOffsetY"
        @file-selected="(file: File) => windowStore.loadFileToWindow(windowInstance.id, file)"
        @image-position-changed="(x: number, y: number) => windowStore.updateImagePosition(windowInstance.id, x, y)"
        @zoom-change="(scale: number) => windowStore.setZoomLevel(windowInstance.id, scale)"
        @zoom-increase="windowStore.zoomIncrease(windowInstance.id)"
        @zoom-decrease="windowStore.zoomDecrease(windowInstance.id)"
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
    @open-settings="handleOpenSettings"
  />

  <!-- Settings Window (rendered like other windows) -->
  <template
    v-for="windowInstance in windowStore.windows"
    :key="`settings-${windowInstance.id}`"
  >
    <Window
      v-if="windowInstance.type === 'settings' && !windowInstance.isMinimized"
      :window-id="windowInstance.id"
      :initial-position="windowInstance.position"
      :z-index="windowInstance.zIndex"
      :is-animating-minimize="windowInstance.isAnimatingMinimize"
      :is-animating-restore="windowInstance.isAnimatingRestore"
      :file-name="windowInstance.fileName"
      :has-image="false"
      @minimize="handleMinimizeSettings"
      @close="() => handleCloseWindow(windowInstance.id)"
      @position-change="(pos) => handlePositionChange(windowInstance.id, pos)"
      @bring-to-front="() => handleBringToFront(windowInstance.id)"
    >
      <SettingsContent />
    </Window>
  </template>

  <!-- Toast Notifications -->
  <template v-for="toast in toasts" :key="toast.id">
    <Toast
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
      @close="() => removeToast(toast.id)"
    />
  </template>
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

.login-area {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
