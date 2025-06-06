<script lang="ts" setup>
import { computed } from "vue";

import closeIcon from "../assets/icons/close.svg";
import minimizeIcon from "../assets/icons/minimize.svg";
import maximizeIcon from "../assets/icons/maximize.svg";

/*
 * Custom Types
 */

interface Props {
  name: "close" | "minimize" | "maximize";
  size?: number;
}

/*
 * Vue Definitions
 */

const props = withDefaults(defineProps<Props>(), {
  size: 10,
});

/*
 * Computeds
 */

const iconSrc = computed(() => {
  switch (props.name) {
    case "close":
      return closeIcon;
    case "minimize":
      return minimizeIcon;
    case "maximize":
      return maximizeIcon;
    default:
      return closeIcon;
  }
});
</script>

<template>
  <img
    :src="iconSrc"
    :alt="props.name"
    :width="size"
    :height="size"
    class="window-icon"
  />
</template>

<style scoped>
.window-icon {
  display: block;
  pointer-events: none;
}
</style>
