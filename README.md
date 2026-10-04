# Smart Expense Tracker — Frontend

React + Vite frontend for the Smart Expense Tracker. Track spending, break it
down by category, and ask an LLM-powered advisor about your habits.

## Stack

- React 19 + Vite 7
- Tailwind CSS 4 (design tokens defined in `src/index.css`)
- Chart.js + react-chartjs-2 (lazy-loaded on `/analytics` only)
- React Router 7
- Tabler Icons (webfont via CDN)

## Setup

```bash
npm install
cp .env.example .env    # optional; defaults work for local dev
npm run dev
```

Runs at `http://localhost:5173` and proxies `/api` to the backend at
`http://localhost:8080`.

## Configuration

All environment variables are listed in `.env.example`.

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `/api` | Backend base URL. Leave as `/api` for dev and Docker, where a proxy forwards it. Must be absolute on Vercel. |
| `VITE_AI_URL` | `http://localhost:8000` | AI advisor service base URL. |
| `VITE_DEV_PROXY_TARGET` | `http://localhost:8080` | Where the dev server forwards `/api`. |

`.env` is gitignored; only `.env.example` is tracked.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |

## Project layout

```
src/
  components/
    layout/      AppShell (sidebar + topbar), Sidebar, Topbar
    ui/          Button, Input, Select, Field, Card, Modal, Spinner,
                 Skeleton, EmptyState, ErrorBanner, Badge, StatCard
    expenses/    ExpenseForm, ExpenseModal, ConfirmDeleteDialog,
                 ExpenseFilters, ExpenseTable
    charts/      CategoryDonut, MonthlyBar, chartTheme
  context/       ExpensesProvider, ExpensesContext, useExpenses
  lib/           api (fetch wrapper), format, categories, filters,
                 classes, navigation
  pages/         Dashboard, Expenses, Analytics, AiAdvisor, NotFound
  services/      expenseService, aiService
```

Every page renders inside the `AppShell` layout route, so navigation is
guaranteed on all of them.

### Data flow

`ExpensesProvider` fetches `/api/expenses` **once** and shares it with all
pages via `useExpenses()`. Create, update, and delete patch local state in
place instead of refetching, and derived figures (all-time total, current-month
total, category and monthly rollups, top category) are memoised in the
provider.

### Styling

Colours, fonts, and radii are CSS custom properties in `src/index.css` under
Tailwind's `@theme`, so they generate utilities (`bg-surface`, `text-ink`,
`rounded-panel`, …) and can be overridden in one place. Avoid hard-coding hex
values in components.

## Routes

| Path | Page |
|---|---|
| `/` | Dashboard — summary cards and recent expenses |
| `/expenses` | All expenses, with search/category/date filters, edit, and delete |
| `/analytics` | Category breakdown, monthly trend, recent transactions |
| `/ai` | AI advisor chat |

## Related

- [Backend](https://github.com/voidirl/ai-expense-tracker-backend) — Spring Boot REST API

## 🌐 Live Demo

[![Live Demo](https://img.shields.io/badge/Live%20Demo-voidledger.vercel.app-black?style=for-the-badge&logo=vercel)](https://voidledger.vercel.app)