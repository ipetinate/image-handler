<script lang="ts" setup>
/*
 * Custom Types
 */
interface Step {
  number: number;
  title: string;
  description: string;
  tip?: string;
  toolbarIcon?: string;
}

interface Section {
  title: string;
  icon: string;
  steps: Step[];
}

/*
 * Data
 */
const toolbarIconPaths = {
  "rotate-left": "M7.49 12 3.74 8.248m0 0 3.75-3.75m-3.75 3.75h16.5V19.5",
  "rotate-right": "m16.49 12 3.75-3.751m0 0-3.75-3.75m3.75 3.75H3.74V19.5",
  "flip-vertical":
    "M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5",
  "flip-horizontal":
    "M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
  grid: "M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z",
  download:
    "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3",
  trash: "M6 18 18 6M6 6l12 12",
  reset: "M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3",
};

const sections: Section[] = [
  {
    title: "Primeiros Passos",
    icon: "M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z",
    steps: [
      {
        number: 1,
        title: "Abrir uma nova janela",
        description:
          "Clique no botão '+' no dock na parte inferior da tela. Uma nova janela será aberta automaticamente.",
        tip: "Você pode ter múltiplas janelas abertas ao mesmo tempo para trabalhar com várias imagens.",
      },
      {
        number: 2,
        title: "Carregar uma imagem",
        description:
          "Arraste uma imagem diretamente para a janela ou clique na área central para abrir o seletor de arquivos.",
        tip: "Formatos suportados: JPG, PNG, GIF, WebP, BMP e outros formatos comuns.",
      },
    ],
  },
  {
    title: "Gerenciamento de Janelas",
    icon: "M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6ZM20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z",
    steps: [
      {
        number: 1,
        title: "Mover janelas",
        description:
          "Clique e arraste na barra de título (área cinza superior) para mover a janela pela tela.",
        tip: "Duplo-clique na barra de título para maximizar/restaurar a janela.",
      },
      {
        number: 2,
        title: "Redimensionar janelas",
        description:
          "Arraste pelas bordas ou cantos da janela para redimensionar. O cursor mudará para indicar a direção do redimensionamento.",
        tip: "Use o botão verde (maximizar) para expandir a janela automaticamente.",
      },
      {
        number: 3,
        title: "Minimizar janelas",
        description:
          "Clique no botão amarelo para minimizar a janela. Ela aparecerá no dock com uma animação estilo genie.",
        tip: "Clique na janela minimizada no dock para restaurá-la.",
      },
      {
        number: 4,
        title: "Fechar janelas",
        description:
          "Clique no botão vermelho para fechar a janela. Se houver uma imagem, será solicitada confirmação.",
        tip: "Use Cmd+W como atalho para fechar a janela ativa.",
      },
    ],
  },
  {
    title: "Editando Imagens",
    icon: "M12 9C13.1 9 14 8.1 14 7S13.1 5 12 5 10 5.9 10 7 10.9 9 12 9ZM12 11C9.8 11 8 12.8 8 15S9.8 19 12 19 16 17.2 16 15 14.2 11 12 11Z",
    steps: [
      {
        number: 1,
        title: "Rotacionar imagem",
        description:
          "Use as setas na barra de ferramentas para rotacionar a imagem 90° para esquerda ou direita.",
        tip: "Todas as rotações são múltiplos de 90°. A rotação é aplicada instantaneamente.",
        toolbarIcon: "rotate-left",
      },
      {
        number: 2,
        title: "Espelhar imagem",
        description:
          "Use os ícones de espelho para inverter a imagem horizontalmente ou verticalmente.",
        tip: "Você pode combinar ambos os espelhamentos para obter diferentes orientações.",
        toolbarIcon: "flip-horizontal",
      },
      {
        number: 3,
        title: "Ativar grade",
        description:
          "Clique no ícone de grade para sobrepor linhas de referência sobre a imagem.",
        tip: "A grade é útil para alinhar elementos e avaliar proporções na composição. Use Cmd+G como atalho.",
        toolbarIcon: "grid",
      },
      {
        number: 4,
        title: "Reverter alterações",
        description:
          "Use o ícone de reset (seta circular) no painel direito da barra de ferramentas para desfazer todas as transformações aplicadas à imagem.",
        tip: "Apenas as transformações (rotação e espelhamento) são revertidas. A imagem permanece carregada na janela. Use Cmd+Shift+U como atalho.",
        toolbarIcon: "reset",
      },
      {
        number: 5,
        title: "Remover imagem",
        description:
          "Clique no ícone 'X' (lixeira) no painel direito da barra de ferramentas para remover a imagem atual da janela.",
        tip: "A janela permanece aberta e pronta para receber uma nova imagem. Use Cmd+Shift+D como atalho.",
        toolbarIcon: "trash",
      },
    ],
  },
  {
    title: "Salvando Trabalho",
    icon: "M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z",
    steps: [
      {
        number: 1,
        title: "Download da imagem",
        description:
          "Clique no ícone de download na barra de ferramentas para salvar a imagem editada.",
        tip: "Todas as transformações (rotação, espelhamento) serão aplicadas à imagem salva.",
        toolbarIcon: "download",
      },
      {
        number: 2,
        title: "Escolher nome do arquivo",
        description:
          "Digite o nome desejado para o arquivo na caixa de diálogo que aparece.",
        tip: "O formato original da imagem será mantido (JPG, PNG, etc.).",
      },
      {
        number: 3,
        title: "Confirmar download",
        description:
          "Clique em 'Salvar' para baixar o arquivo para sua pasta de Downloads.",
        tip: "O arquivo será salvo automaticamente na pasta padrão de downloads do navegador.",
      },
    ],
  },
  {
    title: "Usando o Dock",
    icon: "M12 2L3 7L12 12L21 7L12 2ZM3 17L12 22L21 17V10L12 15L3 10V17Z",
    steps: [
      {
        number: 1,
        title: "Navegação no dock",
        description:
          "Passe o mouse sobre o dock para ativar o efeito de magnificação dos ícones.",
        tip: "O dock mostra todas as janelas abertas com ícones coloridos únicos.",
      },
      {
        number: 2,
        title: "Restaurar janelas",
        description:
          "Clique em qualquer ícone de janela no dock para trazê-la para frente ou restaurá-la se estiver minimizada.",
        tip: "Janelas minimizadas têm uma aparência ligeiramente diferente no dock.",
      },
      {
        number: 3,
        title: "Criar nova janela",
        description:
          "Clique no ícone '+' no dock para abrir uma nova janela vazia.",
        tip: "Não há limite para o número de janelas que você pode ter abertas.",
      },
      {
        number: 4,
        title: "Acessar configurações",
        description:
          "Clique no ícone de engrenagem no dock para abrir o painel de configurações.",
        tip: "No painel de configurações você pode gerenciar sua conta e ver informações do app.",
      },
    ],
  },
];
</script>

