"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Markdown } from "@/components/Markdown";
import type { ChapterItem, ChapterWithItems } from "@/lib/types";

type EditorialHomeProps = {
  chapters: ChapterWithItems[];
};

type HeroMeta = {
  kicker?: string;
  chips?: string[];
  cta_primary?: { label?: string; href?: string };
  cta_secondary?: { label?: string; href?: string };
};

type ChapterTheme = {
  glow: string;
  line: string;
};

const chapterThemes: Record<string, ChapterTheme> = {
  about: {
    glow: "rgba(43, 245, 199, 0.18)",
    line: "#2bf5c7",
  },
  "quick-links": {
    glow: "rgba(255, 124, 107, 0.18)",
    line: "#ff7c6b",
  },
  principles: {
    glow: "rgba(244, 208, 111, 0.2)",
    line: "#f4d06f",
  },
  "on-repeat": {
    glow: "rgba(92, 200, 255, 0.2)",
    line: "#5cc8ff",
  },
  listening: {
    glow: "rgba(111, 224, 161, 0.18)",
    line: "#6fe0a1",
  },
  "favourite-spots": {
    glow: "rgba(255, 205, 125, 0.2)",
    line: "#ffcd7d",
  },
};

const defaultTheme: ChapterTheme = {
  glow: "rgba(255, 255, 255, 0.08)",
  line: "rgba(255, 255, 255, 0.35)",
};

const sortByOrder = (a: ChapterItem, b: ChapterItem) =>
  (a.order_index ?? 0) - (b.order_index ?? 0);

const getMeta = (item: ChapterItem) =>
  (item.meta ?? {}) as Record<string, unknown>;

const getString = (value: unknown) =>
  typeof value === "string" ? value : undefined;

const getNumber = (value: unknown) =>
  typeof value === "number" ? value : undefined;

const getStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];

