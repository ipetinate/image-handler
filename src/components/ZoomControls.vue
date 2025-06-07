<script lang="ts" setup>
import { ref, computed, watch } from "vue";

import Icon from "./Icon.vue";

/*
 * Custom Types
 */
type Props = {
  imageScale: number;
  visible: boolean;
};

type Events = {
  (e: "zoom-increase"): void;
  (e: "zoom-decrease"): void;
  (e: "zoom-change", scale: number): void;
};

/*
 * Vue Definitions
 */
const emit = defineEmits<Events>();
const props = defineProps<Props>();

/*
 * Refs
 */
const zoomInput = ref<HTMLInputElement | null>(null);
const isEditing = ref(false);

/*
 * Computeds
 */
const zoomPercentage = computed(() => Math.round(props.imageScale * 100));
const displayValue = ref(zoomPercentage.value.toString());

/*
 * Watchers
 */
watch(zoomPercentage, (newVal) => {
  if (!isEditing.value) {
    displayValue.value = newVal.toString();
  }
});

/*
 * Methods
 */
function handleZoomIncrease() {
  emit("zoom-increase");
}

function handleZoomDecrease() {
  emit("zoom-decrease");
}

function handleInputFocus() {
  isEditing.value = true;
}

function handleInputBlur() {
  isEditing.value = false;
  applyZoomChange();
}

function handleInputKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    zoomInput.value?.blur();
  } else if (e.key === "Escape") {
    displayValue.value = zoomPercentage.value.toString();
    zoomInput.value?.blur();
  }
}

function applyZoomChange() {
  const numValue = parseInt(displayValue.value);
  if (!isNaN(numValue) && numValue > 0) {
    const scale = numValue / 100;
    emit("zoom-change", scale);
  } else {
    displayValue.value = zoomPercentage.value.toString();
  }
}
</script>

<template>
  <div v-if="visible" class="zoom-controls">
    <button class="zoom-controls__button" @click="handleZoomDecrease">
      <Icon name="zoom-minus" />
    </button>

    <div class="zoom-controls__input-wrapper">
      <div class="zoom-controls__input-icon">
        <Icon name="percentage" />
      </div>
      <input
        ref="zoomInput"
        v-model="displayValue"
        type="text"
        class="zoom-controls__input"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
        @keydown="handleInputKeydown"
      />
    </div>

    <button class="zoom-controls__button" @click="handleZoomIncrease">
      <Icon name="zoom-plus" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.zoom-controls {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 24px;
  padding: 8px 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 10;

  &__button {
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    svg {
      width: 16px;
      height: 16px;
      stroke: white;
    }
  }

  &__input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__input-icon {
    position: absolute;
    left: 8px;
    z-index: 1;
    pointer-events: none;

    svg {
      width: 14px;
      height: 14px;
      stroke: rgba(255, 255, 255, 0.7);
    }
  }

  &__input {
    width: 70px;
    height: 32px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    color: white;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    padding: 0 8px 0 28px;
    outline: none;
    transition: all 0.2s;

    &:focus {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.4);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
}
</style>
