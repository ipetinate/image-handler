<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";

import {
  useWindowPositionManager,
  type WindowPosition,
} from "../hooks/useWindowPositionManager";

import Icon from "./WindowIcon.vue";

/*
 * Custom Types
 */

interface Props {
  windowId: string;
  initialPosition: WindowPosition;
  zIndex: number;
  isAnimatingMinimize: boolean;
  isAnimatingRestore: boolean;
  fileName?: string | null;
  hasImage?: boolean;
}

interface Emits {
  (e: "minimize", windowId: string): void;
  (e: "close", windowId: string): void;
  (e: "position-change", position: WindowPosition): void;
  (e: "bring-to-front", windowId: string): void;
}

/*
 * Vue Definitions
 */

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const hovered = ref(false);
const showCloseModal = ref(false);

/*
 * Hooks
 */

const {
  windowRef,
  windowState,
  handleMouseDown,
  startResize,
  handleMaximize,
  updatePosition,
} = useWindowPositionManager(props.initialPosition, (position) => {
  emit("position-change", position);
});

/*
 * Methods
 */

function handleClose() {
  if (!props.hasImage) {
    emit("close", props.windowId);
    return;
  }

  showCloseModal.value = true;
}

function handleConfirmClose() {
  emit("close", props.windowId);
  showCloseModal.value = false;
}

function handleMinimize() {
  emit("minimize", props.windowId);
}

function handleFocus() {
  emit("bring-to-front", props.windowId);
}

/*
 * Watchers
 */

watch(
  () => props.initialPosition,
  (newPosition) => {
    updatePosition(newPosition);
  },
  { deep: true }
);

/*
 * Lifecycle Hooks
 */

onMounted(() => {
  const isFirstWindow =
    props.initialPosition.x === 100 && props.initialPosition.y === 100;

  if (isFirstWindow) {
    const centeredPosition = {
      ...props.initialPosition,
      x: (window.innerWidth - props.initialPosition.width) / 2,
      y: (window.innerHeight - props.initialPosition.height) / 2,
    };

    updatePosition(centeredPosition);
    emit("position-change", centeredPosition);
  }
});
</script>

<template>
  <div
    ref="windowRef"
    class="window"
    :class="{
      'window--animating-minimize': isAnimatingMinimize,
      'window--animating-restore': isAnimatingRestore,
    }"
    :style="{
      left: windowState.x + 'px',
      top: windowState.y + 'px',
      width: windowState.width + 'px',
      height: windowState.height + 'px',
      zIndex: zIndex,
    }"
    @mousedown="handleMouseDown"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="handleFocus"
  >
    <!-- Resize handles -->
    <div
      class="resize-handle resize-handle--top"
      @mousedown="startResize($event, 'top')"
    />

    <div
      class="resize-handle resize-handle--bottom"
      @mousedown="startResize($event, 'bottom')"
    />

    <div
      class="resize-handle resize-handle--left"
      @mousedown="startResize($event, 'left')"
    />

    <div
      class="resize-handle resize-handle--right"
      @mousedown="startResize($event, 'right')"
    />

    <div
      class="resize-handle resize-handle--top-left"
      @mousedown="startResize($event, 'top-left')"
    />

    <div
      class="resize-handle resize-handle--top-right"
      @mousedown="startResize($event, 'top-right')"
    />

    <div
      class="resize-handle resize-handle--bottom-left"
      @mousedown="startResize($event, 'bottom-left')"
    />

    <div
      class="resize-handle resize-handle--bottom-right"
      @mousedown="startResize($event, 'bottom-right')"
    />

    <div class="window__header">
      <div class="window__buttons">
        <span class="window__button window__button--close" @click="handleClose">
          <Icon name="close" v-if="hovered" />
        </span>
        <span
          class="window__button window__button--minimize"
          @click="handleMinimize"
        >
          <Icon name="minimize" v-if="hovered" />
        </span>
        <span
          class="window__button window__button--maximize"
          @click="handleMaximize"
        >
          <Icon name="maximize" v-if="hovered" />
        </span>
      </div>

      <div class="window__title">
        {{ fileName || "Quick Img Tweakr" }}
      </div>
    </div>

    <div class="window__content">
      <slot />
    </div>

    <!-- Close Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showCloseModal"
          class="close-modal-backdrop"
          @click="showCloseModal = false"
        >
          <div class="close-modal-dialog" @click.stop>
            <div class="close-modal-body">
              <h3>Fechar janela</h3>
              <p>
                Tem certeza que deseja fechar esta janela? Qualquer progresso
                não salvo será perdido.
              </p>
            </div>
            <div class="close-modal-footer">
              <button
                class="close-modal-btn close-modal-btn--cancel"
                @click="showCloseModal = false"
              >
                Cancelar
              </button>
              <button
                class="close-modal-btn close-modal-btn--confirm"
                @click="handleConfirmClose"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.window {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: fixed;
  transition: transform 0.2s ease;

  &--animating-minimize {
    animation: genieMinimize 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  &--animating-restore {
    animation: genieRestore 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  &__header {
    height: 32px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    border-bottom: 1px solid #ddd;
    cursor: move;
    user-select: none;
    position: relative;
  }

  &__buttons {
    display: flex;
    gap: 8px;
    position: relative;

    &:hover {
      .window__button svg {
        opacity: 1;
      }
    }
  }

  &__button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: filter 0.2s;

    svg {
      opacity: 0;
      width: 10px;
      height: 10px;
      transition: opacity 0.2s;
      pointer-events: none;
    }

    &--close {
      background-color: #ff605c;

      &:hover {
        filter: brightness(0.9);
      }
    }

    &--minimize {
      background-color: #ffbd44;

      &:hover {
        filter: brightness(0.9);
      }
    }

    &--maximize {
      background-color: #00ca4e;

      &:hover {
        filter: brightness(0.9);
      }
    }
  }

  &__title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 13px;
    font-weight: 500;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
    pointer-events: none;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 16px;
  }
}

