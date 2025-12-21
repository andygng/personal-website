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

create index if not exists idx_pages_sort on pages (sort_order);
create index if not exists idx_sections_page_sort on sections (page_id, sort_order);
create index if not exists idx_items_page_sort on items (page_id, sort_order);

alter table pages enable row level security;
alter table sections enable row level security;
alter table items enable row level security;

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
