## Overview
- Dark, minimal, high-end Next.js (App Router + TypeScript + Tailwind v4) front-end that renders all page content from Supabase.
- Left sidebar stays fixed on desktop and collapses on mobile; main area swaps content via client-side routing.
- Sections map to a handful of templates (hero, card grid, mini card scroller, list with badges, footer links) so content stays structured but editable from the DB.

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
- Start dev server: `npm run dev` then open `http://localhost:3000` (root redirects to `/about`).

## Supabase model
- `pages`: id (uuid, pk), slug (unique), title, subtitle, description, sort_order, is_published, updated_at.
- `sections`: id, page_id (fk), type (`hero | card_grid | mini_card_scroller | list_with_badges | footer_links`), heading, body (markdown), sort_order, meta (jsonb), updated_at.
- `items`: id, page_id (fk), section_id (fk, optional), title, subtitle, url, tags (text[]), badge, progress (int 0–100), cover_label, sort_order, meta (jsonb).
- RLS: anon can read only when `pages.is_published = true`. Sections/items are readable only if their parent page is published. Everything else is locked down by default.

## Section → component mapping
- `hero`: uses `meta.kicker`, `meta.cta_primary {label, href}`, `meta.cta_secondary`, `meta.chips[]`; `heading` as title; `body` as lead.
- `card_grid`: `heading`/`body` for intro; cards come from `items` with `badge` (tag), `title`, `subtitle`.
- `mini_card_scroller`: horizontal cards from `items` with `cover_label` (or `badge`), `title`, `subtitle`.
- `list_with_badges`: vertical list from `items` using `badge`, `title`, `subtitle`, `tags[]`, `progress` (0–100).
- `footer_links`: pills from `items` (`title`, `url`) to mirror the footer chips.
- `meta.hint` optionally renders the small uppercase label above a section.

## Project structure
- `src/app/layout.tsx` — global fonts (Fraunces + Spline Sans Mono) and metadata.
- `src/app/(site)/layout.tsx` — persistent sidebar + background FX (noise + glow).
- `src/app/(site)/[slug]/page.tsx` — dynamic page rendering from Supabase with loading/error/not-found states.
- `src/components/Sidebar.tsx` — desktop-fixed / mobile-collapsible nav with filtering.
- `src/components/sections/*` — section templates described above; `SectionRenderer` wires them up.
- `src/lib/supabase/*` — server/browser clients; `src/lib/queries.ts` pulls pages/sections/items.
- `supabase/schema.sql` + `supabase/seed.sql` — tables, policies, and placeholder content matching the original HTML.

## Styling notes
- Tailwind utilities plus custom CSS for the hero glass card, glow blob, noise overlay, gradients, and fade-up animation (honors `prefers-reduced-motion`).
- Typography mirrors the original: Fraunces for display, Spline Sans Mono for body.
- Buttons, cards, and chips keep the soft borders, subtle glows, and spacing from the single-file version.

## Editing content
- Update rows in Supabase; UI will reflect changes on next render.
- Add new pages by inserting into `pages` with a unique slug and published flag, then add sections/items tied to that `page_id`.
- Use `sort_order` to control both sidebar order and in-page section ordering.

## Scripts
- `npm run dev` — start locally
- `npm run build` — production build
- `npm run start` — run the built app
- `npm run lint` — lint the codebase
