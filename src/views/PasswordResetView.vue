<script lang="ts" setup>
import { ref } from "vue";
import { useAuth } from "../hooks/useAuth";

/*
 * Hooks
 */
const { resetPassword, loading } = useAuth();

/*
 * Refs
 */
const email = ref("");
const success = ref(false);
const error = ref<string | null>(null);

/*
 * Methods
 */
async function handlePasswordReset() {
  if (!email.value.trim()) {
    error.value = "Email é obrigatório";
    return;
  }

  if (!isValidEmail(email.value)) {
    error.value = "Email inválido";
    return;
  }

  error.value = null;

  const result = await resetPassword(email.value.trim());

  if (result.success) {
    success.value = true;
    email.value = "";
  } else {
    error.value = result.error || "Erro ao enviar email de recuperação";
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function resetForm() {
  email.value = "";
  error.value = null;
  success.value = false;
}
</script>

<template>
  <div class="password-reset-view">
    <div class="password-reset-view__header">
      <h2>Recuperar Senha</h2>
      <p>Digite seu email para receber um link de recuperação</p>
    </div>

    <div class="password-reset-view__content">
      <div v-if="!success" class="password-reset-view__form">
        <div class="password-reset-view__field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Digite seu email"
            class="password-reset-view__input"
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="password-reset-view__error">
          {{ error }}
        </div>

        <div class="password-reset-view__actions">
          <button
            class="password-reset-view__btn password-reset-view__btn--secondary"
            @click="resetForm"
            :disabled="loading"
          >
            Limpar
          </button>
          <button
            class="password-reset-view__btn password-reset-view__btn--primary"
            @click="handlePasswordReset"
            :disabled="loading || !email.trim()"
          >
            {{ loading ? "Enviando..." : "Enviar Link" }}
          </button>
        </div>
      </div>

      <div v-else class="password-reset-view__success">
        <div class="password-reset-view__success-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"
            />
          </svg>
        </div>
        <h3>Email enviado!</h3>
        <p>
          Se o email estiver cadastrado em nossa base, você receberá um link
          para recuperação da senha em alguns minutos.
        </p>
        <p class="password-reset-view__help">
          Não se esqueça de verificar sua caixa de spam.
        </p>
        <button
          class="password-reset-view__btn password-reset-view__btn--primary"
          @click="resetForm"
        >
          Enviar Novamente
        </button>
      </div>

      <div class="password-reset-view__info">
        <div class="password-reset-view__info-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
            />
          </svg>
        </div>
        <div>
          <h4>Como funciona?</h4>
          <ul>
            <li>Digite o email da sua conta</li>
            <li>Clique em "Enviar Link"</li>
            <li>Verifique seu email e clique no link recebido</li>
            <li>Defina uma nova senha</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.password-reset-view {
  &__header {
    margin-bottom: 32px;

    h2 {
      margin: 0 0 8px;
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 32px;
    max-width: 500px;
  }

  &__form {
    background: #f8f9fa;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #e9ecef;
  }

  &__field {
    margin-bottom: 20px;

    label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
  }

  &__input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    color: #333;
    background: #fff;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #667eea;
    }

    &:disabled {
      background: #f5f5f5;
      color: #999;
      cursor: not-allowed;
    }

    &::placeholder {
      color: #999;
    }
  }

  &__error {
    background: rgba(255, 96, 92, 0.1);
    color: #ff605c;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 20px;
  }

  &__actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  &__btn {
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

      &:hover:not(:disabled) {
        opacity: 0.9;
      }
    }

    &--secondary {
      background: #f0f0f0;
      color: #333;
      border: 1px solid #ddd;

      &:hover:not(:disabled) {
        background: #e0e0e0;
      }
    }
  }

  &__success {
    background: #f8f9fa;
    padding: 32px 24px;
    border-radius: 12px;
    border: 1px solid #e9ecef;
    text-align: center;

    h3 {
      margin: 16px 0 12px;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }

    p {
      margin: 0 0 12px;
      color: #666;
      line-height: 1.5;
    }

    .password-reset-view__btn {
      margin-top: 24px;
    }
  }

  &__success-icon {
    color: #4caf50;
    margin-bottom: 8px;
  }

  &__help {
    font-size: 12px;
    color: #999;
    font-style: italic;
  }

  &__info {
    background: rgba(102, 126, 234, 0.05);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(102, 126, 234, 0.1);
    display: flex;
    gap: 16px;

    h4 {
      margin: 0 0 12px;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    ul {
      margin: 0;
      padding-left: 20px;
      color: #666;
      font-size: 14px;
      line-height: 1.6;

      li {
        margin-bottom: 4px;
      }
    }
  }

  &__info-icon {
    color: #667eea;
    flex-shrink: 0;
    margin-top: 2px;
  }
}
</style>
