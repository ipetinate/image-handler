<script lang="ts" setup>
import { computed } from "vue";

type IconName =
  | "drop"
  | "upload"
  | "rotate-left"
  | "rotate-right"
  | "grid"
  | "download"
  | "trash"
  | "flip-vertical"
  | "flip-horizontal";

type Props = {
  name: IconName;
};

const props = defineProps<Props>();

/**
 * Icons from https://heroicons.com
 */
const paths = {
  drop: "M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3",
  upload:
    "M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25",
  "rotate-left": "M7.49 12 3.74 8.248m0 0 3.75-3.75m-3.75 3.75h16.5V19.5",
  "rotate-right": "m16.49 12 3.75-3.751m0 0-3.75-3.75m3.75 3.75H3.74V19.5",
  grid: "M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z",
  download:
    "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3",
  trash: "M6 18 18 6M6 6l12 12",
  "flip-vertical":
    "M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5",
  "flip-horizontal":
    "M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
} as const;

const path = computed(() => paths[props.name]);
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#333"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    width="24"
    height="24"
  >
    <path :d="path" />
  </svg>
</template>
