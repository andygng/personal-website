-- Seed pages
insert into pages (id, slug, title, subtitle, description, sort_order, is_published)
values
  ('11111111-1111-1111-1111-111111111111', 'about', 'About Me', 'Currently Placeholder', 'Designing thoughtful products and playful tools.', 1, true),
  ('22222222-2222-2222-2222-222222222222', 'quick-links', 'Quick Links', 'Shortcuts & essentials', 'A tidy drawer of the most useful things.', 2, true),
  ('33333333-3333-3333-3333-333333333333', 'principles', 'Principles', 'Guardrails and heuristics', 'Short rules to bias good taste.', 3, true),
  ('44444444-4444-4444-4444-444444444444', 'on-repeat', 'On Repeat', 'Loops and tracks', 'Albums and loops in heavy rotation.', 4, true),
  ('55555555-5555-5555-5555-555555555555', 'listening', 'Listening / Reading List', 'Longer-form queues', 'Podcasts, sets, and texts queued up.', 5, true),
  ('66666666-6666-6666-6666-666666666666', 'favourite-spots', 'Favourite Spots', 'Places that stick', 'Rooms and corners worth revisiting.', 6, true)
on conflict (slug) do update
set title = excluded.title,
    subtitle = excluded.subtitle,
    description = excluded.description,
    sort_order = excluded.sort_order,
    is_published = excluded.is_published;

-- Seed sections
insert into sections (id, page_id, type, heading, body, sort_order, meta)
values
  -- About
  ('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'hero',
    'Designing thoughtful products and playful tools.',
    'A personal corner for notes on craft, principles I lean on, and the media shaping my taste. Copy is placeholder—ready for your words.',
    1,
    '{
      "kicker": "Currently Placeholder",
      "chips": ["Based in: Anywhere", "Focus: Product & systems", "Stack: Web / Design / Writing"],
      "cta_primary": {"label": "Download CV", "href": "#"},
      "cta_secondary": {"label": "Contact", "href": "#"}
    }'),
  ('aaaa2222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'card_grid',
    'A short, opinionated bio goes here.',
    'Drop in a concise story about your path, what you obsess over, and the textures of your day-to-day work. Keep it sharp.',
    2,
    '{"hint": "About Me"}'),
  ('aaaa3333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'footer_links',
    'Last updated: Soon',
    'Swap these for your destinations.',
    3,
    '{}'),

  -- Quick links
  ('bbbb1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'card_grid',
    'Quick access',
    'Swap these with your high-signal destinations.',
    1,
    '{"hint": "Links"}'),

  -- Principles
  ('cccc1111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'card_grid',
    'Guardrails and heuristics.',
    'List the short rules you return to—each card can be a mantra, constraint, or mental model.',
    1,
    '{"hint": "Principles"}'),

  -- On Repeat
  ('dddd1111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'mini_card_scroller',
    'Loops and tracks in heavy rotation.',
    'Swap placeholders with whatever is looping in your ears this month.',
    1,
    '{"hint": "On Repeat"}'),

  -- Listening / Reading
  ('eeee1111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'list_with_badges',
    'Longer-form listening, queued.',
    'Podcasts, sets, talks—add links, hosts, and why they matter.',
    1,
    '{"hint": "Listening List"}'),

  -- Favourite Spots
  ('ffff1111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'card_grid',
    'Rooms, corners, and venues worth revisiting.',
    'Anchor in the places that keep you grounded or curious.',
    1,
    '{"hint": "Favourite Spots"}')
on conflict (id) do update
set heading = excluded.heading,
    body = excluded.body,
    sort_order = excluded.sort_order,
    meta = excluded.meta;