<template>
  <div class="instructions-view">
    <div class="instructions-view__header">
      <h1 class="instructions-view__title">Como Usar o Quick Img Tweakr</h1>
      <p class="instructions-view__subtitle">
        Guia completo para aproveitar ao máximo todas as funcionalidades do
        aplicativo
      </p>
    </div>

    <div class="instructions-view__sections">
      <div
        v-for="section in sections"
        :key="section.title"
        class="instruction-section"
      >
        <div class="instruction-section__header">
          <div class="instruction-section__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path :d="section.icon" />
            </svg>
          </div>
          <h2 class="instruction-section__title">{{ section.title }}</h2>
        </div>

        <div class="instruction-section__steps">
          <div
            v-for="step in section.steps"
            :key="step.number"
            class="instruction-step"
          >
            <div class="instruction-step__number">{{ step.number }}</div>
            <div class="instruction-step__content">
              <h3 class="instruction-step__title">{{ step.title }}</h3>
              <p class="instruction-step__description">
                {{ step.description }}
              </p>
              <div v-if="step.tip" class="instruction-step__tip">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                  />
                </svg>
                <span>{{ step.tip }}</span>
              </div>
            </div>
            <div
              v-if="step.toolbarIcon"
              class="instruction-step__toolbar-preview"
            >
              <div class="toolbar-button">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    :d="toolbarIconPaths[step.toolbarIcon as keyof typeof toolbarIconPaths]"
                  />
                </svg>
              </div>
              <span class="toolbar-label">Botão na toolbar</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="instructions-view__footer">
      <div class="help-box">
        <h3 class="help-box__title">Precisa de mais ajuda?</h3>
        <p class="help-box__text">
          Experimente as funcionalidades seguindo este guia passo a passo. A
          interface foi projetada para ser intuitiva e fácil de usar.
        </p>
        <div class="help-box__shortcuts">
          <strong>Atalhos úteis:</strong>
          <ul>
            <li><code>Cmd+R</code> - Girar esquerda</li>
            <li><code>Cmd+Shift+R</code> - Girar direita</li>
            <li><code>Cmd+Shift+H</code> - Espelhar horizontal</li>
            <li><code>Cmd+Shift+V</code> - Espelhar vertical</li>
            <li><code>Cmd+G</code> - Alternar grade</li>
            <li><code>Cmd+Shift+U</code> - Reverter transformações</li>
            <li><code>Cmd+Shift+D</code> - Remover imagem</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.instructions-view {
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

  &__sections {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  &__footer {
    margin-top: 40px;
    padding-top: 32px;
    border-top: 1px solid #e9ecef;
  }
}

.instruction-section {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e9ecef;

  &__header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__icon {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }

  &__steps {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

.instruction-step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  position: relative;

  &__number {
    width: 32px;
    height: 32px;
    background: #667eea;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 6px;
  }

  &__description {
    font-size: 14px;
    color: #666;
    margin: 0 0 8px;
    line-height: 1.5;
  }

  &__tip {
    background: rgba(102, 126, 234, 0.05);
    border-left: 3px solid #667eea;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 13px;
    color: #555;
    display: flex;
    align-items: flex-start;
    gap: 6px;
    line-height: 1.4;

    svg {
      color: #667eea;
      margin-top: 2px;
      flex-shrink: 0;
    }
  }

  &__toolbar-preview {
    position: absolute;
    top: 0;
    right: -60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    .toolbar-button {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);

      svg {
        color: white;
      }
    }

    .toolbar-label {
      font-size: 10px;
      color: #667eea;
      font-weight: 500;
      text-align: center;
      white-space: nowrap;
    }
  }
}

.help-box {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #dee2e6;

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px;
  }

  &__text {
    font-size: 14px;
    color: #666;
    margin: 0 0 16px;
    line-height: 1.5;
  }

  &__shortcuts {
    font-size: 13px;
    color: #555;

    strong {
      color: #333;
      display: block;
      margin-bottom: 8px;
    }

    ul {
      margin: 0;
      padding-left: 20px;

      li {
        margin-bottom: 4px;
        line-height: 1.4;
      }
    }

    code {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 12px;
      font-family: "SF Mono", "Monaco", "Consolas", monospace;
    }
  }
}

@media (max-width: 768px) {
  .instructions-view {
    &__title {
      font-size: 24px;
    }

    &__subtitle {
      font-size: 14px;
    }
  }

  .instruction-section {
    &__header {
      padding: 16px 20px;
    }

    &__title {
      font-size: 16px;
    }

    &__steps {
      padding: 20px;
    }
  }

  .instruction-step {
    &__title {
      font-size: 15px;
    }

    &__description {
      font-size: 13px;
    }

    &__tip {
      font-size: 12px;
    }
  }

  .help-box {
    padding: 20px;

    &__title {
      font-size: 16px;
    }

    &__text {
      font-size: 13px;
    }
  }
}
</style>
