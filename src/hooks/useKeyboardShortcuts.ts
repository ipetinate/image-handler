import { onMounted, onBeforeUnmount } from "vue";
import { useWindowStore } from "../stores/useWindowStore";
import { usePlatform } from "./usePlatform";

export function useKeyboardShortcuts() {
  const windowStore = useWindowStore();
  const { isMacOS } = usePlatform();

  function getFocusedWindow() {
    return windowStore.topWindow;
  }

  function handleKeydown(event: KeyboardEvent) {
    const focusedWindow = getFocusedWindow();
    if (!focusedWindow || !focusedWindow.imageUrl) return;

    // Use appropriate modifier key based on platform
    const isModifierPressed = isMacOS.value ? event.metaKey : event.ctrlKey;

    // Handle by event.code for more precise key detection
    if (isModifierPressed) {
      switch (event.code) {
        case "KeyR":
          if (event.shiftKey) {
            event.preventDefault();
            windowStore.rotateRight(focusedWindow.id);
          } else {
            event.preventDefault();
            windowStore.rotateLeft(focusedWindow.id);
          }
          break;

        case "KeyH":
          if (event.shiftKey) {
            event.preventDefault();
            windowStore.flipHorizontal(focusedWindow.id);
          }
          break;

        case "KeyV":
          if (event.shiftKey) {
            event.preventDefault();
            windowStore.flipVertical(focusedWindow.id);
          }
          break;

        case "KeyG":
          event.preventDefault();
          windowStore.toggleGrid(focusedWindow.id);
          break;

        case "KeyU":
          if (event.shiftKey) {
            event.preventDefault();
            windowStore.resetTransformations(focusedWindow.id);
          }
          break;

        case "KeyD":
          if (event.shiftKey) {
            event.preventDefault();
            windowStore.removeImage(focusedWindow.id);
          }
          break;
      }
    }
  }

  onMounted(() => {
    document.addEventListener("keydown", handleKeydown);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("keydown", handleKeydown);
  });

  return {
    getFocusedWindow,
  };
}