export default function EditorialHome({ chapters }: EditorialHomeProps) {
  const [activeChapter, setActiveChapter] = useState(
    chapters[0]?.slug ?? "",
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

  if (!chapters.length) {
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
          "fixed top-6 left-1/2 z-20 w-[min(92vw,740px)] -translate-x-1/2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(5,7,13,0.72)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--muted)] backdrop-blur transition duration-300",
          showIndex
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-3",
        )}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() => scrollToChapter(chapter.slug)}
              className={clsx(
                "rounded-full border border-transparent px-3 py-1 text-[10px] font-semibold tracking-[0.32em] transition",
                activeChapter === chapter.slug
                  ? "border-[rgba(255,255,255,0.25)] text-white"
                  : "text-[var(--muted)] hover:text-white",
              )}
            >
              {chapter.title}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed right-5 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-3">
        {chapters.map((chapter) => (
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
        {chapters.map((chapter, index) => {
          const theme = chapterThemes[chapter.slug] ?? defaultTheme;
          const items = (chapter.items ?? []).filter(
            (item) => item.published !== false,
          );
          const statementItems = items
            .filter((item) => item.type === "statement")
            .sort(sortByOrder);
          const introItem = statementItems[0];

          const nextChapter = chapters[index + 1] ?? chapters[0] ?? chapter;
          const isLast = index === chapters.length - 1;

          return (
            <section
              key={chapter.id}
              id={chapter.slug}
              data-chapter={chapter.slug}
              className="chapter-shell snap-start px-6 py-16 sm:px-10 lg:px-16"
              style={{
                "--chapter-glow": theme.glow,
                "--chapter-line": theme.line,
              } as CSSProperties}
            >
              <div className="relative z-10 mx-auto flex min-h-[90vh] w-full max-w-6xl flex-col justify-center">
                {chapter.slug === "about" ? (
                  <AboutChapter
                    chapter={chapter}
                    index={index}
                    introItem={introItem}
                    items={items}
                  />
                ) : chapter.slug === "quick-links" ? (
                  <QuickLinksChapter
                    chapter={chapter}
                    index={index}
                    introItem={introItem}
                    items={items}
                  />
                ) : chapter.slug === "principles" ? (
                  <PrinciplesChapter
                    chapter={chapter}
                    index={index}
                    introItem={introItem}
                    items={items}
                  />
                ) : chapter.slug === "on-repeat" ? (
                  <OnRepeatChapter
                    chapter={chapter}
                    index={index}
                    introItem={introItem}
                    items={items}
                  />
                ) : chapter.slug === "listening" ? (
                  <ListeningChapter
                    chapter={chapter}
                    index={index}
                    introItem={introItem}
                    items={items}
                  />
                ) : (
                  <SpotsChapter
                    chapter={chapter}
                    index={index}
                    introItem={introItem}
                    items={items}
                  />
                )}

                <div className="mt-10 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                  <span>Chapter {String(index + 1).padStart(2, "0")}</span>
                  <button
                    type="button"
                    onClick={() => scrollToChapter(nextChapter.slug)}
                    className="group inline-flex items-center gap-3 rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-[10px] font-semibold text-white transition hover:border-[rgba(255,255,255,0.35)]"
                  >
                    {isLast ? "Back to start" : "Next chapter"}
                    <span className="text-[9px] text-[var(--muted)]">
                      {nextChapter.title}
                    </span>
                  </button>
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

function ChapterHeading({
  title,
  subtitle,
  description,
  index,
}: {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  index: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.36em] text-[var(--muted)]">
        <span>{subtitle ?? "Chapter"}</span>
        <span className="h-px w-10 bg-[var(--chapter-line)]" />
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h2
        className="text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[1.05] text-white"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-[15px] text-[var(--muted)] md:text-[17px]">
          {description}
        </p>
      )}
    </div>
  );
}

function AboutChapter({
  chapter,
  index,
  introItem,
  items,
}: {
  chapter: ChapterWithItems;
  index: number;
  introItem?: ChapterItem;
  items: ChapterItem[];
}) {
  const heroMeta = (introItem?.meta ?? {}) as HeroMeta;
  const chips = Array.isArray(heroMeta.chips) ? heroMeta.chips : [];

  const highlights = items
    .filter((item) => item.type === "timeline_event")
    .sort(sortByOrder);

  const links = items
    .filter((item) => item.type === "link_tile")
    .sort(sortByOrder);

  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-8">
        <ChapterHeading
          title={chapter.title}
          subtitle={chapter.subtitle}
          description={chapter.description}
          index={index}
        />

        {introItem && (
          <div className="rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.04)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="text-[11px] uppercase tracking-[0.3em] text-[var(--muted)]">
              {heroMeta.kicker ?? "Editorial note"}
            </div>
            {introItem.title && (
              <h3
                className="mt-4 text-2xl font-semibold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {introItem.title}
              </h3>
            )}
            <Markdown content={introItem.body} className="mt-3 text-[15px]" />

            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.05)] px-3 py-1 text-[11px] text-[var(--muted)]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              {heroMeta.cta_primary?.label && (
                <a
                  href={heroMeta.cta_primary.href || "#"}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-gradient-to-r from-[var(--primary)] to-[#78ffd8] px-4 py-2 text-xs font-semibold text-[#062017] transition hover:-translate-y-[2px]"
                >
                  {heroMeta.cta_primary.label}
                </a>
              )}
              {heroMeta.cta_secondary?.label && (
                <a
                  href={heroMeta.cta_secondary.href || "#"}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-xs font-semibold text-white transition hover:-translate-y-[2px]"
                >
                  {heroMeta.cta_secondary.label}
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {highlights.map((item) => {
            const meta = getMeta(item);
            const badge = getString(meta.badge) ?? "Highlight";

            return (
              <article
                key={item.id}
                className="rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5"
              >
                <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--chapter-line)]">
                  {badge}
                </div>
                {item.title && (
                  <h4
                    className="mt-3 text-lg font-semibold text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.title}
                  </h4>
                )}
                {item.body && (
                  <p className="mt-2 text-[13px] text-[var(--muted)]">
                    {item.body}
                  </p>
                )}
              </article>
            );
          })}
        </div>

        {links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {links.map((item) => (
              <a
                key={item.id}
                href={item.url ?? "#"}
                className="rounded-full border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white transition hover:border-[rgba(255,255,255,0.35)]"
              >
                {item.title ?? "Link"}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function QuickLinksChapter({
  chapter,
  index,
  introItem,
  items,
}: {
  chapter: ChapterWithItems;
  index: number;
  introItem?: ChapterItem;
  items: ChapterItem[];
}) {
  const linkItems = items
    .filter((item) => item.type === "link_tile")
    .sort(sortByOrder);

  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <ChapterHeading
          title={chapter.title}
          subtitle={chapter.subtitle}
          description={chapter.description}
          index={index}
        />
        {(introItem?.title || introItem?.body) && (
          <div className="rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5">
            {introItem?.title && (
              <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                {introItem.title}
              </div>
            )}
            <Markdown content={introItem.body} className="text-[15px]" />
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {linkItems.map((item) => {
          const meta = getMeta(item);
          const badge = getString(meta.badge);
          const href = item.url ?? "#";
          const isExternal = href.startsWith("http");

          return (
            <a
              key={item.id}
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer" : undefined}
              className="group rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5 transition hover:-translate-y-1 hover:border-[rgba(255,255,255,0.4)]"
            >
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
                <span>{badge ?? "Link"}</span>
                <span className="text-[var(--chapter-line)]">Open</span>
              </div>
              {item.title && (
                <h4
                  className="mt-4 text-lg font-semibold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h4>
              )}
              {item.body && (
                <p className="mt-2 text-[13px] text-[var(--muted)]">
                  {item.body}
                </p>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}

function PrinciplesChapter({
  chapter,
  index,
  introItem,
  items,
}: {
  chapter: ChapterWithItems;
  index: number;
  introItem?: ChapterItem;
  items: ChapterItem[];
}) {
  const principleItems = items
    .filter((item) => item.type === "principle")
    .sort(sortByOrder);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-6">
        <ChapterHeading
          title={chapter.title}
          subtitle={chapter.subtitle}
          description={chapter.description}
          index={index}
        />
        {(introItem?.title || introItem?.body) && (
          <div className="rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5">
            {introItem?.title && (
              <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                {introItem.title}
              </div>
            )}
            <Markdown content={introItem.body} className="text-[15px]" />
          </div>
        )}
      </div>

      <div className="space-y-4">
        {principleItems.map((item, itemIndex) => {
          const meta = getMeta(item);
          const badge = getString(meta.badge) ??
            String(itemIndex + 1).padStart(2, "0");

          return (
            <article
              key={item.id}
              className="rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full border border-[rgba(255,255,255,0.2)] px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-[var(--chapter-line)]">
                  {badge}
                </div>
                <div>
                  {item.title && (
                    <h4
                      className="text-lg font-semibold text-white"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.title}
                    </h4>
                  )}
                  {item.body && (
                    <p className="mt-2 text-[13px] text-[var(--muted)]">
                      {item.body}
                    </p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function OnRepeatChapter({
  chapter,
  index,
  introItem,
  items,
}: {
  chapter: ChapterWithItems;
  index: number;
  introItem?: ChapterItem;
  items: ChapterItem[];
}) {
  const repeatItems = items
    .filter((item) => item.type === "repeat_item")
    .sort(sortByOrder);

  return (
    <div className="space-y-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <ChapterHeading
            title={chapter.title}
            subtitle={chapter.subtitle}
            description={chapter.description}
            index={index}
          />
        </div>
        {(introItem?.title || introItem?.body) && (
          <div className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-6">
            {introItem?.title && (
              <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                {introItem.title}
              </div>
            )}
            <Markdown content={introItem.body} className="text-[15px]" />
          </div>
        )}
      </div>

      <div className="grid auto-cols-[minmax(220px,1fr)] grid-flow-col gap-4 overflow-x-auto pb-4">
        {repeatItems.map((item) => {
          const meta = getMeta(item);
          const coverLabel = getString(meta.cover_label) ??
            getString(meta.badge) ??
            "SIDE";

          return (
            <article
              key={item.id}
              className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5"
            >
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.26em] text-[var(--muted)]">
                <span>{coverLabel}</span>
                <span className="text-[var(--chapter-line)]">Loop</span>
              </div>
              {item.title && (
                <h4
                  className="mt-6 text-lg font-semibold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h4>
              )}
              {item.body && (
                <p className="mt-2 text-[13px] text-[var(--muted)]">
                  {item.body}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ListeningChapter({
  chapter,
  index,
  introItem,
  items,
}: {
  chapter: ChapterWithItems;
  index: number;
  introItem?: ChapterItem;
  items: ChapterItem[];
}) {
  const mediaItems = items
    .filter((item) => item.type === "media_item")
    .sort(sortByOrder);

  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <ChapterHeading
          title={chapter.title}
          subtitle={chapter.subtitle}
          description={chapter.description}
          index={index}
        />
        {(introItem?.title || introItem?.body) && (
          <div className="rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5">
            {introItem?.title && (
              <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                {introItem.title}
              </div>
            )}
            <Markdown content={introItem.body} className="text-[15px]" />
          </div>
        )}
      </div>

      <div className="space-y-4">
        {mediaItems.map((item) => {
          const meta = getMeta(item);
          const badge = getString(meta.badge) ?? "NOW";
          const progress = getNumber(meta.progress);
          const tags = getStringArray(meta.tags);

          return (
            <article
              key={item.id}
              className="rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5"
            >
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                <span>{badge}</span>
                {typeof progress === "number" && (
                  <span>{Math.min(Math.max(progress, 0), 100)}%</span>
                )}
              </div>
              {item.title && (
                <h4
                  className="mt-3 text-lg font-semibold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h4>
              )}
              {item.body && (
                <p className="mt-2 text-[13px] text-[var(--muted)]">
                  {item.body}
                </p>
              )}
              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[11px] text-[var(--muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {typeof progress === "number" && (
                <div className="mt-4 h-1.5 w-full rounded-full bg-[rgba(255,255,255,0.08)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--primary)]"
                    style={{
                      width: `${Math.min(Math.max(progress, 0), 100)}%`,
                    }}
                  />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function SpotsChapter({
  chapter,
  index,
  introItem,
  items,
}: {
  chapter: ChapterWithItems;
  index: number;
  introItem?: ChapterItem;
  items: ChapterItem[];
}) {
  const spotItems = items
    .filter((item) => item.type === "spot")
    .sort(sortByOrder);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-6">
        <ChapterHeading
          title={chapter.title}
          subtitle={chapter.subtitle}
          description={chapter.description}
          index={index}
        />
        {(introItem?.title || introItem?.body) && (
          <div className="rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5">
            {introItem?.title && (
              <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                {introItem.title}
              </div>
            )}
            <Markdown content={introItem.body} className="text-[15px]" />
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {spotItems.map((item) => {
          const meta = getMeta(item);
          const badge = getString(meta.badge) ?? "Spot";

          return (
            <article
              key={item.id}
              className="rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5"
            >
              <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--chapter-line)]">
                {badge}
              </div>
              {item.title && (
                <h4
                  className="mt-4 text-lg font-semibold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h4>
              )}
              {item.body && (
                <p className="mt-2 text-[13px] text-[var(--muted)]">
                  {item.body}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
