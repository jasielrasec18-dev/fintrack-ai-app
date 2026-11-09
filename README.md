# FinTrack AI

Controle financeiro pessoal com dashboard mensal e sugestões de economia geradas por IA.

- **Design:** [Figma](https://www.figma.com/design/QNEXVeiU27cX2V4Ut4i6f0/Fintrack-AI)

## Funcionalidades

- Cadastro e login com e-mail e senha
- Dashboard com saldo, economia em relação ao mês anterior e gráfico por tipo
- Cadastro, edição e exclusão de transações
- Sugestão de economia por IA para o mês selecionado
- Layout responsivo

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · Prisma 5 · PostgreSQL · Better Auth · Google Gemini · Recharts

## Como rodar localmente

```bash
cp .env.example .env   # preencha as variáveis
npm install
npx prisma migrate dev
npm run dev
```

O app fica disponível em http://localhost:3000.

## Deploy na Vercel

1. Importe o repositório na Vercel e conecte um Postgres (Neon ou Supabase).
2. Cadastre as variáveis do `.env.example` em Production e Preview, com `BETTER_AUTH_URL` apontando para o domínio de produção.
3. O script `vercel-build` aplica as migrations e gera o build.
