import { createServerSupabaseClient } from "./supabase/server";
import {
  Item,
  Page,
  PageWithContent,
  Section,
  SectionWithItems,
} from "./types";

export async function fetchNavPages(): Promise<Page[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("pages")
    .select("id, slug, title, subtitle, description, sort_order, is_published")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchPageBySlug(
  slug: string,
): Promise<PageWithContent | null> {
  const supabase = await createServerSupabaseClient();

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (pageError) {
    if (pageError.code === "PGRST116") {
      return null;
    }
    throw pageError;
  }

  const { data: sections, error: sectionsError } = await supabase
    .from("sections")
    .select("*")
    .eq("page_id", page.id)
    .order("sort_order", { ascending: true })
    .order("heading", { ascending: true, nullsFirst: true });

  if (sectionsError) {
    throw sectionsError;
  }

  const { data: items, error: itemsError } = await supabase
    .from("items")
    .select("*")
    .eq("page_id", page.id)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true, nullsFirst: true });

  if (itemsError) {
    throw itemsError;
  }

  const sectionLookup: Record<string, Item[]> = {};
  (sections ?? []).forEach((section) => {
    sectionLookup[section.id] = [];
  });

  (items ?? []).forEach((item) => {
    const bucket = item.section_id && sectionLookup[item.section_id];
    if (bucket) {
      bucket.push(item);
    }
  });

  const sectionsWithItems: SectionWithItems[] = (sections ?? []).map(
    (section: Section) => ({
      ...section,
      items: sectionLookup[section.id] ?? [],
    }),
  );

  return {
    page,
    sections: sectionsWithItems,
  };
}

export async function fetchMetadataForSlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("pages")
    .select("title, description")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data;
}
