import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { User } from "../lib/supabase";

/**
 * Store para gerenciar estado de autenticação do usuário
 */
export const useAuthStore = defineStore("auth", () => {
  /*
   * State
   */
  const user = ref<User | null>(null);
  const loading = ref(false);
  const initialized = ref(false);

  /*
   * Getters
   */
  const isAuthenticated = computed(() => !!user.value);
  const userEmail = computed(() => user.value?.email || "");
  const userName = computed(
    () => user.value?.user_metadata?.full_name || user.value?.email || ""
  );
  const userAvatar = computed(
    () => user.value?.user_metadata?.avatar_url || ""
  );

  /*
   * Actions
   */
  function setUser(newUser: User | null) {
    user.value = newUser;
  }

  function setLoading(state: boolean) {
    loading.value = state;
  }

  function setInitialized(state: boolean) {
    initialized.value = state;
  }

  function clearUser() {
    user.value = null;
  }

  function updateUser(userData: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...userData };
    }
  }

  return {
    // State
    user,
    loading,
    initialized,

    // Getters
    isAuthenticated,
    userEmail,
    userName,
    userAvatar,

    // Actions
    setUser,
    setLoading,
    setInitialized,
    clearUser,
    updateUser,
  };
});
