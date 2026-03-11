# SDD Navigator Dashboard

Specification-Driven Development traceability dashboard built with Next.js. Visualizes requirements coverage, annotations, tasks, and orphan detection for SDD projects.

<!-- @req SCD-DEP-001 -->

## Live URL

**[https://sdd-navigator.vercel.app](https://sdd-navigator.vercel.app)**

## Features

- Summary panel with coverage stats, type breakdown, and progress indicators
- Requirements table with multi-select filtering (type, status) and sorting (ID, updatedAt)
- Requirement detail view with linked annotations, tasks, and coverage labels
- Tasks panel with status filtering and orphan highlighting
- Orphan detection panel for unlinked annotations and tasks
- Scan trigger button with status polling
- Dark/light theme with localStorage persistence
- Responsive layout (table on desktop, cards on mobile)
- Keyboard navigation and ARIA accessibility

## Stack

- Next.js 16 (App Router)
- TypeScript (strict mode)
- Tailwind CSS v4
- Recharts

## Modes

- **API mode**: Set `NEXT_PUBLIC_API_URL=https://api.pdd.foreachpartners.com` to fetch from live API
- **Mock mode**: Leave env var unset to use local JSON data

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test` | Jest unit/component tests |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run check:coverage` | Traceability enforcement |
| `npm run check:all` | Full pre-commit pipeline |

## Deployment

Deployed on [Vercel](https://vercel.com). To deploy your own:

1. Push repo to GitHub
2. Import project on vercel.com
3. Framework preset: Next.js (auto-detected)
4. Optionally set `NEXT_PUBLIC_API_URL` environment variable
5. Deploy
