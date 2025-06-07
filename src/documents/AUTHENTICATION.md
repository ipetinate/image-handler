# Sistema de Autenticação - Quick Img Tweakr

## 🚀 Funcionalidades Implementadas

### 1. Hook `useAuth`

Localização: `src/hooks/useAuth.ts`

**Métodos disponíveis:**

- `signIn(email, password)` - Login do usuário
- `signUp(email, password, fullName?)` - Registro de novo usuário
- `signOut()` - Logout do usuário
- `resetPassword(email)` - Recuperação de senha
- `updateProfile(updates)` - Atualização do perfil
- `initializeAuth()` - Inicialização da autenticação

**Propriedades:**

- `hasAuth` - Computed que retorna se o usuário está autenticado
- `user` - Dados do usuário atual
- `loading` - Estado de carregamento
- `error` - Mensagens de erro

### 2. Store `useAuthStore`

Localização: `src/stores/useAuthStore.ts`

**Estado gerenciado:**

- `user` - Dados do usuário
- `loading` - Estado de carregamento
- `initialized` - Se a autenticação foi inicializada

**Getters:**

- `isAuthenticated` - Se o usuário está logado
- `userEmail` - Email do usuário
- `userName` - Nome do usuário
- `userAvatar` - URL do avatar

### 3. Botão de Login

Localização: `src/components/LoginButton.vue`

**Funcionalidades:**

- Dropdown com formulário de login/registro
- Avatar do usuário quando logado
- Acesso às configurações
- Botão de logout

### 4. Janela de Configurações

Localização: `src/components/SettingsWindow.vue`

**Estilo macOS com:**

- Sidebar de navegação
- Dados do usuário no topo
- Sistema de rotas interno
- Botão de logout estilo macOS

### 5. Views das Configurações

#### ProfileView (`src/views/ProfileView.vue`)

- Edição do nome completo
- Visualização do email (não editável)
- Avatar com iniciais do usuário

#### PasswordResetView (`src/views/PasswordResetView.vue`)

- Formulário para recuperação de senha
- Validação de email
- Instruções de uso

#### AboutView (`src/views/AboutView.vue`)

- Informações do app
- Lista de recursos
- Tecnologias utilizadas
- Versão e build

### 6. Sistema de Rotas Simples

Localização: `src/components/SettingsRouter.vue`

**Funcionalidades:**

- Navegação entre views sem router externo
- Context API para compartilhar estado
- Rotas: 'profile', 'password-reset', 'about'

## ⚙️ Configuração

### 1. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Copie as configurações do arquivo `supabase.config.example.txt`
3. Crie um arquivo `.env` na raiz do projeto
4. Adicione as variáveis:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Estrutura do Banco

O Supabase já vem com autenticação configurada. Apenas habilite:

- Email/Password authentication
- Auto-confirm users (opcional para desenvolvimento)

## 🎨 Integração com a UI

### Botão de Login

- Posicionado no canto superior direito
- Estilo glassmorphism
- Dropdown responsivo

### Janela de Configurações

- Modal centralizado
- Estilo macOS nativo
- Sidebar de navegação
- Transições suaves

### Estados Visuais

- Loading states nos formulários
- Mensagens de erro contextuais
- Feedback visual de sucesso
- Avatar com iniciais personalizadas

## 🔧 Uso no Código

```typescript
// Em qualquer componente
import { useAuth } from "@/hooks/useAuth";

const { hasAuth, user, signIn, signOut } = useAuth();

// Verificar se está logado
if (hasAuth.value) {
  console.log("Usuário logado:", user.value?.email);
}

// Fazer login
const result = await signIn("email@example.com", "password");
if (result.success) {
  console.log("Login realizado com sucesso!");
}
```

## 📱 Responsividade

Todos os componentes são responsivos e seguem o design system do app:

- Breakpoints consistentes
- Tipografia harmoniosa
- Cores do tema principal
- Animações sutis

## 🛡️ Segurança

- Tokens gerenciados pelo Supabase
- Validação no frontend e backend
- Auto-refresh de sessões
- Logout automático em caso de erro
