<script lang="ts" setup>
import Icon from "./Icon.vue";

type Props = {
  gridEnabled: boolean;
};

type Events = {
  (e: "flip-vertical"): void;
  (e: "flip-horizontal"): void;
  (e: "rotate-left"): void;
  (e: "rotate-right"): void;
  (e: "toggle-grid"): void;
  (e: "download"): void;
  (e: "remove"): void;
};

const emit = defineEmits<Events>();

defineProps<Props>();
</script>

<template>
  <div class="toolbar">
    <button @click="emit('flip-vertical')" title="Espelhar vertical">
      <Icon name="flip-vertical" />
    </button>

    <button @click="emit('flip-horizontal')" title="Espelhar horizontal">
      <Icon name="flip-horizontal" />
    </button>

    <button @click="emit('rotate-left')" title="Girar esquerda">
      <Icon name="rotate-left" />
    </button>

    <button @click="emit('rotate-right')" title="Girar direita">
      <Icon name="rotate-right" />
    </button>

    <button @click="emit('toggle-grid')" title="Mostrar grid">
      <Icon name="grid" />
    </button>

    <div class="spacer" />

    <button @click="emit('download')" title="Salvar imagem">
      <Icon name="download" />
    </button>
    <button @click="emit('remove')" title="Remover imagem">
      <Icon name="trash" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  .spacer {
    flex: 1;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    width: 32px;
    height: 32px;
    padding: 4px;
    border-radius: 6px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f0f0f0;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
