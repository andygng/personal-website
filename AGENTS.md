# AGENTS.md

This repo is a Next.js App Router site with a single editorial scroll home page.
Content is fetched from Supabase tables `chapters` and `chapter_items`.

## Quick orientation
- Runtime: Next.js App Router with React and TypeScript.
- Styling: Tailwind v4 via `@import "tailwindcss"` in `src/app/globals.css` plus custom CSS variables.
- Data: Supabase via `@supabase/ssr` server client in `src/lib/supabase/server.ts`.

## Key paths
- `src/app/page.tsx` server component that fetches chapters and renders the home.
- `src/components/home/EditorialHome.tsx` main layout + interactions (scroll snap, dot nav, chapter index, quick-links merge).
- `src/lib/queries.ts` Supabase queries; `fetchChaptersWithItems` is the main entry.
- `src/lib/types.ts` data types for chapters and legacy page/section system.
- `src/app/globals.css` design tokens and reusable classes.
- `supabase/schema.sql`, `supabase/seed.sql`, `supabase/migrations/*` database schema + seed content.
- `reference/index.html` static design reference (not used at runtime).

## Data model and conventions
- `chapters` controls chapter order and headers; `published` gates visibility.
- `chapter_items` drives the right-hand list for each chapter; `order_index` sorts and `published` gates visibility.
- `chapter_items.body` and `chapter_items.url` enable expand/collapse details; items with neither render as simple cards.
- `chapter.theme` and `chapter_items.meta` are flexible JSON.
  - For Favourite Spots: `chapter.theme.spots_filters.cities` and `.types` can define filter dropdowns.
  - Spot items read `chapter_items.meta.city` (or `location`/`town`) and `place_type` (or `placeType`/`type`/`category`).

## UI behavior to preserve
- Scroll snap is global (`html`, `body`), and each chapter section uses `chapter-shell`, `id`, and `data-chapter`.
- `EditorialHome` merges the `quick-links` chapter into `about` when both exist.
- Chapter theming is per slug via `chapterThemes`; new slugs fall back to `defaultTheme`.
- Layout tweaks per slug live in `layoutBySlug`.
- `Markdown` uses `react-markdown` + `remark-gfm` and applies the `rich-text` class.

## Styling and UI conventions
- Use CSS variables in `globals.css` (`--bg`, `--text`, `--muted`, etc.) and shared classes (`glass-card`, `fade-up`, `spot-list`, `spot-scroll`).
- Heading font is `var(--font-display)`; body text uses `var(--font-body)`.
- Favor Tailwind utilities for layout, but keep custom effects in `globals.css`.

## Coding conventions
- Use the `@/` alias for imports from `src`.
- Components with hooks or event handlers must include `"use client"`.
- Keep data fetching in `src/lib/queries.ts` and use the server Supabase client.
- If you add new fields to Supabase data, update `src/lib/types.ts` and the SQL schema/seed.

## Working on the database
- `supabase/schema.sql` and `supabase/seed.sql` are the source of truth for a clean bootstrap.
- New schema changes should be added as new files in `supabase/migrations/` and then reflected in `schema.sql` and `seed.sql`.

## Local dev
- `npm run dev` for the dev server.
- `npm run lint` for linting.
- Required env vars (see `README.md`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.

## Legacy code
- `src/components/sections/*` and `src/components/Sidebar.tsx` support the older page/section layout (`pages`, `sections`, `items` tables).
  The current UI does not use them, so change or remove with care.
