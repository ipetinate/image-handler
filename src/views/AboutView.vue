<script lang="ts" setup>
import { ref } from "vue";

import appLogo from "../assets/quick-img-tweakr.svg";

/*
 * Refs
 */
const appVersion = ref("1.0.0");
const buildDate = ref(new Date().toLocaleDateString("pt-BR"));
</script>

<template>
  <div class="about-view">
    <div class="about-view__header">
      <h2>Sobre</h2>
      <p>Informações sobre o Quick Img Tweakr</p>
    </div>

    <div class="about-view__content">
      <div class="about-view__app-info">
        <div class="about-view__logo">
          <div class="about-view__logo-circle">
            <img :src="appLogo" alt="Quick Img Tweakr Logo" />
          </div>
        </div>

        <div class="about-view__details">
          <h3>Quick Img Tweakr</h3>
          <p class="about-view__description">
            Uma ferramenta simples e poderosa para edição rápida de imagens.
            Faça rotações, espelhamentos e ajustes básicos em suas imagens de
            forma intuitiva e eficiente.
          </p>

          <div class="about-view__version-info">
            <div class="about-view__version-item">
              <span class="about-view__label">Versão:</span>
              <span class="about-view__value">{{ appVersion }}</span>
            </div>
            <div class="about-view__version-item">
              <span class="about-view__label">Build:</span>
              <span class="about-view__value">{{ buildDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="about-view__features">
        <h4>Recursos</h4>
        <div class="about-view__feature-grid">
          <div class="about-view__feature">
            <div class="about-view__feature-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"
                />
              </svg>
            </div>
            <div>
              <h5>Rotação</h5>
              <p>Gire suas imagens em 90° para esquerda ou direita</p>
            </div>
          </div>

          <div class="about-view__feature">
            <div class="about-view__feature-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z"
                />
              </svg>
            </div>
            <div>
              <h5>Espelhamento</h5>
              <p>Espelhe horizontalmente ou verticalmente</p>
            </div>
          </div>

          <div class="about-view__feature">
            <div class="about-view__feature-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3,3V21H21V3H3M19,19H5V5H14V12L16.5,9.5L19,12V5V19Z" />
              </svg>
            </div>
            <div>
              <h5>Múltiplas Janelas</h5>
              <p>Trabalhe com várias imagens simultaneamente</p>
            </div>
          </div>

          <div class="about-view__feature">
            <div class="about-view__feature-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
                />
              </svg>
            </div>
            <div>
              <h5>Exportação</h5>
              <p>Salve suas edições em alta qualidade</p>
            </div>
          </div>
        </div>
      </div>

      <div class="about-view__tech">
        <h4>Tecnologias</h4>
        <div class="about-view__tech-list">
          <span class="about-view__tech-item">Vue 3</span>
          <span class="about-view__tech-item">TypeScript</span>
          <span class="about-view__tech-item">Vite</span>
          <span class="about-view__tech-item">Pinia</span>
          <span class="about-view__tech-item">SCSS</span>
          <span class="about-view__tech-item">Supabase</span>
        </div>
      </div>

      <div class="about-view__footer">
        <p>Desenvolvido com ❤️ para facilitar a edição rápida de imagens.</p>
        <p class="about-view__copyright">
          © {{ new Date().getFullYear() }} Quick Img Tweakr. Todos os direitos
          reservados.
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.about-view {
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
    max-width: 600px;
  }

  &__app-info {
    display: flex;
    gap: 20px;
    align-items: flex-start;
    background: #f8f9fa;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #e9ecef;
  }

  &__logo {
    flex-shrink: 0;
  }

  &__logo-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    padding: 16px;

    img {
      width: 64px;
      height: 64px;
      object-fit: contain;
    }
  }

  &__details {
    flex: 1;

    h3 {
      margin: 0 0 12px;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }
  }

  &__description {
    margin: 0 0 20px;
    color: #666;
    line-height: 1.6;
    font-size: 14px;
  }

  &__version-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__version-item {
    display: flex;
    gap: 8px;
  }

  &__label {
    font-weight: 500;
    color: #333;
    min-width: 60px;
  }

  &__value {
    color: #667eea;
    font-weight: 500;
  }

  &__features {
    h4 {
      margin: 0 0 20px;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }

  &__feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  &__feature {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 16px;
    background: rgba(102, 126, 234, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(102, 126, 234, 0.1);

    h5 {
      margin: 0 0 4px;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    p {
      margin: 0;
      font-size: 12px;
      color: #666;
      line-height: 1.4;
    }
  }

  &__feature-icon {
    color: #667eea;
    flex-shrink: 0;
    margin-top: 2px;
  }

  &__tech {
    h4 {
      margin: 0 0 16px;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }

  &__tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__tech-item {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
  }

  &__footer {
    text-align: center;
    padding: 24px 0;
    border-top: 1px solid #e9ecef;

    p {
      margin: 0 0 8px;
      color: #666;
      font-size: 14px;
    }
  }

  &__copyright {
    font-size: 12px;
    color: #999;
  }
}
</style>
