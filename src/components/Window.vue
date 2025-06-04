<script lang="ts" setup>
import { ref } from "vue";
import Icon from "./WindowIcon.vue";

const hovered = ref(false);
</script>

<template>
  <div class="window">
    <div class="window__header">
      <div class="window__buttons">
        <span class="window__button window__button--close">
          <Icon name="close" v-if="hovered" />
        </span>
        <span class="window__button window__button--minimize">
          <Icon name="minimize" v-if="hovered" />
        </span>
        <span class="window__button window__button--maximize">
          <Icon name="maximize" v-if="hovered" />
        </span>
      </div>
    </div>

    <div class="window__content">
      <slot />
    </div>
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
  min-width: 800px;

  &__header {
    height: 32px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    padding: 0 12px;
    border-bottom: 1px solid #ddd;
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
    width: 16px;
    height: 16px;
    border-radius: 50%;
    position: relative;
    cursor: default;
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
    }

    &--minimize {
      background-color: #ffbd44;
    }

    &--maximize {
      background-color: #00ca4e;
    }
  }

  &__content {
    padding: 16px;
  }
}
</style>
