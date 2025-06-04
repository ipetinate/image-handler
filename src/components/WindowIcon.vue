<script lang="ts" setup>
const props = defineProps<{
  name: "close" | "minimize" | "maximize";
  size?: number;
}>();

const size = props.size ?? 6;
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 6 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <template v-if="props.name === 'close'">
      <line
        x1="1"
        y1="1"
        x2="5"
        y2="5"
        stroke="black"
        stroke-width="0.8"
        stroke-linecap="round"
      />
      <line
        x1="5"
        y1="1"
        x2="1"
        y2="5"
        stroke="black"
        stroke-width="0.8"
        stroke-linecap="round"
      />
    </template>

    <template v-else-if="props.name === 'minimize'">
      <rect x="1" y="2.8" width="4" height="0.4" fill="black" />
    </template>

    <template v-else-if="props.name === 'maximize'">
      <polygon
        points="1,3 3,1 3.6,1.6 2.2,3"
        fill="none"
        stroke="black"
        stroke-width="0.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <polygon
        points="3,5 5,3 4.4,2.4 2.8,4"
        fill="none"
        stroke="black"
        stroke-width="0.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>
  </svg>
</template>
