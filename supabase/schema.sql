-- Enable extensions for UUID generation
create extension if not exists "pgcrypto";

create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,
  sort_order int default 0,
  is_published boolean default false,
  updated_at timestamptz default now()
);

create table if not exists sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages (id) on delete cascade,
  type text not null check (type in ('hero','card_grid','mini_card_scroller','list_with_badges','footer_links')),
  heading text,
  body text,
  sort_order int default 0,
  meta jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages (id) on delete cascade,
  section_id uuid references sections (id) on delete cascade,
  title text not null,
  subtitle text,
  url text,
  tags text[],
  badge text,
  progress int,
  cover_label text,
  sort_order int default 0,
  meta jsonb default '{}'::jsonb
);

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
  type text not null check (
    type in (
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

create index if not exists idx_pages_sort on pages (sort_order);
create index if not exists idx_sections_page_sort on sections (page_id, sort_order);
create index if not exists idx_items_page_sort on items (page_id, sort_order);
create index if not exists idx_chapters_order on chapters (order_index);
create index if not exists idx_chapter_items_chapter_sort on chapter_items (chapter_id, order_index);
create index if not exists idx_chapter_items_type on chapter_items (type);

alter table pages enable row level security;
alter table sections enable row level security;
alter table items enable row level security;
alter table chapters enable row level security;
alter table chapter_items enable row level security;

drop policy if exists "Published pages readable" on pages;
create policy "Published pages readable" on pages
  for select using (is_published = true);

drop policy if exists "Sections readable when page is published" on sections;
create policy "Sections readable when page is published" on sections
  for select using (
    exists (
      select 1 from pages p
      where p.id = sections.page_id
        and p.is_published = true
    )
  );

drop policy if exists "Items readable when page is published" on items;
create policy "Items readable when page is published" on items
  for select using (
    exists (
      select 1 from pages p
      where p.id = items.page_id
        and p.is_published = true
    )
  );

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
