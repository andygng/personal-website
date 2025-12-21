export type SectionType =
  | "hero"
  | "card_grid"
  | "mini_card_scroller"
  | "list_with_badges"
  | "footer_links";

export type Page = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  sort_order: number;
  is_published: boolean;
  updated_at?: string | null;
};

export type Section = {
  id: string;
  page_id: string;
  type: SectionType;
  heading?: string | null;
  body?: string | null;
  sort_order?: number | null;
  meta?: Record<string, unknown> | null;
  updated_at?: string | null;
};

export type Item = {
  id: string;
  page_id: string;
  section_id?: string | null;
  title: string;
  subtitle?: string | null;
  url?: string | null;
  tags?: string[] | null;
  badge?: string | null;
  progress?: number | null;
  cover_label?: string | null;
  sort_order?: number | null;
  meta?: Record<string, unknown> | null;
};

export type SectionWithItems = Section & { items: Item[] };

export type PageWithContent = {
  page: Page;
  sections: SectionWithItems[];
};
