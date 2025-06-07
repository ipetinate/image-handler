import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  const lastVisitedRoute = ref<string>(
    localStorage.getItem("settings-last-route") || "profile"
  );
  const isSettingsWindowOpen = ref(false);

  function setLastVisitedRoute(routeName: string) {
    lastVisitedRoute.value = routeName;
    localStorage.setItem("settings-last-route", routeName);
  }

  function openSettingsWindow() {
    isSettingsWindowOpen.value = true;
  }

  function closeSettingsWindow() {
    isSettingsWindowOpen.value = false;
  }

  return {
    lastVisitedRoute,
    isSettingsWindowOpen,
    setLastVisitedRoute,
    openSettingsWindow,
    closeSettingsWindow,
  };
});
