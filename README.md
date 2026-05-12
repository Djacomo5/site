# CobraZap - MicroSaaS de Cobrança Inteligente

Sistema automatizado de cobranças via WhatsApp para pequenas empresas brasileiras.

## Stack Técnica

- **Framework**: Next.js 15 com App Router e React Server Components
- **Linguagem**: TypeScript strict mode
- **Estilo**: Tailwind CSS v3 + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Integrações**: Asaas (PIX/cobranças), Evolution API (WhatsApp)

## Scripts

```bash
npm install    # Instalar dependências
npm run dev    # Iniciar desenvolvimento
npm run build  # Build de produção
npm run lint   # Verificar lint
```

## Variáveis de Ambiente

Consulte `.env.local.example` para configurar as variáveis necessárias.

## Funcionalidades

- Gestão de clientes
- Criação de cobranças PIX via Asaas
- Envio automático de mensagens via WhatsApp
- Templates de mensagens personalizáveis
- Dashboard com métricas de cobrança
- Sistema de planos (Starter, Pro, Business)
