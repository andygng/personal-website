"use client";

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Markdown } from "@/components/Markdown";
import type { ChapterItem, ChapterWithItems } from "@/lib/types";

type EditorialHomeProps = {
  chapters: ChapterWithItems[];
};

type ChapterTheme = {
  glow: string;
  line: string;
};

const chapterThemes: Record<string, ChapterTheme> = {
  about: {
    glow: "rgba(43, 245, 199, 0.12)",
    line: "#2bf5c7",
  },
  "quick-links": {
    glow: "rgba(255, 124, 107, 0.12)",
    line: "#ff7c6b",
  },
  principles: {
    glow: "rgba(244, 208, 111, 0.12)",
    line: "#f4d06f",
  },
  "on-repeat": {
    glow: "rgba(92, 200, 255, 0.12)",
    line: "#5cc8ff",
  },
  listening: {
    glow: "rgba(111, 224, 161, 0.12)",
    line: "#6fe0a1",
  },
  "favourite-spots": {
    glow: "rgba(255, 205, 125, 0.12)",
    line: "#ffcd7d",
  },
};

const defaultTheme: ChapterTheme = {
  glow: "rgba(255, 255, 255, 0.08)",
  line: "rgba(255, 255, 255, 0.4)",
};

const layoutBySlug: Record<string, string> = {
  about: "lg:grid-cols-[1.1fr_0.9fr] items-start",
  "quick-links": "lg:grid-cols-[0.9fr_1.1fr] items-start",
  principles: "lg:grid-cols-[1fr_1fr] items-center",
  "on-repeat": "lg:grid-cols-[0.8fr_1.2fr] items-start",
  listening: "lg:grid-cols-[1fr_1fr] items-start",
  "favourite-spots": "lg:grid-cols-[1fr_1fr] items-start",
};

const sortItems = (items: ChapterItem[]) =>
  items
    .filter((item) => item.published !== false)
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

const isLinkTile = (item: ChapterItem) => item.type === "link_tile";

const getSectionType = (item: ChapterItem) => {
  if (!item.meta || typeof item.meta !== "object") {
    return undefined;
  }
  const value = (item.meta as Record<string, unknown>).section_type;
  return typeof value === "string" ? value : undefined;
};

type SpotFilters = {
  cities: string[];
  types: string[];
};

const getStringValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : undefined;

const getStringList = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter((entry) => entry.length > 0);
};

const getSpotMeta = (item: ChapterItem) => {
  if (!item.meta || typeof item.meta !== "object") {
    return { city: undefined, placeType: undefined };
  }

  const meta = item.meta as Record<string, unknown>;
  const city =
    getStringValue(meta.city) ??
    getStringValue(meta.location) ??
    getStringValue(meta.town);
  const placeType =
    getStringValue(meta.place_type) ??
    getStringValue(meta.placeType) ??
    getStringValue(meta.type) ??
    getStringValue(meta.category);

  return { city, placeType };
};

const getSpotFilters = (
  theme?: Record<string, unknown> | null,
): SpotFilters => {
  if (!theme || typeof theme !== "object") {
    return { cities: [], types: [] };
  }

  const themeRecord = theme as Record<string, unknown>;
  const filters = themeRecord.spots_filters ?? themeRecord.filters;

  if (!filters || typeof filters !== "object") {
    return { cities: [], types: [] };
  }

  const filterRecord = filters as Record<string, unknown>;

  return {
    cities: getStringList(filterRecord.cities),
    types: getStringList(filterRecord.types),
  };
};

const uniqueValues = (values: Array<string | undefined>) => {
  const seen = new Set<string>();
  const result: string[] = [];

  values.forEach((value) => {
    if (!value) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    result.push(trimmed);
  });

  return result;
};

const normalizeFilter = (value: string) => value.trim().toLowerCase();

const buildSpotMarkdown = (items: ChapterItem[]) => {
  if (!items.length) {
    return "_No spots match these filters yet._";
  }

  return items
    .map((item) => {
      const title = item.title?.trim() || "Untitled";
      const { city, placeType } = getSpotMeta(item);
      const details = [city, placeType].filter(Boolean).join(" / ");
      const detailsSuffix = details ? ` - _${details}_` : "";

      if (item.url) {
        return `- [${title}](${item.url})${detailsSuffix}`;
      }

      return `- ${title}${detailsSuffix}`;
    })
    .join("\n");
};

