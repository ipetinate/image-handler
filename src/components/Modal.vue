<script lang="ts" setup>
import { ref, watch, nextTick } from "vue";

/*
 * Custom Types
 */

interface Props {
  show: boolean;
  title: string;
  fileName: string;
}

interface Emits {
  (e: "close"): void;
  (e: "confirm", fileName: string): void;
}

/*
 * Vue Definitions
 */

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

/*
 * Refs & Reactives
 */

const inputRef = ref<HTMLInputElement>();
const editableFileName = ref("");

/*
 * Methods
 */

function handleCancel() {
  emit("close");
}

function handleConfirm() {
  emit("confirm", editableFileName.value);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    handleConfirm();
  } else if (event.key === "Escape") {
    handleCancel();
  }
}

/*
 * Watchers
 */

watch(
  () => props.fileName,
  (newName) => {
    editableFileName.value = newName;
  },
  { immediate: true }
);

watch(
  () => props.show,
  async (show) => {
    if (show) {
      await nextTick();
      inputRef.value?.focus();
      inputRef.value?.select();
    }
  }
);
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-backdrop" @click="handleCancel">
        <div class="modal-dialog" @click.stop>
          <div class="modal-body">
            <div class="form-row">
              <label class="form-label">Save as:</label>
              <input
                ref="inputRef"
                v-model="editableFileName"
                type="text"
                class="form-input"
                @keydown="handleKeydown"
              />
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-cancel" @click="handleCancel">Cancel</button>
            <button class="btn btn-save" @click="handleConfirm">Save</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 40px;
  z-index: 1000;
  border-radius: 12px;
}

.modal-dialog {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  width: 400px;
  border: 1px solid #ddd;
  overflow: hidden;
}

.modal-body {
  padding: 20px 20px 16px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-label {
  font-size: 13px;
  font-weight: 400;
  color: #333333;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.form-input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #b8b8b8;
  border-radius: 4px;
  font-size: 13px;
  color: #333333;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.form-input:focus {
  outline: none;
  border-color: #4a9eff;
  box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.3);
}

.modal-footer {
  padding: 12px 20px 20px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 400;
  border: 1px solid #b8b8b8;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  min-width: 70px;
}

.btn-cancel {
  background: #ffffff;
  color: #333333;
}

.btn-cancel:hover {
  background: #f0f0f0;
}

.btn-save {
  background: #4a9eff;
  color: #ffffff;
  border-color: #4a9eff;
}

.btn-save:hover {
  background: #3a8eef;
  border-color: #3a8eef;
}

.modal-enter-active {
  transition: all 0.2s ease-out;
}

.modal-leave-active {
  transition: all 0.15s ease-in;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-dialog {
  transform: translateY(-20px);
  opacity: 0;
}

.modal-leave-to .modal-dialog {
  transform: translateY(-10px);
  opacity: 0;
}

@media (prefers-color-scheme: dark) {
  .modal-dialog {
    background: #2d2d2d;
    border-color: #555555;
  }

  .form-label {
    color: #e0e0e0;
  }

  .form-input {
    background: #3d3d3d;
    border-color: #666666;
    color: #e0e0e0;
  }

  .form-input:focus {
    border-color: #4a9eff;
  }

  .btn {
    border-color: #666666;
  }

  .btn-cancel {
    background: #3d3d3d;
    color: #e0e0e0;
  }

  .btn-cancel:hover {
    background: #4d4d4d;
  }
}
</style>
