export type ChapterItemType =
  | "entry"
  | "statement"
  | "timeline_event"
  | "link_tile"
  | "principle"
  | "repeat_item"
  | "media_item"
  | "spot";

export type Chapter = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  order_index: number;
  published: boolean;
  theme?: Record<string, unknown> | null;
  updated_at?: string | null;
};

export type ChapterItem = {
  id: string;
  chapter_id: string;
  type: ChapterItemType | string;
  title?: string | null;
  body?: string | null;
  url?: string | null;
  image_url?: string | null;
  meta?: Record<string, unknown> | null;
  order_index?: number | null;
  published: boolean;
  updated_at?: string | null;
};

export type ChapterWithItems = Chapter & { items: ChapterItem[] };
