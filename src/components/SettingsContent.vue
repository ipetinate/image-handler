<script lang="ts" setup>
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "../hooks/useAuth";
import { useSettingsStore } from "../stores/useSettingsStore";

import appLogo from "../assets/quick-img-tweakr.svg";

/*
 * Custom Types
 */
type SettingsRoute =
  | "profile"
  | "password-reset"
  | "features"
  | "instructions"
  | "about";

interface SettingsItem {
  id: SettingsRoute;
  label: string;
  icon: string;
  routeName: string;
}

/*
 * Hooks
 */
const { hasAuth, user, signOut } = useAuth();
const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();

/*
 * Data
 */
const settingsItems: SettingsItem[] = [
  {
    id: "profile",
    label: "Perfil",
    icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    routeName: "profile",
  },
  {
    id: "password-reset",
    label: "Recuperar Senha",
    icon: "M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10A2,2 0 0,1 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",
    routeName: "password-reset",
  },
  {
    id: "features",
    label: "Recursos",
    icon: "M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z",
    routeName: "features",
  },
  {
    id: "instructions",
    label: "Instruções",
    icon: "M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z",
    routeName: "instructions",
  },
  {
    id: "about",
    label: "Sobre",
    icon: "M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
    routeName: "about",
  },
];

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

const currentRoute = computed(() => {
  return route.name as string;
});

/*
 * Methods
 */
function navigate(routeName: string) {
  router.push({ name: routeName });
}

async function handleLogout() {
  await signOut();
}

/*
 * Watches
 */
watch(route, (newRoute) => {
  if (newRoute.name && typeof newRoute.name === "string") {
    settingsStore.setLastVisitedRoute(newRoute.name);
  }
});
</script>

<template>
  <div class="settings-content">
    <div class="settings-content__sidebar">
      <!-- User section -->
      <div v-if="hasAuth" class="settings-content__user">
        <div class="settings-content__user-avatar">
          {{ userInitials }}
        </div>
        <div class="settings-content__user-info">
          <div class="settings-content__user-name">{{ userName }}</div>
          <div class="settings-content__user-email">{{ user?.email }}</div>
        </div>
      </div>

      <div v-else class="settings-content__login-prompt">
        <div class="settings-content__login-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </div>
        <p>Faça login para acessar suas configurações</p>
      </div>

      <div class="settings-content__divider" />

      <!-- Navigation items -->
      <div class="settings-content__nav">
        <button
          v-for="item in settingsItems"
          :key="item.id"
          class="settings-content__nav-item"
          :class="{
            'settings-content__nav-item--active':
              currentRoute === item.routeName,
          }"
          @click="navigate(item.routeName)"
        >
          <img
            v-if="item.id === 'about'"
            :src="appLogo"
            alt="Quick Img Tweakr"
            class="settings-content__nav-logo"
          />
          <svg
            v-else
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path :d="item.icon" />
          </svg>
          {{ item.label }}
        </button>
      </div>

      <!-- Logout button -->
      <div v-if="hasAuth" class="settings-content__logout">
        <button class="settings-content__logout-btn" @click="handleLogout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
            />
          </svg>
          Sair
        </button>
      </div>
    </div>

    <div class="settings-content__main">
      <RouterView />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-content {
  display: flex;
  height: 100%;
  overflow: hidden;

  &__sidebar {
    width: 240px;
    background: #f8f9fa;
    border-right: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    padding: 20px 0;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 20px 16px;
  }

  &__user-avatar {
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
    flex-shrink: 0;
  }

  &__user-info {
    flex: 1;
    min-width: 0;
  }

  &__user-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__user-email {
    font-size: 12px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__login-prompt {
    padding: 0 20px 16px;
    text-align: center;

    p {
      margin: 8px 0 0;
      font-size: 12px;
      color: #666;
      line-height: 1.4;
    }
  }

  &__login-icon {
    color: #999;
    margin-bottom: 8px;
  }

  &__divider {
    height: 1px;
    background: #e9ecef;
    margin: 0 20px 16px;
  }

  &__nav {
    flex: 1;
    padding: 0 12px;
  }

  &__nav-item {
    width: 100%;
    padding: 10px 12px;
    background: none;
    border: none;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 13px;
    color: #333;
    transition: all 0.2s;
    margin-bottom: 4px;
    text-align: left;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }

    &--active {
      background: #667eea;
      color: white;

      &:hover {
        background: #667eea;
        color: white;
      }
    }
  }

  &__nav-logo {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &__logout {
    padding: 16px 12px 0;
    border-top: 1px solid #e9ecef;
    margin-top: auto;
  }

  &__logout-btn {
    width: 100%;
    padding: 10px 12px;
    background: none;
    border: none;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 13px;
    color: #ff605c;
    transition: all 0.2s;
    text-align: left;

    &:hover {
      background: rgba(255, 96, 92, 0.1);
    }
  }

  &__main {
    flex: 1;
    padding: 32px;
    overflow-y: auto;
    background: #fff;
  }
}
</style>
