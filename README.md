## Overview
- Single editorial-scroll home page at `/` with scroll-snapped chapters, an up-scroll chapter index, and a right-side dot navigator.
- Each chapter is minimalist: chapter number, title, subheader, and a dropdown list on the right.
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
  4. (optional) `supabase/migrations/202501070002_simplify_chapter_items.sql` to add the `entry` default type
- Start dev server: `npm run dev` then open `http://localhost:3000`.

## Supabase model
- `chapters`: id (uuid, pk), slug (unique), title, subtitle, description, order_index, published, theme (jsonb), updated_at.
- `chapter_items`: id, chapter_id (fk), type (`entry` default), title, body, url, image_url, meta (jsonb), order_index, published, updated_at.
- Legacy tables (`pages`, `sections`, `items`) are retained for migration but are no longer used by the UI.

## Project structure
- `src/app/page.tsx` — server fetch + layout wrapper for the editorial home.
- `src/components/home/EditorialHome.tsx` — scroll-snap chapters, chapter index overlay, dot nav, and per-chapter layouts.
- `src/app/[...slug]/page.tsx` — redirects old routes back to `/`.
- `src/lib/queries.ts` — Supabase fetch helpers for chapters and chapter items.
- `supabase/schema.sql` + `supabase/seed.sql` — schema, policies, and placeholder content.
- `supabase/migrations/202501070001_create_chapters.sql` — creates chapter tables and migrates existing data.
- `supabase/migrations/202501070002_simplify_chapter_items.sql` — adds the `entry` default type for simpler edits.

## How to edit content
- `chapters` controls the chapter order and the editorial header.
  - The subheader shown on the page uses `description` (with `subtitle` as a fallback), so you only need to edit `title` + `description`.
  - Example (About): set `title = "About Me"`, `description = "Designing thoughtful products and playful tools."`, `order_index = 1`, `published = true`.
- `chapter_items` controls the dropdown list on the right.
  - For each chapter, add rows with `title` (required), optional `body`, optional `url`, and `order_index`.
  - `type` defaults to `entry` and is not used by the UI, so you can leave it alone.
  - For simple lists (On Repeat, Listening), leave `body` empty if you only want titles.

Examples (any chapter):
- Minimal item (just a title): `title = "Portfolio"`, `order_index = 1`.
- Item with details: `title = "Default to momentum"`, `body = "Bias for small, high-frequency shipping."`.
- Item with a link: `title = "Email"`, `url = "mailto:hello@example.com"`.

## Scripts
- `npm run dev` — start locally
- `npm run build` — production build
- `npm run start` — run the built app
- `npm run lint` — lint the codebase
