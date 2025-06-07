import { ref, computed, onMounted } from "vue";
import { supabase, type User } from "../lib/supabase";
import { useAuthStore } from "../stores/useAuthStore";

/**
 * Hook para gerenciar autenticação com Supabase
 */
export function useAuth() {
  const authStore = useAuthStore();
  const error = ref<string | null>(null);

  /*
   * Computed
   */
  const hasAuth = computed(() => authStore.isAuthenticated);
  const user = computed(() => authStore.user);
  const loading = computed(() => authStore.loading);

  /*
   * Methods
   */
  async function signIn(email: string, password: string) {
    try {
      error.value = null;
      authStore.setLoading(true);

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        error.value = signInError.message;
        return { success: false, error: signInError.message };
      }

      if (data.user) {
        authStore.setUser(data.user as User);
      }

      return { success: true, user: data.user };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao fazer login";
      error.value = message;
      return { success: false, error: message };
    } finally {
      authStore.setLoading(false);
    }
  }

  async function signUp(email: string, password: string, fullName?: string) {
    try {
      error.value = null;
      authStore.setLoading(true);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        error.value = signUpError.message;
        return { success: false, error: signUpError.message };
      }

      return { success: true, user: data.user };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar conta";
      error.value = message;
      return { success: false, error: message };
    } finally {
      authStore.setLoading(false);
    }
  }

  async function signOut() {
    try {
      error.value = null;
      authStore.setLoading(true);

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        error.value = signOutError.message;
        return { success: false, error: signOutError.message };
      }

      authStore.clearUser();
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao fazer logout";
      error.value = message;
      return { success: false, error: message };
    } finally {
      authStore.setLoading(false);
    }
  }

  async function resetPassword(email: string) {
    try {
      error.value = null;
      authStore.setLoading(true);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email
      );

      if (resetError) {
        error.value = resetError.message;
        return { success: false, error: resetError.message };
      }

      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao recuperar senha";
      error.value = message;
      return { success: false, error: message };
    } finally {
      authStore.setLoading(false);
    }
  }

  async function updateProfile(updates: {
    full_name?: string;
    avatar_url?: string;
  }) {
    try {
      error.value = null;
      authStore.setLoading(true);

      const { data, error: updateError } = await supabase.auth.updateUser({
        data: updates,
      });

      if (updateError) {
        error.value = updateError.message;
        return { success: false, error: updateError.message };
      }

      if (data.user) {
        authStore.setUser(data.user as User);
      }

      return { success: true, user: data.user };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar perfil";
      error.value = message;
      return { success: false, error: message };
    } finally {
      authStore.setLoading(false);
    }
  }

  async function initializeAuth() {
    try {
      authStore.setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        authStore.setUser(session.user as User);
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          authStore.setUser(session.user as User);
        } else {
          authStore.clearUser();
        }
      });

      authStore.setInitialized(true);
    } catch (err) {
      console.error("Error initializing auth:", err);
    } finally {
      authStore.setLoading(false);
    }
  }

  /*
   * Lifecycle
   */
  onMounted(() => {
    if (!authStore.initialized) {
      initializeAuth();
    }
  });

  return {
    // State
    hasAuth,
    user,
    loading,
    error,

    // Methods
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    initializeAuth,
  };
}
