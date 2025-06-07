<script lang="ts" setup>
import { ref, computed } from "vue";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

/*
 * Custom Types
 */
interface Emits {
  (e: "open-settings"): void;
}

/*
 * Vue Definitions
 */
const emit = defineEmits<Emits>();

/*
 * Hooks
 */
const { hasAuth, user, signIn, signUp, signOut, loading, error } = useAuth();
const { showSuccess } = useToast();

/*
 * Refs
 */
const showDropdown = ref(false);
const showSignUp = ref(false);
const email = ref("");
const password = ref("");
const fullName = ref("");

/*
 * Computed
 */
const userName = computed(() => {
  if (!user.value) return "";
  return user.value.user_metadata?.full_name || user.value.email || "";
});

const userInitials = computed(() => {
  const name = userName.value;
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length >= 2 && parts[0]?.[0] && parts[1]?.[0]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name[0]?.toUpperCase() || "?";
});

/*
 * Methods
 */
function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function closeDropdown() {
  showDropdown.value = false;
  resetForm();
}

function resetForm() {
  email.value = "";
  password.value = "";
  fullName.value = "";
  showSignUp.value = false;
  error.value = null;
}

async function handleSignIn() {
  if (!email.value || !password.value) return;

  const result = await signIn(email.value, password.value);
  if (result.success) {
    closeDropdown();
  }
}

async function handleSignUp() {
  if (!email.value || !password.value) return;

  const result = await signUp(email.value, password.value, fullName.value);
  if (result.success) {
    showSuccess(
      "Conta criada com sucesso! Verifique seu email para confirmar e faça login.",
      7000
    );
    closeDropdown();
  }
}

async function handleSignOut() {
  await signOut();
  closeDropdown();
}

function openSettings() {
  closeDropdown();
  emit("open-settings");
}
</script>

<template>
  <div class="login-button">
    <button class="login-button__trigger" @click="toggleDropdown">
      <div v-if="hasAuth" class="login-button__user">
        <div class="login-button__avatar">
          {{ userInitials }}
        </div>
        <span class="login-button__name">{{ userName }}</span>
      </div>
      <div v-else class="login-button__content">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          />
        </svg>
        <span>Entrar</span>
      </div>
      <svg
        class="login-button__chevron"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M7 10L12 15L17 10H7Z" />
      </svg>
    </button>

    <div
      v-if="showDropdown"
      class="login-dropdown-backdrop"
      @click="closeDropdown"
    >
      <div class="login-dropdown" @click.stop>
        <!-- User authenticated -->
        <div v-if="hasAuth" class="login-dropdown__content">
          <div class="login-dropdown__user">
            <div class="login-dropdown__avatar">
              {{ userInitials }}
            </div>
            <div class="login-dropdown__info">
              <div class="login-dropdown__name">{{ userName }}</div>
              <div class="login-dropdown__email">{{ user?.email }}</div>
            </div>
          </div>

          <div class="login-dropdown__divider" />

          <button class="login-dropdown__item" @click="openSettings">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
              />
            </svg>
            Configurações
          </button>

          <button
            class="login-dropdown__item login-dropdown__item--danger"
            @click="handleSignOut"
            :disabled="loading"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
              />
            </svg>
            Sair
          </button>
        </div>

        <!-- User not authenticated -->
        <div v-else class="login-dropdown__content">
          <div class="login-dropdown__form">
            <h3>{{ showSignUp ? "Criar Conta" : "Entrar" }}</h3>

            <div v-if="error" class="login-dropdown__error">
              {{ error }}
            </div>

            <div v-if="showSignUp" class="login-dropdown__field">
              <input
                v-model="fullName"
                type="text"
                placeholder="Nome completo"
                class="login-dropdown__input"
              />
            </div>

            <div class="login-dropdown__field">
              <input
                v-model="email"
                type="email"
                placeholder="Email"
                class="login-dropdown__input"
              />
            </div>

            <div class="login-dropdown__field">
              <input
                v-model="password"
                type="password"
                placeholder="Senha"
                class="login-dropdown__input"
              />
            </div>

            <button
              v-if="showSignUp"
              class="login-dropdown__submit"
              @click="handleSignUp"
              :disabled="loading || !email || !password"
            >
              {{ loading ? "Criando..." : "Criar Conta" }}
            </button>

            <button
              v-else
              class="login-dropdown__submit"
              @click="handleSignIn"
              :disabled="loading || !email || !password"
            >
              {{ loading ? "Entrando..." : "Entrar" }}
            </button>

            <div class="login-dropdown__toggle">
              <button
                class="login-dropdown__link"
                @click="showSignUp = !showSignUp"
              >
                {{
                  showSignUp
                    ? "Já tem conta? Entre aqui"
                    : "Não tem conta? Crie uma"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-button {
  position: relative;

  &__trigger {
    height: 32px;
    padding: 0 12px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.9);

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }

    &:active {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 10px;
    font-weight: 600;
    flex-shrink: 0;
  }

  &__name {
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__chevron {
    opacity: 0.7;
    flex-shrink: 0;
  }
}

.login-dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

.login-dropdown {
  position: absolute;
  top: 60px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 280px;
  max-width: calc(100vw - 40px);
  animation: dropdownShow 0.2s ease;

  // Ensure dropdown stays within viewport
  @media (max-width: 480px) {
    right: 10px;
    left: 10px;
    min-width: auto;
  }

  &__content {
    padding: 16px;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
    font-weight: 600;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__email {
    font-size: 12px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__divider {
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
    margin: 12px 0;
  }

  &__item {
    width: 100%;
    padding: 10px 12px;
    background: none;
    border: none;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    transition: background-color 0.2s;
    text-align: left;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    &--danger {
      color: #ff605c;

      &:hover {
        background: rgba(255, 96, 92, 0.1);
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__form {
    h3 {
      margin: 0 0 16px;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      text-align: center;
    }
  }

  &__error {
    background: rgba(255, 96, 92, 0.1);
    color: #ff605c;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    margin-bottom: 12px;
  }

  &__field {
    margin-bottom: 12px;
  }

  &__input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.8);
    color: #333;
    transition: border-color 0.2s;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #667eea;
      background: rgba(255, 255, 255, 0.95);
    }

    &::placeholder {
      color: #999;
    }
  }

  &__submit {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
    margin-bottom: 12px;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__toggle {
    text-align: center;
  }

  &__link {
    background: none;
    border: none;
    color: #667eea;
    font-size: 12px;
    cursor: pointer;
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }
}

@keyframes dropdownShow {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
