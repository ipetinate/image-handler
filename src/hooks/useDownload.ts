import { ref } from "vue";
import type { WindowInstance } from "../stores/useWindowStore";

/**
 * Hook para gerenciar downloads de imagens das janelas
 */
function useDownload() {
  /*
   * Refs & Reactives
   */
  const showDownloadModal = ref(false);
  const downloadingWindowId = ref<string | null>(null);

  /*
   * Methods
   */
  function getFileNameWithoutExtension(fileName: string): string {
    return fileName.replace(/\.[^/.]+$/, "");
  }

  function handleDownloadConfirm(
    fileName: string,
    windowInstance: WindowInstance | null
  ) {
    if (!downloadingWindowId.value || !windowInstance?.imageUrl) return;

    const img = new Image();

    img.crossOrigin = "anonymous";
    img.src = windowInstance.imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");

      const swapSize = Math.abs(windowInstance.rotation % 180) === 90;
      const width = swapSize ? img.height : img.width;
      const height = swapSize ? img.width : img.height;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();

      ctx.translate(width / 2, height / 2);
      ctx.rotate((windowInstance.rotation * Math.PI) / 180);
      ctx.scale(windowInstance.flipX, windowInstance.flipY);

      ctx.drawImage(
        img,
        -img.width / 2,
        -img.height / 2,
        img.width,
        img.height
      );

      ctx.restore();

      const link = document.createElement("a");

      link.download = fileName;
      link.href = canvas.toDataURL("image/png");
      link.click();

      showDownloadModal.value = false;
      downloadingWindowId.value = null;
    };
  }

  function handleDownloadCancel() {
    showDownloadModal.value = false;
    downloadingWindowId.value = null;
  }

  function handleDownload(windowId: string) {
    downloadingWindowId.value = windowId;
    showDownloadModal.value = true;
  }

  function getCurrentDownloadFileName(
    windowInstance: WindowInstance | null
  ): string {
    if (!downloadingWindowId.value || !windowInstance?.fileName)
      return "image.png";

    return getFileNameWithoutExtension(windowInstance.fileName) + ".png";
  }

  return {
    showDownloadModal,
    downloadingWindowId,
    handleDownloadConfirm,
    handleDownloadCancel,
    handleDownload,
    getCurrentDownloadFileName,
  };
}

export { useDownload };