type FavouriteSpotsPanelProps = {
  items: ChapterItem[];
  theme?: Record<string, unknown> | null;
};

function FavouriteSpotsPanel({ items, theme }: FavouriteSpotsPanelProps) {
  const spotItems = useMemo(
    () => items.filter((item) => item.title || item.url),
    [items],
  );

  const { cities: themeCities, types: themeTypes } = useMemo(
    () => getSpotFilters(theme),
    [theme],
  );

  const derivedCities = useMemo(
    () => uniqueValues(spotItems.map((item) => getSpotMeta(item).city)),
    [spotItems],
  );
  const derivedTypes = useMemo(
    () => uniqueValues(spotItems.map((item) => getSpotMeta(item).placeType)),
    [spotItems],
  );

  const cities = themeCities.length ? themeCities : derivedCities;
  const types = themeTypes.length ? themeTypes : derivedTypes;

  const [activeCity, setActiveCity] = useState("all");
  const [activeType, setActiveType] = useState("all");

  useEffect(() => {
    if (
      activeCity !== "all" &&
      !cities.some((city) => normalizeFilter(city) === normalizeFilter(activeCity))
    ) {
      setActiveCity("all");
    }
  }, [activeCity, cities]);

  useEffect(() => {
    if (
      activeType !== "all" &&
      !types.some((type) => normalizeFilter(type) === normalizeFilter(activeType))
    ) {
      setActiveType("all");
    }
  }, [activeType, types]);

  const filteredItems = useMemo(() => {
    return spotItems.filter((item) => {
      const { city, placeType } = getSpotMeta(item);
      const matchesCity =
        activeCity === "all" ||
        (city && normalizeFilter(city) === normalizeFilter(activeCity));
      const matchesType =
        activeType === "all" ||
        (placeType &&
          normalizeFilter(placeType) === normalizeFilter(activeType));

      return matchesCity && matchesType;
    });
  }, [activeCity, activeType, spotItems]);

  const listMarkdown = useMemo(
    () => buildSpotMarkdown(filteredItems),
    [filteredItems],
  );

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--muted)]">
            Filter spots
          </p>
          <p className="mt-2 text-xs text-[var(--muted)]">
            {filteredItems.length} of {spotItems.length} places
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
            City
            <select
              value={activeCity}
              onChange={(event) => setActiveCity(event.target.value)}
              className="min-w-[160px] rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-white"
            >
              <option value="all">All cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
            Type
            <select
              value={activeType}
              onChange={(event) => setActiveType(event.target.value)}
              className="min-w-[160px] rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-white"
            >
              <option value="all">All types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="spot-scroll mt-4 max-h-[58vh] overflow-y-auto py-2 pr-3">
        <Markdown content={listMarkdown} className="spot-list text-sm" />
      </div>
    </div>
  );
}

