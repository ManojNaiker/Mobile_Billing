# BillEase — GST Invoice Generator

A professional GST Tax Invoice Generator web app for Indian small businesses. Create, manage, and print GST-compliant invoices with Tally-style layouts.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/billease run dev` — run the frontend (port 21071)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- SQLite DB file: `data/billease.db` — auto-created on first run, no setup needed

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + wouter
- API: Express 5
- DB: SQLite (better-sqlite3) + Drizzle ORM — embedded, no separate server needed
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Charts: Recharts
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/` — Drizzle table definitions (company, customers, products, invoices)
- `artifacts/api-server/src/routes/` — Express route handlers (company, customers, products, invoices, dashboard)
- `artifacts/billease/src/` — React frontend (pages, components, utilities)

## Architecture decisions

- JSONB column for invoice items — avoids a separate line-items table, fits Drizzle well
- Company table is a singleton (one row) — all settings stored there including invoice counter
- Amount-in-words calculation done server-side in invoices route using Indian lakh/crore system
- GST mode (intra-state CGST+SGST vs inter-state IGST) determined on the frontend at invoice creation time
- Drizzle ORM + `drizzle-zod` for type-safe schema with auto-generated insert validators

## Product

- Dashboard with stats cards (total invoices, monthly revenue, tax collected, avg value) and monthly revenue bar chart
- Invoice create/edit with dynamic line items, GST auto-calculation, product autocomplete, customer auto-fill
- Tally-style A4 invoice preview with QR code, watermark, tax summary table, print support
- Billing history with search, status filter, pagination
- Customer and product catalog management
- Company profile with bank details, invoice settings, watermark config, SMTP settings
- Dark/light mode toggle

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After changing `lib/db/src/schema/`, always run `pnpm run typecheck:libs` before checking API server typecheck — stale lib declarations cause false "no exported member" errors
- After each OpenAPI spec change, re-run `pnpm --filter @workspace/api-spec run codegen` before using updated types
- `qrcode.react` is installed as a runtime dependency in `artifacts/billease`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
