# LoanLens — Loan Default Prediction Dashboard

A premium, animation-first fintech dashboard for scoring loan default risk, built with
React, Vite, Tailwind CSS, and Framer Motion.

## Stack

- **React 18 + Vite** — app shell and dev server
- **Tailwind CSS** — utility styling with a custom luxury design-token system (see
  `tailwind.config.js` and `src/index.css`)
- **Framer Motion** — page transitions, scroll reveals, count-up numbers, gauges
- **Recharts** — area, donut, line, and bar charts
- **Embla Carousel** — the auto-playing "Recent predictions" carousel
- **Lucide React** — iconography

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment variables

Copy `.env` and adjust as needed:

- `VITE_API_BASE_URL` — base URL for your model-serving API
- `VITE_USE_MOCK` — set to `false` once a real `/predict` and `/dataset` backend is
  live; while `true`, `src/services/predictionService.js` and
  `src/services/datasetService.js` return deterministic mock data so the UI is fully
  demoable without a backend.

## Project structure

The folder layout mirrors a typical feature-oriented React app:

- `src/components/` — organized by feature area (`common`, `dashboard`, `prediction`,
  `how-it-works`, `performance`, `dataset`, `home`)
- `src/pages/` — one file per route
- `src/layouts/` — `MainLayout` (navbar/footer shell) and `DashboardLayout` (sidebar
  shell used by the app-like Dashboard/Prediction/Performance/Dataset pages)
- `src/context/` — `ThemeContext` (light/dark, persisted to `localStorage`) and
  `PredictionContext` (shared state for the prediction wizard)
- `src/services/` — thin API layer; swap the mock branch for real endpoints
- `src/data/` — static/mock content for charts and copy
- `src/utils/` — formatting, validation, and shared constants

## Connecting a real model

`src/services/predictionService.js` exports `runPrediction(payload)`. Set
`VITE_USE_MOCK=false` and it will `POST` to `${VITE_API_BASE_URL}/predict` instead of
using the local heuristic scorer. Shape your API response to match:

```json
{
  "probability": 0.34,
  "riskLevel": { "label": "Moderate risk", "color": "#F59E0B" },
  "contributions": [{ "feature": "Credit score", "impact": -0.12 }],
  "scoredAt": "2026-09-23T12:00:00.000Z"
}
```

## Notes

- Theme tokens (colors, shadows, gradients) live as CSS variables in `src/index.css`
  so charts and custom components can read them without duplicating Tailwind config.
- Reduced-motion is respected globally via a `prefers-reduced-motion` media query.
- Replace the placeholder files in `public/images/` (`hero.png`,
  `loan-illustration.png`, `prediction.png`) with your own artwork — they're
  referenced as key visual anchors in the design brief but ship as lightweight
  placeholders here.
