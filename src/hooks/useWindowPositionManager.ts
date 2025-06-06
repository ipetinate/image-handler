import { ref, onUnmounted } from "vue";

export interface WindowPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useWindowPositionManager(
  initialPosition: WindowPosition,
  onPositionChange: (position: WindowPosition) => void
) {
  const windowRef = ref<HTMLElement>();
  const isDragging = ref(false);
  const isResizing = ref(false);
  const resizeDirection = ref("");

  const windowState = ref<WindowPosition>({ ...initialPosition });
  const originalWindowState = ref<WindowPosition>({ ...initialPosition });

  const dragStart = ref({ x: 0, y: 0 });
  const windowStart = ref({ x: 0, y: 0, width: 0, height: 0 });

  function handleMouseDown(event: MouseEvent) {
    if ((event.target as HTMLElement).closest(".window__header")) {
      startDragging(event);
    }
  }

  function startDragging(event: MouseEvent) {
    isDragging.value = true;
    dragStart.value = { x: event.clientX, y: event.clientY };
    windowStart.value = { ...windowState.value };

    document.addEventListener("mousemove", handleDragging);
    document.addEventListener("mouseup", stopDragging);
    document.body.style.userSelect = "none";
  }

  function handleDragging(event: MouseEvent) {
    if (!isDragging.value) return;

    const deltaX = event.clientX - dragStart.value.x;
    const deltaY = event.clientY - dragStart.value.y;

    let newX = windowStart.value.x + deltaX;
    let newY = windowStart.value.y + deltaY;

    const padding = 40;
    const maxX = window.innerWidth - windowState.value.width - padding;
    const maxY = window.innerHeight - windowState.value.height - padding;

    newX = Math.max(padding, Math.min(newX, maxX));
    newY = Math.max(padding, Math.min(newY, maxY));

    windowState.value.x = newX;
    windowState.value.y = newY;

    onPositionChange({ ...windowState.value });
  }

  function stopDragging() {
    isDragging.value = false;
    document.removeEventListener("mousemove", handleDragging);
    document.removeEventListener("mouseup", stopDragging);
    document.body.style.userSelect = "";
  }

  function startResize(event: MouseEvent, direction: string) {
    event.stopPropagation();
    isResizing.value = true;
    resizeDirection.value = direction;
    dragStart.value = { x: event.clientX, y: event.clientY };
    windowStart.value = { ...windowState.value };

    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResize);
    document.body.style.userSelect = "none";
    document.body.style.cursor = getCursor(direction);
  }

  function handleResize(event: MouseEvent) {
    if (!isResizing.value) return;

    const deltaX = event.clientX - dragStart.value.x;
    const deltaY = event.clientY - dragStart.value.y;

    const minWidth = 400;
    const minHeight = 300;
    const padding = 40;

    let newWidth = windowStart.value.width;
    let newHeight = windowStart.value.height;
    let newX = windowStart.value.x;
    let newY = windowStart.value.y;

    if (resizeDirection.value.includes("right")) {
      newWidth = Math.max(minWidth, windowStart.value.width + deltaX);
      const maxWidth = window.innerWidth - windowStart.value.x - padding;
      newWidth = Math.min(newWidth, maxWidth);
    }

    if (resizeDirection.value.includes("left")) {
      newWidth = Math.max(minWidth, windowStart.value.width - deltaX);
      newX = windowStart.value.x + (windowStart.value.width - newWidth);
      if (newX < padding) {
        newWidth = windowStart.value.width + windowStart.value.x - padding;
        newX = padding;
      }
    }

    if (resizeDirection.value.includes("bottom")) {
      newHeight = Math.max(minHeight, windowStart.value.height + deltaY);
      const maxHeight = window.innerHeight - windowStart.value.y - padding;
      newHeight = Math.min(newHeight, maxHeight);
    }

    if (resizeDirection.value.includes("top")) {
      newHeight = Math.max(minHeight, windowStart.value.height - deltaY);
      newY = windowStart.value.y + (windowStart.value.height - newHeight);
      if (newY < padding) {
        newHeight = windowStart.value.height + windowStart.value.y - padding;
        newY = padding;
      }
    }

    const newPosition = {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    };
    windowState.value = newPosition;
    onPositionChange(newPosition);
  }

  function stopResize() {
    isResizing.value = false;
    resizeDirection.value = "";
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }

  function getCursor(direction: string): string {
    const cursors: Record<string, string> = {
      top: "n-resize",
      bottom: "s-resize",
      left: "w-resize",
      right: "e-resize",
      "top-left": "nw-resize",
      "top-right": "ne-resize",
      "bottom-left": "sw-resize",
      "bottom-right": "se-resize",
    };
    return cursors[direction] || "default";
  }

  function handleMaximize() {
    if (windowState.value.width !== window.innerWidth - 80) {
      originalWindowState.value = { ...windowState.value };
    }

    const newPosition = {
      x: 40,
      y: 40,
      width: window.innerWidth - 80,
      height: window.innerHeight - 80,
    };

    windowState.value = newPosition;
    onPositionChange(newPosition);
  }

  function updatePosition(newPosition: WindowPosition) {
    windowState.value = { ...newPosition };
  }

  onUnmounted(() => {
    stopDragging();
    stopResize();
  });

  return {
    windowRef,
    windowState,
    isDragging,
    isResizing,
    handleMouseDown,
    startResize,
    handleMaximize,
    updatePosition,
  };
}