// Resize handles
.resize-handle {
  position: absolute;
  z-index: 10;

  &--top {
    top: 0;
    left: 8px;
    right: 8px;
    height: 4px;
    cursor: n-resize;
  }

  &--bottom {
    bottom: 0;
    left: 8px;
    right: 8px;
    height: 4px;
    cursor: s-resize;
  }

  &--left {
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 4px;
    cursor: w-resize;
  }

  &--right {
    right: 0;
    top: 8px;
    bottom: 8px;
    width: 4px;
    cursor: e-resize;
  }

  &--top-left {
    top: 0;
    left: 0;
    width: 8px;
    height: 8px;
    cursor: nw-resize;
  }

  &--top-right {
    top: 0;
    right: 0;
    width: 8px;
    height: 8px;
    cursor: ne-resize;
  }

  &--bottom-left {
    bottom: 0;
    left: 0;
    width: 8px;
    height: 8px;
    cursor: sw-resize;
  }

  &--bottom-right {
    bottom: 0;
    right: 0;
    width: 8px;
    height: 8px;
    cursor: se-resize;
  }
}

// Genie animations
@keyframes genieMinimize {
  0% {
    transform: scale(1) perspective(1000px) rotateY(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(0.8) perspective(1000px) rotateY(-5deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.1) perspective(1000px) rotateY(-15deg) translateY(50vh)
      translateX(-40vw);
    opacity: 0;
  }
}

@keyframes genieRestore {
  0% {
    transform: scale(0.1) perspective(1000px) rotateY(-15deg) translateY(50vh)
      translateX(-40vw);
    opacity: 0;
  }
  50% {
    transform: scale(0.8) perspective(1000px) rotateY(-5deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) perspective(1000px) rotateY(0deg);
    opacity: 1;
  }
}

// Close modal styles
.close-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.close-modal-dialog {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  width: 400px;
  max-width: 90vw;
  overflow: hidden;
}

.close-modal-body {
  padding: 24px;
  text-align: center;

  h3 {
    margin: 0 0 16px;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
    line-height: 1.5;
  }
}

.close-modal-footer {
  padding: 16px 24px 24px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.close-modal-btn {
  padding: 8px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &--cancel {
    background: #f0f0f0;
    color: #333;

    &:hover {
      background: #e0e0e0;
    }
  }

  &--confirm {
    background: #ff605c;
    color: white;

    &:hover {
      background: #ff4a45;
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .close-modal-dialog,
.modal-leave-to .close-modal-dialog {
  transform: scale(0.9) translateY(-20px);
}
</style>
