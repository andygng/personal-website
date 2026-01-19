import { createServerSupabaseClient } from "./supabase/server";
import { Chapter, ChapterItem, ChapterWithItems } from "./types";

export async function fetchChaptersWithItems(): Promise<ChapterWithItems[]> {
  const supabase = await createServerSupabaseClient();
  const { data: chapters, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("published", true)
    .order("order_index", { ascending: true });

  if (error) {
    throw error;
  }

  if (!chapters || chapters.length === 0) {
    return [];
  }

  const { data: items, error: itemsError } = await supabase
    .from("chapter_items")
    .select("*")
    .in(
      "chapter_id",
      chapters.map((chapter) => chapter.id),
    )
    .eq("published", true)
    .order("order_index", { ascending: true })
    .order("title", { ascending: true, nullsFirst: true });

  if (itemsError) {
    throw itemsError;
  }

  const itemLookup: Record<string, ChapterItem[]> = {};
  chapters.forEach((chapter: Chapter) => {
    itemLookup[chapter.id] = [];
  });

  (items ?? []).forEach((item) => {
    if (!itemLookup[item.chapter_id]) {
      itemLookup[item.chapter_id] = [];
    }
    itemLookup[item.chapter_id].push(item);
  });

  return chapters.map((chapter: Chapter) => ({
    ...chapter,
    items: itemLookup[chapter.id] ?? [],
  }));
}