-- Seed items
insert into items (id, page_id, section_id, title, subtitle, url, tags, badge, progress, cover_label, sort_order, meta)
values
  -- About grid
  ('a1a1a1a1-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'aaaa2222-2222-2222-2222-222222222222',
    'From place → to purpose', 'Summarize where you started and how you arrived here.', null, null, 'Origin', null, null, 1, '{}'),
  ('a2a2a2a2-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'aaaa2222-2222-2222-2222-222222222222',
    'Current role / craft', 'What you build, ship, research, or design right now.', null, null, 'Work', null, null, 2, '{}'),
  ('a3a3a3a3-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'aaaa2222-2222-2222-2222-222222222222',
    'What you’re exploring', 'Topics you’re investigating or skills you’re stretching.', null, null, 'Now', null, null, 3, '{}'),

  -- Footer links (About)
  ('a4a4a4a4-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'aaaa3333-3333-3333-3333-333333333333',
    'Email', null, '#', null, null, null, null, 1, '{}'),
  ('a5a5a5a5-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'aaaa3333-3333-3333-3333-333333333333',
    'LinkedIn', null, '#', null, null, null, null, 2, '{}'),
  ('a6a6a6a6-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'aaaa3333-3333-3333-3333-333333333333',
    'Notes', null, '#', null, null, null, null, 3, '{}'),

  -- Quick links grid
  ('b1b1b1b1-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'bbbb1111-1111-1111-1111-111111111111',
    'Portfolio', 'Latest builds and experiments.', '#', null, 'Work', null, null, 1, '{}'),
  ('b2b2b2b2-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'bbbb1111-1111-1111-1111-111111111111',
    'Writing', 'Notes, essays, and process.', '#', null, 'Notes', null, null, 2, '{}'),
  ('b3b3b3b3-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'bbbb1111-1111-1111-1111-111111111111',
    'Contact', 'Email or schedule a chat.', '#', null, 'Contact', null, null, 3, '{}'),
  ('b4b4b4b4-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'bbbb1111-1111-1111-1111-111111111111',
    'CV', 'Download a clean PDF.', '#', null, 'CV', null, null, 4, '{}'),

  -- Principles grid
  ('c1c1c1c1-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'cccc1111-1111-1111-1111-111111111111',
    'Default to momentum', 'Bias for small, high-frequency shipping over big, rare drops.', null, null, '▲', null, null, 1, '{}'),
  ('c2c2c2c2-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'cccc1111-1111-1111-1111-111111111111',
    'Clarity > cleverness', 'Write and design so the intent is obvious; polish comes second.', null, null, '✹', null, null, 2, '{}'),
  ('c3c3c3c3-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'cccc1111-1111-1111-1111-111111111111',
    'Systems with soul', 'Build structured things that still feel human and alive.', null, null, '✜', null, null, 3, '{}'),
  ('c4c4c4c4-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'cccc1111-1111-1111-1111-111111111111',
    'Time well-spent', 'Protect depth; welcome boredom; leave space for novelty.', null, null, '✦', null, null, 4, '{}'),

  -- On Repeat scroller
  ('d1d1d1d1-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'dddd1111-1111-1111-1111-111111111111',
    'Track Title — Artist', 'Album or mood note here.', null, null, null, null, 'A1', 1, '{}'),
  ('d2d2d2d2-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'dddd1111-1111-1111-1111-111111111111',
    'Track Title — Artist', 'Album or mood note here.', null, null, null, null, 'B2', 2, '{}'),
  ('d3d3d3d3-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'dddd1111-1111-1111-1111-111111111111',
    'Track Title — Artist', 'Album or mood note here.', null, null, null, null, 'C3', 3, '{}'),

  -- Listening list
  ('e1e1e1e1-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'eeee1111-1111-1111-1111-111111111111',
    'Episode title — Host', 'One-line takeaway or reason to listen.', null, array['design','systems','strategy'], 'EP01', 55, null, 1, '{}'),
  ('e2e2e2e2-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'eeee1111-1111-1111-1111-111111111111',
    'Episode title — Host', 'One-line takeaway or reason to listen.', null, array['culture','sound'], 'EP02', 30, null, 2, '{}'),
  ('e3e3e3e3-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'eeee1111-1111-1111-1111-111111111111',
    'Book Title — Author', 'Why this matters or how it changed your view.', null, array['nonfiction','craft'], 'BK01', null, null, 3, '{}'),
  ('e4e4e4e4-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'eeee1111-1111-1111-1111-111111111111',
    'Book Title — Author', 'Why this matters or how it changed your view.', null, array['fiction','imagination'], 'BK02', null, null, 4, '{}'),

  -- Favourite spots
  ('f1f1f1f1-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'ffff1111-1111-1111-1111-111111111111',
    'Studio nook', 'Quiet mornings, soft light, good pens.', null, null, 'Work', null, null, 1, '{}'),
  ('f2f2f2f2-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 'ffff1111-1111-1111-1111-111111111111',
    'Late-night café', 'Hum of conversation and synth playlists.', null, null, 'Cafe', null, null, 2, '{}'),
  ('f3f3f3f3-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 'ffff1111-1111-1111-1111-111111111111',
    'Gallery loop', 'A monthly tour to reset the eye.', null, null, 'Inspo', null, null, 3, '{}'),
  ('f4f4f4f4-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666666', 'ffff1111-1111-1111-1111-111111111111',
    'Walking route', 'A quiet circuit for thinking days.', null, null, 'Slow', null, null, 4, '{}')
