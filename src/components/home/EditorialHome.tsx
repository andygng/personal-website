"use client";

import clsx from "clsx";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
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

const chapterPhotos: Record<string, string> = {
  about: "/photos/about.avif",
  principles: "/photos/principles.avif",
  "on-repeat": "/photos/on-repeat.avif",
  listening: "/photos/listening.avif",
  "favourite-spots": "/photos/places.avif",
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

type SpotIconKey = "restaurant" | "cafe" | "bar" | "default";

const normalizeSpotType = (value?: string) =>
  value
    ? value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z]/g, "")
    : "";

const resolveSpotIconKey = (placeType?: string): SpotIconKey => {
  const normalized = normalizeSpotType(placeType);

  if (!normalized) return "default";
  if (normalized.includes("cafe")) return "cafe";
  if (normalized.includes("bar")) return "bar";
  if (normalized.includes("restaurant") || normalized.includes("food")) {
    return "restaurant";
  }
  return "default";
};

const spotIconData: Record<
  SpotIconKey,
  { label: string; path: ReactNode }
> = {
  restaurant: {
    label: "Food",
    path: (
      <>
        <path d="M6 3v8" />
        <path d="M4 3v5" />
        <path d="M8 3v5" />
        <path d="M6 11v10" />
        <path d="M15 3v18" />
      </>
    ),
  },
  cafe: {
    label: "Cafe",
    path: (
      <>
        <path d="M6 9h8v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" />
        <path d="M14 10h2a2 2 0 0 1 0 4h-2" />
        <path d="M6 19h10" />
      </>
    ),
  },
  bar: {
    label: "Bar",
    path: (
      <>
        <path d="M6 5h12l-6 7z" />
        <path d="M12 12v7" />
        <path d="M9 19h6" />
      </>
    ),
  },
  default: {
    label: "Spot",
    path: (
      <>
        <path d="M12 21c4-4 6-6.7 6-10a6 6 0 1 0-12 0c0 3.3 2 6 6 10z" />
        <circle cx="12" cy="11" r="2.5" />
      </>
    ),
  },
};

type SpotTypeIconProps = {
  placeType?: string;
};

