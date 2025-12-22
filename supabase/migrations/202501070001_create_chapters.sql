-- Enable extensions for UUID generation
create extension if not exists "pgcrypto";

create table if not exists chapters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,
  order_index int default 0,
  published boolean default true,
  theme jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists chapter_items (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters (id) on delete cascade,
  type text not null default 'entry' check (
    type in (
      'entry',
      'statement',
      'timeline_event',
      'link_tile',
      'principle',
      'repeat_item',
      'media_item',
      'spot'
    )
  ),
  title text,
  body text,
  url text,
  image_url text,
  meta jsonb default '{}'::jsonb,
  order_index int default 0,
  published boolean default true,
  updated_at timestamptz default now()
);

create index if not exists idx_chapters_order on chapters (order_index);
create index if not exists idx_chapter_items_chapter_sort on chapter_items (chapter_id, order_index);
create index if not exists idx_chapter_items_type on chapter_items (type);

alter table chapters enable row level security;
alter table chapter_items enable row level security;

drop policy if exists "Published chapters readable" on chapters;
create policy "Published chapters readable" on chapters
  for select using (published = true);

drop policy if exists "Chapter items readable when chapter is published" on chapter_items;
create policy "Chapter items readable when chapter is published" on chapter_items
  for select using (
    exists (
      select 1 from chapters c
      where c.id = chapter_items.chapter_id
        and c.published = true
    )
  );

-- Migrate existing page data into chapters
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

-- Migrate sections into chapter statements
insert into chapter_items (id, chapter_id, type, title, body, meta, order_index, published, updated_at)
select s.id,
       s.page_id,
       'entry',
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

-- Migrate items into chapter items with chapter-aware types
insert into chapter_items (id, chapter_id, type, title, body, url, meta, order_index, published, updated_at)
select i.id,
       i.page_id,
       'entry',
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
