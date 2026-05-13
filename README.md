# CobraZap - MicroSaaS de Cobrança Inteligente

Sistema automatizado de cobranças via WhatsApp para pequenas empresas brasileiras.

## Stack Técnica

- **Framework**: Next.js 16 com App Router e React Server Components
- **Linguagem**: TypeScript strict mode
- **Estilo**: Tailwind CSS v3 + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Integrações**: Asaas (PIX/cobranças), Evolution API (WhatsApp)
- **Testes**: Vitest + Testing Library

## Scripts

```bash
npm install     # Instalar dependências
npm run dev     # Iniciar desenvolvimento
npm run build   # Build de produção
npm run lint    # Verificar lint
npm run test    # Executar testes (watch mode)
npm run test:run # Executar testes uma vez
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

## Deploy

Este projeto está configurado para deploy no Vercel. Para production:

1. Configurar variáveis de ambiente na dashboard do Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ASAAS_API_URL`
   - `ASAAS_WEBHOOK_TOKEN`
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL`

2. Executar `npm run build` para verificar o build localmente

3. Deploy automático via Vercel CLI ou GitHub integration