function SpotTypeIcon({ placeType }: SpotTypeIconProps) {
  const key = resolveSpotIconKey(placeType);
  const icon = spotIconData[key];

  return (
    <span className="spot-icon" title={icon.label}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {icon.path}
      </svg>
      <span className="sr-only">{icon.label}</span>
    </span>
  );
}

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

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-5">
      <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] sm:text-[11px]">
            Filter spots
          </p>
          <p className="mt-2 text-[11px] text-[var(--muted)] sm:text-xs">
            {filteredItems.length} of {spotItems.length} places
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <label className="flex flex-col gap-2 text-[9px] uppercase tracking-[0.3em] text-[var(--muted)] sm:text-[10px]">
            City
            <select
              value={activeCity}
              onChange={(event) => setActiveCity(event.target.value)}
              className="min-w-[140px] rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[13px] text-white sm:min-w-[160px] sm:text-sm"
            >
              <option value="all">All cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-[9px] uppercase tracking-[0.3em] text-[var(--muted)] sm:text-[10px]">
            Type
            <select
              value={activeType}
              onChange={(event) => setActiveType(event.target.value)}
              className="min-w-[140px] rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[13px] text-white sm:min-w-[160px] sm:text-sm"
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

      <div className="spot-scroll mt-3 max-h-[62vh] overflow-y-auto py-2 pr-3 sm:mt-4 sm:max-h-[58vh]">
        {filteredItems.length === 0 ? (
          <p className="text-[13px] italic text-[var(--muted)] sm:text-sm">
            No spots match these filters yet.
          </p>
        ) : (
          <div className="spot-table text-[13px] sm:text-sm">
            <div className="spot-header">
              <span>Type</span>
              <span>Name</span>
              <span>City</span>
            </div>
            <ul className="spot-rows">
              {filteredItems.map((item) => {
                const title = item.title?.trim() || "Untitled";
                const { city, placeType } = getSpotMeta(item);
                const href = item.url ?? "";
                const isExternal = href.startsWith("http");

                return (
                  <li key={item.id} className="spot-row">
                    <div className="spot-type">
                      <SpotTypeIcon placeType={placeType} />
                    </div>
                    <div className="spot-name">
                      {href ? (
                        <a
                          href={href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noreferrer" : undefined}
                        >
                          {title}
                        </a>
                      ) : (
                        <span>{title}</span>
                      )}
                    </div>
                    <div className="spot-city">{city || "-"}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
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
    options?: {
      allowDetails?: boolean;
      linkEntireItem?: boolean;
      showBody?: boolean;
    },
  ) => {
    const allowDetails = options?.allowDetails ?? true;
    const linkEntireItem = options?.linkEntireItem ?? false;
    const showBody = options?.showBody ?? false;

    return (
      <div className="space-y-2 sm:space-y-3">
        {items.map((item, itemIndex) => {
          const body = item.body;
          const hasDetails = allowDetails && Boolean(body || item.url);
          const title = item.title ?? "Untitled";

          if (linkEntireItem) {
            const href = item.url ?? "";
            const isExternal = href.startsWith("http");
            const content = (
              <>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] sm:text-[11px]">
                  {String(itemIndex + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <span className="block text-[15px] font-semibold text-white sm:text-base">
                    {title}
                  </span>
                  {showBody && body && (
                    <span className="mt-1 block text-[13px] text-[var(--muted)] sm:text-sm">
                      {body}
                    </span>
                  )}
                </div>
              </>
            );

            if (href) {
              return (
                <a
                  key={item.id}
                  href={href}
                  className="bubble-link flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-3 py-3 transition hover:border-[rgba(255,255,255,0.35)] sm:px-4 sm:py-4"
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
                className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-3 py-3 sm:px-4 sm:py-4"
              >
                {content}
              </div>
            );
          }

          if (!hasDetails) {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-3 py-3 sm:px-4 sm:py-4"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] sm:text-[11px]">
                  {String(itemIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px] font-semibold text-white sm:text-base">
                  {title}
                </span>
              </div>
            );
          }

          return (
            <details
              key={item.id}
              className="group rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-3 sm:px-4"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-3 sm:py-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] sm:text-[11px]">
                  {String(itemIndex + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[15px] font-semibold text-white sm:text-base">
                  {title}
                </span>
                <span className="text-[10px] uppercase tracking-[0.28em] text-[var(--muted)] transition group-open:text-white sm:text-[11px]">
                  View
                </span>
              </summary>
              <div className="pb-3 pr-5 pl-6 text-[13px] text-[var(--muted)] sm:pb-4 sm:pr-6 sm:pl-8 sm:text-[14px]">
                {body && (
                  <Markdown content={body} className="text-[13px] sm:text-sm" />
                )}
                {item.url && (
                  <a
                    href={item.url}
                    className="mt-3 inline-flex text-[10px] uppercase tracking-[0.28em] text-white sm:text-[11px]"
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
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {items.map((item) => {
          const href = item.url ?? "#";
          const isExternal = href.startsWith("http");

          return (
            <a
              key={item.id}
              href={href}
              className="bubble-link rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white transition hover:border-[rgba(255,255,255,0.35)] sm:px-4 sm:py-2 sm:text-[11px]"
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
    <div className="relative overflow-x-hidden">
      <div
        className={clsx(
          "fixed left-1/2 z-30 w-[min(92vw,680px)] -translate-x-1/2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(5,7,13,0.72)] px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-[var(--muted)] backdrop-blur transition duration-300 top-[calc(env(safe-area-inset-top)+0.75rem)] sm:top-6",
          showIndex
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-3",
        )}
      >
        <div className="no-scrollbar flex flex-wrap items-center justify-start gap-2 overflow-x-hidden px-2 sm:flex-nowrap sm:gap-3 sm:overflow-x-auto">
          {displayChapters.map((chapter, index) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() => scrollToChapter(chapter.slug)}
              className={clsx(
                "bubble-link group flex shrink-0 items-center gap-2 rounded-full border border-transparent px-2.5 py-1 transition sm:px-3",
                activeChapter === chapter.slug
                  ? "border-[rgba(255,255,255,0.25)]"
                  : "hover:border-[rgba(255,255,255,0.2)]",
              )}
            >
              <span
                className={clsx(
                  "text-[9px] font-semibold tracking-[0.32em] sm:text-[10px]",
                  activeChapter === chapter.slug
                    ? "text-white"
                    : "text-[var(--muted)] group-hover:text-white",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={clsx(
                  "whitespace-nowrap text-[8px] font-normal tracking-[0.16em] normal-case sm:text-[9px]",
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

      <div className="fixed left-1/2 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(5,7,13,0.65)] px-3 py-2 backdrop-blur sm:left-auto sm:bottom-auto sm:right-5 sm:top-1/2 sm:flex sm:-translate-x-0 sm:-translate-y-1/2 sm:flex-col sm:gap-3 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
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
                "h-3 w-3 rounded-full border transition sm:h-2.5 sm:w-2.5",
                activeChapter === chapter.slug
                  ? "border-transparent bg-[var(--primary)] shadow-[0_0_0_6px_rgba(43,245,199,0.2)]"
                  : "border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.35)]",
              )}
            />
            <span className="pointer-events-none absolute right-6 translate-y-1 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(5,7,13,0.8)] px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[var(--muted)] opacity-0 transition group-hover:opacity-100 hidden sm:block">
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
          const isActive = activeChapter === chapter.slug;
          const photo = chapterPhotos[chapter.slug];
          const isAbout = chapter.slug === "about";
          const isPrinciples = chapter.slug === "principles";
          const isOnRepeat = chapter.slug === "on-repeat";
          const isListening = chapter.slug === "listening";
          const allowDetails = !(
            isAbout ||
            isPrinciples ||
            isOnRepeat ||
            isListening
          );
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
              className="chapter-shell snap-start flex min-h-[100dvh] items-start px-6 py-12 sm:px-10 sm:py-10 md:items-center lg:px-16 lg:py-12"
              style={{
                "--chapter-glow": theme.glow,
                "--chapter-line": theme.line,
              } as CSSProperties}
            >
              {photo && (
                <div
                  className={clsx("chapter-photo", isActive && "is-active")}
                  aria-hidden="true"
                >
                  <div
                    className="chapter-photo__image"
                    style={{ backgroundImage: `url(${photo})` }}
                  />
                  <div className="chapter-photo__wash" />
                  <div className="chapter-photo__grain" />
                </div>
              )}
              <div
                className={clsx(
                  "relative z-10 mx-auto w-full max-w-6xl",
                  "grid gap-6 sm:gap-8 md:gap-10 lg:gap-16",
                  layout,
                )}
              >
                <div className="flex min-h-0 flex-col justify-start space-y-3 sm:space-y-4 md:min-h-[60vh] md:justify-center md:space-y-6 lg:min-h-[70vh]">
                  <div
                    className="text-[clamp(1.9rem,7vw,3.2rem)] font-semibold text-[var(--chapter-line)] sm:text-[clamp(2.4rem,5vw,4.4rem)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h2
                    className="text-[clamp(1.8rem,7vw,3rem)] font-semibold leading-tight text-white sm:text-[clamp(2.2rem,5vw,4rem)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {chapter.title}
                  </h2>
                  {subheader && (
                    <p className="max-w-xl text-[13px] text-[var(--muted)] sm:text-[15px] md:text-[17px]">
                      {subheader}
                    </p>
                  )}
                </div>

                <div
                  className={clsx(
                    "flex min-h-0 flex-col justify-start md:min-h-[60vh] lg:min-h-[70vh]",
                    isFavouriteSpots ? "lg:justify-start" : "md:justify-center",
                  )}
                >
                  {isMergedAbout ? (
                    <div className="space-y-4 sm:space-y-6">
                      {renderItemList(backgroundItems, { allowDetails })}
                      {renderLinkBubbles(linkItems)}
                    </div>
                  ) : isFavouriteSpots ? (
                    <FavouriteSpotsPanel items={items} theme={chapter.theme} />
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {renderItemList(timelineItems, {
                        allowDetails,
                        linkEntireItem: isOnRepeat || isListening,
                        showBody: isListening,
                      })}
                      {isAbout && renderLinkBubbles(linkTileItems)}
                    </div>
                  )}

                  <div className="mt-8 hidden items-center justify-between text-xs uppercase tracking-[0.3em] text-[var(--muted)] sm:flex">
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
