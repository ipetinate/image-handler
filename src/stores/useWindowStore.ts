import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface WindowInstance {
  id: string;
  isMinimized: boolean;
  imageUrl: string | null;
  fileName: string | null;
  rotation: number;
  flipX: number;
  flipY: number;
  showGrid: boolean;
  position: { x: number; y: number; width: number; height: number };
  zIndex: number;
  isAnimatingMinimize: boolean;
  isAnimatingRestore: boolean;
  type?: "image" | "settings";
}

export const useWindowStore = defineStore("windows", () => {
  const windows = ref<WindowInstance[]>([]);
  const nextId = ref(1);
  const nextZIndex = ref(1001);

  const openWindows = computed(() =>
    windows.value
      .filter((w) => !w.isMinimized)
      .sort((a, b) => a.zIndex - b.zIndex)
  );
  const minimizedWindows = computed(() =>
    windows.value.filter((w) => w.isMinimized)
  );
  const hasOpenWindows = computed(() => windows.value.length > 0);
  const topWindow = computed(() =>
    openWindows.value.length > 0
      ? openWindows.value[openWindows.value.length - 1]
      : null
  );

  function createWindow(): WindowInstance {
    const windowId = `window-${nextId.value++}`;

    const newWindow: WindowInstance = {
      id: windowId,
      isMinimized: false,
      imageUrl: null,
      fileName: null,
      rotation: 0,
      flipX: 1,
      flipY: 1,
      showGrid: false,
      position: {
        x: 100 + windows.value.length * 30,
        y: 100 + windows.value.length * 30,
        width: 800,
        height: 600,
      },
      zIndex: nextZIndex.value++,
      isAnimatingMinimize: false,
      isAnimatingRestore: false,
    };

    windows.value.push(newWindow);
    return newWindow;
  }

  function createSettingsWindow(): WindowInstance {
    const settingsWindow: WindowInstance = {
      id: "settings-window",
      isMinimized: false,
      imageUrl: null,
      fileName: "Configurações",
      rotation: 0,
      flipX: 1,
      flipY: 1,
      showGrid: false,
      position: {
        x: (window.innerWidth - 800) / 2,
        y: (window.innerHeight - 600) / 2,
        width: 800,
        height: 600,
      },
      zIndex: nextZIndex.value++,
      isAnimatingMinimize: false,
      isAnimatingRestore: false,
      type: "settings",
    };

    // Remove existing settings window if any
    const existingIndex = windows.value.findIndex(
      (w) => w.id === "settings-window"
    );
    if (existingIndex !== -1) {
      windows.value.splice(existingIndex, 1);
    }

    windows.value.push(settingsWindow);
    return settingsWindow;
  }

  function getWindow(id: string): WindowInstance | undefined {
    return windows.value.find((w) => w.id === id);
  }

  function getSettingsWindow(): WindowInstance | undefined {
    return windows.value.find((w) => w.id === "settings-window");
  }

  function updateWindow(id: string, updates: Partial<WindowInstance>) {
    const windowIndex = windows.value.findIndex((w) => w.id === id);
    if (windowIndex !== -1) {
      const currentWindow = windows.value[windowIndex];
      if (currentWindow) {
        windows.value[windowIndex] = {
          ...currentWindow,
          isMinimized: updates.isMinimized ?? currentWindow.isMinimized,
          imageUrl:
            updates.imageUrl !== undefined
              ? updates.imageUrl
              : currentWindow.imageUrl,
          fileName:
            updates.fileName !== undefined
              ? updates.fileName
              : currentWindow.fileName,
          rotation: updates.rotation ?? currentWindow.rotation,
          flipX: updates.flipX ?? currentWindow.flipX,
          flipY: updates.flipY ?? currentWindow.flipY,
          showGrid: updates.showGrid ?? currentWindow.showGrid,
          position: updates.position ?? currentWindow.position,
          zIndex: updates.zIndex ?? currentWindow.zIndex,
          isAnimatingMinimize:
            updates.isAnimatingMinimize ?? currentWindow.isAnimatingMinimize,
          isAnimatingRestore:
            updates.isAnimatingRestore ?? currentWindow.isAnimatingRestore,
          id: currentWindow.id, // Ensure id is never overwritten
        };
      }
    }
  }

  function bringToFront(id: string) {
    const window = getWindow(id);
    if (window && !window.isMinimized) {
      updateWindow(id, { zIndex: nextZIndex.value++ });
    }
  }

  function minimizeWindow(id: string) {
    updateWindow(id, { isAnimatingMinimize: true });

    setTimeout(() => {
      updateWindow(id, {
        isMinimized: true,
        isAnimatingMinimize: false,
      });
    }, 500);
  }

  function restoreWindow(id: string) {
    const window = getWindow(id);
    if (window && window.isMinimized) {
      updateWindow(id, {
        isMinimized: false,
        isAnimatingRestore: true,
        zIndex: nextZIndex.value++,
      });

      setTimeout(() => {
        updateWindow(id, { isAnimatingRestore: false });
      }, 500);
    }
  }

  function closeWindow(id: string) {
    const windowIndex = windows.value.findIndex((w) => w.id === id);
    if (windowIndex !== -1) {
      const window = windows.value[windowIndex];

      if (window?.imageUrl) {
        URL.revokeObjectURL(window.imageUrl);
      }

      windows.value.splice(windowIndex, 1);
    }
  }

  function loadFileToWindow(id: string, file: File) {
    const window = getWindow(id);

    if (window?.imageUrl) {
      URL.revokeObjectURL(window.imageUrl);
    }

    const imageUrl = URL.createObjectURL(file);
    updateWindow(id, {
      imageUrl,
      fileName: file.name,
      rotation: 0,
      flipX: 1,
      flipY: 1,
    });
  }

  function updateWindowPosition(
    id: string,
    position: { x: number; y: number; width: number; height: number }
  ) {
    updateWindow(id, { position });
  }

  function rotateLeft(id: string) {
    const window = getWindow(id);
    if (window) {
      updateWindow(id, { rotation: window.rotation - 90 });
    }
  }

  function rotateRight(id: string) {
    const window = getWindow(id);
    if (window) {
      updateWindow(id, { rotation: window.rotation + 90 });
    }
  }

  function flipHorizontal(id: string) {
    const window = getWindow(id);
    if (window) {
      updateWindow(id, { flipX: window.flipX * -1 });
    }
  }

  function flipVertical(id: string) {
    const window = getWindow(id);
    if (window) {
      updateWindow(id, { flipY: window.flipY * -1 });
    }
  }

  function toggleGrid(id: string) {
    const window = getWindow(id);
    if (window) {
      updateWindow(id, { showGrid: !window.showGrid });
    }
  }

  function removeImage(id: string) {
    const window = getWindow(id);

    if (window?.imageUrl) {
      URL.revokeObjectURL(window.imageUrl);
    }

    updateWindow(id, {
      imageUrl: null,
      fileName: null,
      rotation: 0,
      flipX: 1,
      flipY: 1,
    });
  }

  function resetTransformations(id: string) {
    const window = getWindow(id);
    if (window && window.imageUrl) {
      updateWindow(id, {
        rotation: 0,
        flipX: 1,
        flipY: 1,
      });
    }
  }

  return {
    windows,

    openWindows,
    minimizedWindows,
    hasOpenWindows,
    topWindow,

    createWindow,
    createSettingsWindow,
    getWindow,
    getSettingsWindow,
    updateWindow,
    bringToFront,
    minimizeWindow,
    restoreWindow,
    closeWindow,
    loadFileToWindow,
    updateWindowPosition,

    rotateLeft,
    rotateRight,
    flipHorizontal,
    flipVertical,
    toggleGrid,
    removeImage,
    resetTransformations,
  };
});
