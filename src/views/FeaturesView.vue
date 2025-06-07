<script lang="ts" setup>
/*
 * Custom Types
 */
interface Feature {
  icon: string;
  title: string;
  description: string;
  usage: string;
}

/*
 * Data
 */
const features: Feature[] = [
  {
    icon: "M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z",
    title: "Janelas Múltiplas",
    description:
      "Trabalhe com várias imagens simultaneamente em janelas independentes.",
    usage:
      "Clique no botão '+' no dock ou use Cmd+N para criar nova janela. Arraste para mover, redimensione pelas bordas e use os controles da janela para minimizar/fechar.",
  },
  {
    icon: "M19 3H5C3.9 3 3 3.9 3 5V19C3.9 19 5 19 5 19H19C19 19 21 19 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM13.96 12.29L11.21 15.83L9.25 13.47L6.5 17H17.5L13.96 12.29Z",
    title: "Suporte a Imagens",
    description:
      "Abra e visualize imagens nos formatos mais populares (JPG, PNG, GIF, WebP).",
    usage:
      "Arraste uma imagem diretamente para a janela ou clique na área central para selecionar um arquivo. A imagem será exibida automaticamente com zoom ajustado.",
  },
  {
    icon: "M12 9C13.1 9 14 8.1 14 7S13.1 5 12 5 10 5.9 10 7 10.9 9 12 9ZM12 11C9.8 11 8 12.8 8 15S9.8 19 12 19 16 17.2 16 15 14.2 11 12 11Z M7.8 2H16.2L22 7.8V16.2L16.2 22H7.8L2 16.2V7.8L7.8 2Z",
    title: "Transformações de Imagem",
    description: "Rotacione e espelhe suas imagens com controles intuitivos.",
    usage:
      "Use a barra de ferramentas: setas para rotacionar (90° esquerda/direita), ícones de espelho para inverter horizontal ou verticalmente. Use o botão de reset para desfazer todas as transformações. Todas as transformações são não-destrutivas.",
  },
  {
    icon: "M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6ZM20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H8V4H20V16ZM12 14.5V9.5L16 12L12 14.5Z",
    title: "Grade de Referência",
    description:
      "Ative uma grade sobreposta para alinhar elementos e medir proporções.",
    usage:
      "Clique no ícone de grade na barra de ferramentas para ativar/desativar. A grade aparece como linhas sutis sobre a imagem, útil para composição e alinhamento.",
  },
  {
    icon: "M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM17 13V19H7L9 16L11 19L13 17L17 13Z",
    title: "Download de Imagens",
    description: "Salve suas imagens editadas com as transformações aplicadas.",
    usage:
      "Clique no ícone de download na barra de ferramentas. Digite o nome do arquivo desejado e confirme. A imagem será salva com todas as edições aplicadas.",
  },
  {
    icon: "M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z",
    title: "Limpeza de Janela",
    description:
      "Remove a imagem atual da janela mantendo a janela aberta para nova imagem.",
    usage:
      "Clique no ícone 'X' na barra de ferramentas para remover apenas a imagem. A janela permanece aberta e pronta para receber uma nova imagem.",
  },
];
</script>

<template>
  <div class="features-view">
    <div class="features-view__header">
      <h1 class="features-view__title">Recursos do Quick Img Tweakr</h1>
      <p class="features-view__subtitle">
        Descubra todas as funcionalidades disponíveis para edição e
        gerenciamento de imagens
      </p>
    </div>

    <div class="features-view__grid">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="feature-card"
      >
        <div class="feature-card__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path :d="feature.icon" />
          </svg>
        </div>
        <div class="feature-card__content">
          <h3 class="feature-card__title">{{ feature.title }}</h3>
          <p class="feature-card__description">{{ feature.description }}</p>
          <div class="feature-card__usage">
            <strong>Como usar:</strong> {{ feature.usage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.features-view {
  max-width: 800px;
  margin: 0 auto;

  &__header {
    text-align: center;
    margin-bottom: 40px;
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin: 0 0 12px;
  }

  &__subtitle {
    font-size: 16px;
    color: #666;
    margin: 0;
    line-height: 1.5;
  }

  &__grid {
    display: grid;
    gap: 24px;
  }
}

.feature-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f3f4;
    border-color: #667eea;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  }

  &__icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 16px;
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 8px;
  }

  &__description {
    font-size: 14px;
    color: #666;
    margin: 0 0 12px;
    line-height: 1.5;
  }

  &__usage {
    font-size: 13px;
    color: #555;
    line-height: 1.4;
    background: rgba(102, 126, 234, 0.05);
    padding: 12px;
    border-radius: 6px;
    border-left: 3px solid #667eea;

    strong {
      color: #667eea;
    }
  }
}

@media (max-width: 768px) {
  .features-view {
    &__title {
      font-size: 24px;
    }

    &__subtitle {
      font-size: 14px;
    }
  }

  .feature-card {
    padding: 20px;

    &__title {
      font-size: 16px;
    }

    &__description {
      font-size: 13px;
    }

    &__usage {
      font-size: 12px;
    }
  }
}
</style>