export default function EditorialHome({ chapters }: EditorialHomeProps) {
  const quickLinksChapter = chapters.find(
    (chapter) => chapter.slug === "quick-links",
  );
  const aboutChapter = chapters.find((chapter) => chapter.slug === "about");
  const shouldMergeQuickLinks = Boolean(quickLinksChapter && aboutChapter);
  const displayChapters = shouldMergeQuickLinks
    ? chapters.filter((chapter) => chapter.slug !== "quick-links")
    : chapters;
  const [activeChapter, setActiveChapter] = useState(
    displayChapters[0]?.slug ?? "",
  );
  const [showIndex, setShowIndex] = useState(false);
  const lastScrollY = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!chapters.length) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-chapter]"),
    );

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = entry.target.getAttribute("data-chapter");
            if (slug) {
              setActiveChapter(slug);
            }
          }
        });
      },
      { threshold: 0.55 },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [chapters]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;

      rafRef.current = window.requestAnimationFrame(() => {
        const current = window.scrollY;
        const delta = current - lastScrollY.current;

        if (Math.abs(delta) > 8) {
          setShowIndex(delta < 0);
          lastScrollY.current = current;
        }

        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToChapter = (slug: string) => {
    const target = document.getElementById(slug);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderItemList = (
    items: ChapterItem[],
    options?: { allowDetails?: boolean; linkEntireItem?: boolean },
  ) => {
    const allowDetails = options?.allowDetails ?? true;
    const linkEntireItem = options?.linkEntireItem ?? false;

    return (
      <div className="space-y-3">
        {items.map((item, itemIndex) => {
          const body = item.body;
          const hasDetails = allowDetails && Boolean(body || item.url);
          const title = item.title ?? "Untitled";

          if (linkEntireItem) {
            const href = item.url ?? "";
            const isExternal = href.startsWith("http");
            const content = (
              <>
                <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--muted)]">
                  {String(itemIndex + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-base font-semibold text-white">
                  {title}
                </span>
              </>
            );

            if (href) {
              return (
                <a
                  key={item.id}
                  href={href}
                  className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-4 transition hover:border-[rgba(255,255,255,0.35)]"
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                >
                  {content}
                </a>
              );
            }

            return (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-4"
              >
                {content}
              </div>
            );
          }

          if (!hasDetails) {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-4"
              >
                <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--muted)]">
                  {String(itemIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-base font-semibold text-white">
                  {title}
                </span>
              </div>
            );
          }

          return (
            <details
              key={item.id}
              className="group rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-4">
                <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--muted)]">
                  {String(itemIndex + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-base font-semibold text-white">
                  {title}
                </span>
                <span className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)] transition group-open:text-white">
                  View
                </span>
              </summary>
              <div className="pb-4 pr-6 pl-8 text-[14px] text-[var(--muted)]">
                {body && <Markdown content={body} className="text-sm" />}
                {item.url && (
                  <a
                    href={item.url}
                    className="mt-3 inline-flex text-[11px] uppercase tracking-[0.28em] text-white"
                  >
                    Open link
                  </a>
                )}
              </div>
            </details>
          );
        })}
      </div>
    );
  };

  const renderLinkBubbles = (items: ChapterItem[]) => {
    if (items.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-3">
        {items.map((item) => {
          const href = item.url ?? "#";
          const isExternal = href.startsWith("http");

          return (
            <a
              key={item.id}
              href={href}
              className="bubble-link rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:border-[rgba(255,255,255,0.35)]"
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer" : undefined}
            >
              {item.title ?? "Link"}
            </a>
          );
        })}
      </div>
    );
  };

  if (!displayChapters.length) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-3xl border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-8 py-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            No chapters yet
          </div>
          <h1
            className="mt-4 text-3xl font-semibold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Add chapters in Supabase
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Publish at least one chapter to populate the editorial scroll.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={clsx(
          "fixed top-6 left-1/2 z-20 w-[min(92vw,680px)] -translate-x-1/2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(5,7,13,0.72)] px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-[var(--muted)] backdrop-blur transition duration-300",
          showIndex
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-3",
        )}
      >
        <div className="no-scrollbar flex items-center justify-start gap-3 overflow-x-auto px-2">
          {displayChapters.map((chapter, index) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() => scrollToChapter(chapter.slug)}
              className={clsx(
                "bubble-link group flex shrink-0 items-center gap-2 rounded-full border border-transparent px-3 py-1 transition",
                activeChapter === chapter.slug
                  ? "border-[rgba(255,255,255,0.25)]"
                  : "hover:border-[rgba(255,255,255,0.2)]",
              )}
            >
              <span
                className={clsx(
                  "text-[10px] font-semibold tracking-[0.32em]",
                  activeChapter === chapter.slug
                    ? "text-white"
                    : "text-[var(--muted)] group-hover:text-white",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={clsx(
                  "whitespace-nowrap text-[9px] font-normal tracking-[0.16em] normal-case",
                  activeChapter === chapter.slug
                    ? "text-[rgba(255,255,255,0.7)]"
                    : "text-[rgba(255,255,255,0.45)] group-hover:text-[rgba(255,255,255,0.7)]",
                )}
              >
                {chapter.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed right-5 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-3">
        {displayChapters.map((chapter) => (
          <button
            key={chapter.slug}
            type="button"
            onClick={() => scrollToChapter(chapter.slug)}
            aria-label={`Jump to ${chapter.title}`}
            className="group relative flex items-center"
          >
            <span
              className={clsx(
                "h-2.5 w-2.5 rounded-full border transition",
                activeChapter === chapter.slug
                  ? "border-transparent bg-[var(--primary)] shadow-[0_0_0_6px_rgba(43,245,199,0.2)]"
                  : "border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.35)]",
              )}
            />
            <span className="pointer-events-none absolute right-6 translate-y-1 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(5,7,13,0.8)] px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[var(--muted)] opacity-0 transition group-hover:opacity-100">
              {chapter.title}
            </span>
          </button>
        ))}
      </div>

      <main className="relative z-10">
        {displayChapters.map((chapter, index) => {
          const theme = chapterThemes[chapter.slug] ?? defaultTheme;
          const items = sortItems(chapter.items ?? []);
          const subheader = chapter.description ?? chapter.subtitle;
          const layout =
            layoutBySlug[chapter.slug] ?? "lg:grid-cols-[1fr_1fr]";
          const nextChapter =
            displayChapters[index + 1] ?? displayChapters[0] ?? chapter;
          const isLast = index === displayChapters.length - 1;
          const isMergedAbout =
            shouldMergeQuickLinks && chapter.slug === "about";
          const isAbout = chapter.slug === "about";
          const isPrinciples = chapter.slug === "principles";
          const isOnRepeat = chapter.slug === "on-repeat";
          const allowDetails = !(isAbout || isPrinciples || isOnRepeat);
          const isFavouriteSpots = chapter.slug === "favourite-spots";
          const linkTileItems = isAbout
            ? items.filter((item) => isLinkTile(item) && item.url)
            : [];
          const timelineItems = isAbout
            ? items.filter((item) => !isLinkTile(item))
            : items;
          let backgroundItems = timelineItems;
          let linkItems: ChapterItem[] = [];

          if (isMergedAbout) {
            const sectionBasedItems = timelineItems.filter((item) => {
              const sectionType = getSectionType(item);
              return sectionType && sectionType !== "footer_links" && !item.url;
            });
            const nonLinkItems = timelineItems.filter((item) => !item.url);
            backgroundItems = sectionBasedItems.length
              ? sectionBasedItems
              : nonLinkItems.length
                ? nonLinkItems
                : timelineItems;

            const quickLinkItems = sortItems(
              quickLinksChapter?.items ?? [],
            ).filter((item) => item.url);
            linkItems = [...quickLinkItems, ...linkTileItems];
            if (linkItems.length === 0) {
              linkItems = timelineItems.filter((item) => item.url);
            }
          }

          return (
            <section
              key={chapter.id}
              id={chapter.slug}
              data-chapter={chapter.slug}
              className="chapter-shell snap-start flex min-h-[100svh] items-center px-6 py-12 sm:px-10 lg:px-16"
              style={{
                "--chapter-glow": theme.glow,
                "--chapter-line": theme.line,
              } as CSSProperties}
            >
              <div className={clsx("mx-auto w-full max-w-6xl", "grid gap-10 lg:gap-16", layout)}>
                <div className="flex min-h-[70vh] flex-col justify-center space-y-6">
                  <div
                    className="text-[clamp(2.4rem,5vw,4.4rem)] font-semibold text-[var(--chapter-line)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h2
                    className="text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-tight text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {chapter.title}
                  </h2>
                  {subheader && (
                    <p className="max-w-xl text-[15px] text-[var(--muted)] md:text-[17px]">
                      {subheader}
                    </p>
                  )}
                </div>

                <div
                  className={clsx(
                    "flex min-h-[70vh] flex-col",
                    isFavouriteSpots ? "justify-start" : "justify-center",
                  )}
                >
                  {isMergedAbout ? (
                    <div className="space-y-6">
                      {renderItemList(backgroundItems, { allowDetails })}
                      {renderLinkBubbles(linkItems)}
                    </div>
                  ) : isFavouriteSpots ? (
                    <FavouriteSpotsPanel items={items} theme={chapter.theme} />
                  ) : (
                    <div className="space-y-6">
                      {renderItemList(timelineItems, {
                        allowDetails,
                        linkEntireItem: isOnRepeat,
                      })}
                      {isAbout && renderLinkBubbles(linkTileItems)}
                    </div>
                  )}

                  <div className="mt-8 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                    <span>Chapter {String(index + 1).padStart(2, "0")}</span>
                    <button
                      type="button"
                      onClick={() => scrollToChapter(nextChapter.slug)}
                      className={clsx(
                        "group inline-flex items-center gap-3 rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-[10px] font-semibold text-white transition hover:border-[rgba(255,255,255,0.35)]",
                        !isPrinciples && "bubble-link",
                      )}
                    >
                      {isLast ? "Back to start" : "Next chapter"}
                      <span className="text-[9px] text-[var(--muted)]">
                        {nextChapter.title}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
