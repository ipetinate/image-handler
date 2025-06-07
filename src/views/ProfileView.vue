<script lang="ts" setup>
import { ref } from "vue";
import { useAuth } from "../hooks/useAuth";

/*
 * Hooks
 */
const { user, updateProfile, loading } = useAuth();

/*
 * Refs
 */
const fullName = ref(user.value?.user_metadata?.full_name || "");
const isEditing = ref(false);
const saveError = ref<string | null>(null);
const saveSuccess = ref(false);

/*
 * Methods
 */
function startEditing() {
  isEditing.value = true;
  fullName.value = user.value?.user_metadata?.full_name || "";
}

function cancelEditing() {
  isEditing.value = false;
  fullName.value = user.value?.user_metadata?.full_name || "";
  saveError.value = null;
}

async function saveProfile() {
  if (!fullName.value.trim()) {
    saveError.value = "Nome é obrigatório";
    return;
  }

  const result = await updateProfile({ full_name: fullName.value.trim() });

  if (result.success) {
    isEditing.value = false;
    saveSuccess.value = true;
    saveError.value = null;

    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
  } else {
    saveError.value = result.error || "Erro ao salvar perfil";
  }
}
</script>

<template>
  <div class="profile-view">
    <div class="profile-view__header">
      <h2>Perfil</h2>
      <p>Gerencie suas informações pessoais</p>
    </div>

    <div class="profile-view__content">
      <div class="profile-view__avatar">
        <div class="profile-view__avatar-circle">
          {{
            user?.user_metadata?.full_name?.[0]?.toUpperCase() ||
            user?.email?.[0]?.toUpperCase() ||
            "?"
          }}
        </div>
      </div>

      <div class="profile-view__form">
        <div class="profile-view__field">
          <label>Email</label>
          <input
            type="email"
            :value="user?.email || ''"
            disabled
            class="profile-view__input profile-view__input--disabled"
          />
          <span class="profile-view__help">O email não pode ser alterado</span>
        </div>

        <div class="profile-view__field">
          <label>Nome completo</label>
          <div v-if="!isEditing" class="profile-view__display">
            <span>{{ user?.user_metadata?.full_name || "Não informado" }}</span>
            <button class="profile-view__edit-btn" @click="startEditing">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                />
              </svg>
            </button>
          </div>
          <div v-else class="profile-view__edit">
            <input
              v-model="fullName"
              type="text"
              class="profile-view__input"
              placeholder="Digite seu nome completo"
            />
            <div class="profile-view__edit-actions">
              <button
                class="profile-view__btn profile-view__btn--cancel"
                @click="cancelEditing"
                :disabled="loading"
              >
                Cancelar
              </button>
              <button
                class="profile-view__btn profile-view__btn--save"
                @click="saveProfile"
                :disabled="loading || !fullName.trim()"
              >
                {{ loading ? "Salvando..." : "Salvar" }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="saveError" class="profile-view__error">
          {{ saveError }}
        </div>

        <div v-if="saveSuccess" class="profile-view__success">
          Perfil atualizado com sucesso!
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-view {
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
  }

  &__avatar {
    display: flex;
    justify-content: center;
  }

  &__avatar-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 32px;
    font-weight: 600;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }

  &__form {
    max-width: 400px;
  }

  &__field {
    margin-bottom: 24px;

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

    &:not(:disabled):focus {
      outline: none;
      border-color: #667eea;
    }

    &--disabled {
      background: #f5f5f5;
      color: #999;
      cursor: not-allowed;
    }

    &::placeholder {
      color: #999;
    }
  }

  &__help {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: #666;
  }

  &__display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #f8f8f8;
    border-radius: 8px;
    min-height: 48px;

    span {
      color: #333;
      font-size: 14px;
    }
  }

  &__edit-btn {
    background: none;
    border: none;
    color: #667eea;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
    }
  }

  &__edit {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__edit-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  &__btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--cancel {
      background: #f0f0f0;
      border: 1px solid #ddd;
      color: #333;

      &:hover:not(:disabled) {
        background: #e0e0e0;
      }
    }

    &--save {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;

      &:hover:not(:disabled) {
        opacity: 0.9;
      }
    }
  }

  &__error {
    background: rgba(255, 96, 92, 0.1);
    color: #ff605c;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    margin-top: 16px;
  }

  &__success {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    margin-top: 16px;
  }
}
</style>
