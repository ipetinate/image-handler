import { ref } from "vue";

/*
 * Custom Types
 */
export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

/*
 * Global State
 */
const toasts = ref<ToastItem[]>([]);

/*
 * Methods
 */
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function addToast(
  message: string,
  type: ToastItem["type"] = "success",
  duration = 5000
) {
  const id = generateId();
  const toast: ToastItem = {
    id,
    message,
    type,
    duration,
  };

  toasts.value.push(toast);
  return id;
}

function removeToast(id: string) {
  const index = toasts.value.findIndex((toast) => toast.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
}

function showSuccess(message: string, duration = 5000) {
  return addToast(message, "success", duration);
}

function showError(message: string, duration = 5000) {
  return addToast(message, "error", duration);
}

function showInfo(message: string, duration = 5000) {
  return addToast(message, "info", duration);
}

function clearAllToasts() {
  toasts.value = [];
}

/*
 * Hook Export
 */
export function useToast() {
  return {
    toasts: toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    clearAllToasts,
  };
}
