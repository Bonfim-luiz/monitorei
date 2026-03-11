# Monitorei - Frontend SaaS

Frontend completo para o SaaS **Monitorei** - Plataforma de monitoramento de convocações em concursos públicos.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Estilos globais
│   │   ├── cadastro/
│   │   │   └── page.tsx        # Página de cadastro
│   │   ├── login/
│   │   │   └── page.tsx        # Página de login
│   │   └── dashboard/
│   │       └── page.tsx        # Dashboard do usuário
│   ├── components/
│   │   ├── Header.tsx          # Cabeçalho
│   │   ├── Footer.tsx          # Rodapé
│   │   └── sections/
│   │       ├── HeroSection.tsx
│   │       ├── HowItWorksSection.tsx
│   │       ├── BenefitsSection.tsx
│   │       ├── PricingSection.tsx
│   │       ├── FAQSection.tsx
│   │       └── CTASection.tsx
│   └── types/
│       └── index.ts            # Tipos TypeScript
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🛠️ Instalação

```bash
# Entrar na pasta do frontend
cd frontend

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar em produção
npm start
```

## 📱 Páginas

### Landing Page (`/`)
- Hero section com proposta de valor
- Como funciona (3 passos)
- Benefícios do serviço
- Tabela de preços com trial de 30 dias
- FAQ
- CTA final

### Cadastro (`/cadastro`)
- Formulário completo com validação
- Campos: nome, email, telefone, cidade, estado, senha
- Aceite de termos de uso
- Integração com trial de 30 dias

### Login (`/login`)
- Autenticação por email/senha
- Opção "Lembrar de mim"
- Recuperação de senha
- Login social (Google)

### Dashboard (`/dashboard`)
- **Dashboard**: Resumo de concursos e alertas
- **Meus Concursos**: Lista e gerenciamento
- **Configurações**: Dados pessoais, notificações e assinatura

## 🎨 Design System

### Cores
```css
primary: #3b82f6 (azul)
secondary: #22c55e (verde)
```

### Componentes CSS (em globals.css)
- `.btn-primary` - Botão primário
- `.btn-secondary` - Botão secundário
- `.btn-success` - Botão de sucesso
- `.card` - Card padrão
- `.input-field` - Campo de input
- `.label` - Label de formulário

## 📋 Funcionalidades

### Trial de 30 dias
- Usuários começam com teste gratuito
- Sem necessidade de cartão de crédito
- Contador de dias restantes no dashboard
- Upgrade para plano pago após trial

### Notificações
- Email
- WhatsApp
- SMS (plano profissional)
- Resumo diário configurável

### Gestão de Concursos
- Adicionar/remover concursos
- Monitoramento de classificação
- Histórico de publicações
- Alertas de convocação

## 🔗 Integração com Backend

O frontend está preparado para integração com API REST:

```typescript
// Exemplo de tipos para API
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Endpoints esperados:
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `GET /api/user/profile` - Perfil
- `PUT /api/user/profile` - Atualizar perfil
- `GET /api/concursos` - Listar concursos
- `POST /api/concursos` - Adicionar concurso
- `DELETE /api/concursos/:id` - Remover concurso
- `GET /api/alertas` - Listar alertas
- `PUT /api/subscription` - Gerenciar assinatura

## 📱 Responsividade

O design é totalmente responsivo:
- **Mobile**: Menu hamburger, layout em coluna
- **Tablet**: Layout adaptado
- **Desktop**: Sidebar fixa, grids completos

## 🚀 Próximos Passos

1. [ ] Integração com backend real
2. [ ] Implementar autenticação JWT
3. [ ] Adicionar testes unitários
4. [ ] Configurar CI/CD
5. [ ] Integração com gateway de pagamento
6. [ ] PWA para instalação mobile

## 📄 Licença

Projeto proprietário - Monitorei © 2026
