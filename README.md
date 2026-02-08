# LoopLab

Terminal minimalista para estratégias de looping, risco e pontos/airdrops. MVP em Next.js App Router com dados mockados e simulação local.

## Como rodar

```bash
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Arquitetura

- **App Router**: páginas em `app/` para Dashboard, Construtor, Comparar, Laboratório de risco, Laboratório de pontos e Share.
- **UI**: TailwindCSS + componentes inspirados em shadcn/ui em `components/ui/`.
- **Estado**: Zustand para snapshots locais em `lib/store.ts` com persistência no `localStorage`.
- **Formulários**: React Hook Form + Zod.
- **Charts**: Recharts (Laboratório de risco).
- **Dados**: Providers mockados em `lib/providers.ts`.
- **Simulação**: Matemática central em `lib/simulate.ts`.

## Onde substituir por integrações reais

- `lib/providers.ts`: troque `listMarkets`, `getMarketSnapshot`, `listAssets` por chamadas a Aave/Morpho.
- `lib/simulate.ts`: ajuste fórmulas ou adicione lógica de loops reais.

## Notas

- **Sem auth**: links compartilháveis via `/share/[id]`.
- **Disclaimer**: “Não é conselho financeiro.” em todas as áreas críticas.