on conflict (id) do update
set title = excluded.title,
    subtitle = excluded.subtitle,
    url = excluded.url,
    tags = excluded.tags,
    badge = excluded.badge,
    progress = excluded.progress,
    cover_label = excluded.cover_label,
    sort_order = excluded.sort_order,
    meta = excluded.meta;

-- Seed chapters from pages
insert into chapters (id, slug, title, subtitle, description, order_index, published, updated_at)
select id,
       slug,
       title,
       subtitle,
       description,
       sort_order,
       is_published,
       updated_at
from pages
on conflict (slug) do update
set title = excluded.title,
    subtitle = excluded.subtitle,
    description = excluded.description,
    order_index = excluded.order_index,
    published = excluded.published,
    updated_at = excluded.updated_at;

-- Seed chapter statements from sections
insert into chapter_items (id, chapter_id, type, title, body, meta, order_index, published, updated_at)
select s.id,
       s.page_id,
       'statement',
       s.heading,
       s.body,
       s.meta,
       s.sort_order,
       p.is_published,
       s.updated_at
from sections s
join pages p on p.id = s.page_id
on conflict (id) do update
set chapter_id = excluded.chapter_id,
    type = excluded.type,
    title = excluded.title,
    body = excluded.body,
    meta = excluded.meta,
    order_index = excluded.order_index,
    published = excluded.published,
    updated_at = excluded.updated_at;

-- Seed chapter items from items
insert into chapter_items (id, chapter_id, type, title, body, url, meta, order_index, published, updated_at)
select i.id,
       i.page_id,
       case
         when s.type = 'card_grid' and p.slug = 'quick-links' then 'link_tile'
         when s.type = 'card_grid' and p.slug = 'principles' then 'principle'
         when s.type = 'card_grid' and p.slug = 'favourite-spots' then 'spot'
         when s.type = 'card_grid' and p.slug = 'about' then 'timeline_event'
         when s.type = 'footer_links' then 'link_tile'
         when s.type = 'mini_card_scroller' then 'repeat_item'
         when s.type = 'list_with_badges' then 'media_item'
         else 'statement'
       end,
       i.title,
       i.subtitle,
       i.url,
       (jsonb_build_object(
          'tags', i.tags,
          'badge', i.badge,
          'progress', i.progress,
          'cover_label', i.cover_label,
          'section_id', i.section_id,
          'section_type', s.type
        ) || coalesce(i.meta, '{}'::jsonb)),
       i.sort_order,
       p.is_published,
       now()
from items i
join pages p on p.id = i.page_id
left join sections s on s.id = i.section_id
on conflict (id) do update
set chapter_id = excluded.chapter_id,
    type = excluded.type,
    title = excluded.title,
    body = excluded.body,
    url = excluded.url,
    meta = excluded.meta,
    order_index = excluded.order_index,
    published = excluded.published,
    updated_at = excluded.updated_at;
