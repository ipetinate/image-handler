<script lang="ts" setup>
import { ref, onMounted } from "vue";

/*
 * Custom Types
 */
type Props = {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
};

interface Emits {
  (e: "close"): void;
}

/*
 * Vue Definitions
 */
const props = withDefaults(defineProps<Props>(), {
  type: "success",
  duration: 5000,
});
const emit = defineEmits<Emits>();

/*
 * Refs
 */
const visible = ref(false);

/*
 * Methods
 */
function close() {
  visible.value = false;
  setTimeout(() => {
    emit("close");
  }, 300);
}

/*
 * Lifecycle
 */
onMounted(() => {
  visible.value = true;

  if (props.duration > 0) {
    setTimeout(() => {
      close();
    }, props.duration);
  }
});
</script>

<template>
  <div class="toast" :class="[`toast--${type}`, { 'toast--visible': visible }]">
    <div class="toast__icon">
      <svg
        v-if="type === 'success'"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"
        />
      </svg>
      <svg
        v-else-if="type === 'error'"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"
        />
      </svg>
      <svg
        v-else
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
        />
      </svg>
    </div>

    <div class="toast__content">
      <p class="toast__message">{{ message }}</p>
    </div>

    <button class="toast__close" @click="close">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
        />
      </svg>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 400px;
  z-index: 9999;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease;

  &--visible {
    opacity: 1;
    transform: translateX(0);
  }

  &--success {
    border-left: 4px solid #4caf50;

    .toast__icon {
      color: #4caf50;
    }
  }

  &--error {
    border-left: 4px solid #ff605c;

    .toast__icon {
      color: #ff605c;
    }
  }

  &--info {
    border-left: 4px solid #667eea;

    .toast__icon {
      color: #667eea;
    }
  }

  &__icon {
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__message {
    margin: 0;
    font-size: 14px;
    color: #333;
    line-height: 1.4;
    word-wrap: break-word;
  }

  &__close {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
    flex-shrink: 0;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
      color: #333;
    }
  }
}

@media (max-width: 480px) {
  .toast {
    left: 20px;
    right: 20px;
    min-width: auto;
    max-width: none;
  }
}
</style>
