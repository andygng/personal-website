# Repository Guidelines

## Project Summary
- Next.js App Router editorial home page with scroll-snapped chapters.
- Content is driven by Supabase `chapters` and `chapter_items`.

## Project Structure & Key Files
- `src/app/page.tsx` server fetch + layout wrapper for the editorial home.
- `src/components/home/EditorialHome.tsx` main layout + interactions (scroll snap, dot nav, chapter index, quick-links merge).
- `src/components/Markdown.tsx` markdown rendering (`react-markdown` + `remark-gfm`).
- `src/app/layout.tsx` global layout, fonts, and metadata.
- `src/app/[...slug]/page.tsx` redirects legacy routes back to `/`.
- `src/lib/queries.ts` Supabase queries; `fetchChaptersWithItems` is the main entry.
- `src/lib/supabase/server.ts` server Supabase client; `src/lib/supabase/client.ts` for client use.
- `src/lib/types.ts` data types for chapters and the legacy page/section system.
- `src/app/globals.css` design tokens and reusable classes.
- `supabase/schema.sql`, `supabase/seed.sql`, `supabase/migrations/*` database schema + seed content.
- `reference/index.html` static design reference (not used at runtime).

## Data Model & Content Rules
- `chapters` controls chapter order and headers; `order_index` sorts and `published` gates visibility.
- `chapters.description` is the subheader (falls back to `subtitle`).
- `chapter_items` drives the right-hand list for each chapter; `order_index` sorts and `published` gates visibility.
- `chapter_items.body` and `chapter_items.url` enable expand/collapse details; items with neither render as simple cards.
- `chapter_items.type = link_tile` powers about/quick-link bubbles (requires `url`).
- `chapter_items.meta.section_type` can group about-timeline items when quick-links are merged.
- `chapter.theme` and `chapter_items.meta` are flexible JSON.
  - For Favourite Spots: `chapter.theme.spots_filters.cities` and `.types` (or `chapter.theme.filters`) can define filter dropdowns.
  - Spot items read `chapter_items.meta.city` (or `location`/`town`) and `place_type` (or `placeType`/`type`/`category`).

## UI Behavior to Preserve
- Scroll snap is global (`html`, `body`), and each chapter section uses `chapter-shell`, `id`, and `data-chapter`.
- `EditorialHome` merges the `quick-links` chapter into `about` when both exist.
- Chapter theming is per slug via `chapterThemes`; new slugs fall back to `defaultTheme`.
- Layout tweaks per slug live in `layoutBySlug`, and chapter photos in `chapterPhotos`.
- `Markdown` uses `react-markdown` + `remark-gfm` and applies the `rich-text` class.

## Styling & Design Tokens
- Use CSS variables in `src/app/globals.css` (`--bg`, `--text`, `--muted`, etc.) and shared classes (`glass-card`, `fade-up`, `spot-list`, `spot-scroll`).
- Fonts are defined in `src/app/layout.tsx` and referenced via `--font-display` and `--font-body`.
- Favor Tailwind utilities for layout, but keep custom effects in `globals.css`.

## Data Access & Supabase
- Keep data fetching in `src/lib/queries.ts` and use the server Supabase client.
- If you add new fields to Supabase data, update `src/lib/types.ts` and the SQL schema/seed.

## Build, Test, and Development Commands
- `npm install`
- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run start`

## Configuration
- Required env vars (see `README.md`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.
- Keep secrets in `.env.local`; do not commit them.

## Coding Style & Conventions
- Use the `@/` alias for imports from `src`.
- Components with hooks or event handlers must include `"use client"`.
- Keep `chapter-shell` markup and `data-chapter` attributes intact.
- Prefer small, focused edits that preserve scroll and visual behavior.

## Database Workflow
- `supabase/schema.sql` and `supabase/seed.sql` are the source of truth for a clean bootstrap.
- New schema changes should be added as new files in `supabase/migrations/` and then reflected in `schema.sql` and `seed.sql`.

## Legacy Code
- `src/components/sections/*` and `src/components/Sidebar.tsx` support the older page/section layout (`pages`, `sections`, `items` tables).
  The current UI does not use them, so change or remove with care.
- `src/app/[...slug]/page.tsx` redirects legacy routes to `/`.

## Review Guidelines
These are priority 0 checks for this repo.
- `chapters`/`chapter_items` queries keep `published` gating and `order_index` sorting.
- Scroll snap + `chapter-shell`/`data-chapter` attributes remain intact; dot nav and index still track the active chapter.
- Quick-links merge into about remains functional; `link_tile` items still render as bubbles.
- Supabase schema/seed/types stay in sync with any data model changes.
- `Markdown` rendering keeps `rich-text` + `remark-gfm` behavior.
