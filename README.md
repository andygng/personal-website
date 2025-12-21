## Overview
- Single editorial-scroll home page at `/` with scroll-snapped chapters, an up-scroll chapter index, and a right-side dot navigator.
- Content is sourced from Supabase `chapters` and `chapter_items` so the entire page is editable without code.

## Quickstart
- Install deps: `npm install`
- Create a Supabase project and grab `SUPABASE_URL` + `anon` key.
- Add `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=...your url...
  NEXT_PUBLIC_SUPABASE_ANON_KEY=...your anon key...
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  ```
- Run the SQL (schema + RLS + seeds) in order inside Supabase SQL Editor:
  1. `supabase/schema.sql`
  2. `supabase/seed.sql`
  3. (optional) `supabase/migrations/202501070001_create_chapters.sql` for migrating existing data
- Start dev server: `npm run dev` then open `http://localhost:3000`.

## Supabase model
- `chapters`: id (uuid, pk), slug (unique), title, subtitle, description, order_index, published, theme (jsonb), updated_at.
- `chapter_items`: id, chapter_id (fk), type (`statement | timeline_event | link_tile | principle | repeat_item | media_item | spot`), title, body, url, image_url, meta (jsonb), order_index, published, updated_at.
- Legacy tables (`pages`, `sections`, `items`) are retained for migration but are no longer used by the UI.

## Project structure
- `src/app/page.tsx` — server fetch + layout wrapper for the editorial home.
- `src/components/home/EditorialHome.tsx` — scroll-snap chapters, chapter index overlay, dot nav, and per-chapter layouts.
- `src/app/[...slug]/page.tsx` — redirects old routes back to `/`.
- `src/lib/queries.ts` — Supabase fetch helpers for chapters and chapter items.
- `supabase/schema.sql` + `supabase/seed.sql` — schema, policies, and placeholder content.
- `supabase/migrations/202501070001_create_chapters.sql` — creates chapter tables and migrates existing data.

## How to edit content
- `chapters` controls the chapter order and the editorial headline.
  - Example (About): set `title = "About Me"`, `subtitle = "Currently Placeholder"`, `description = "Designing thoughtful products and playful tools."`, `order_index = 1`, `published = true`.
- `chapter_items` controls the body content per chapter. Use `order_index` for ordering and `published` to hide.

Chapter examples:
- About (`slug = about`):
  - `statement` item for the hero block: `title = "Designing thoughtful products..."`, `body = "A personal corner..."`, `meta = {"kicker":"Currently","chips":["Based in: Anywhere"],"cta_primary":{"label":"Download CV","href":"#"}}`.
  - `timeline_event` item for highlights: `title = "From place -> purpose"`, `body = "Summarize your origin story."`, `meta = {"badge":"Origin"}`.
  - `link_tile` item for quick links: `title = "Email"`, `url = "mailto:hello@example.com"`.
- Quick Links (`slug = quick-links`):
  - `link_tile` item: `title = "Portfolio"`, `body = "Latest builds and experiments."`, `url = "https://..."`, `meta = {"badge":"Work"}`.
- Principles (`slug = principles`):
  - `principle` item: `title = "Default to momentum"`, `body = "Bias for small, high-frequency shipping."`, `meta = {"badge":"▲"}`.
- On Repeat (`slug = on-repeat`):
  - `repeat_item` item: `title = "Track Title - Artist"`, `body = "Album or mood note."`, `meta = {"cover_label":"A1"}`.
- Listening / Reading (`slug = listening`):
  - `media_item` item: `title = "Episode title - Host"`, `body = "One-line takeaway."`, `meta = {"badge":"EP01","tags":["design","systems"],"progress":55}`.
- Favourite Spots (`slug = favourite-spots`):
  - `spot` item: `title = "Studio nook"`, `body = "Quiet mornings, soft light."`, `meta = {"badge":"Work"}`.

## Scripts
- `npm run dev` — start locally
- `npm run build` — production build
- `npm run start` — run the built app
- `npm run lint` — lint the codebase
