"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import type { Page } from "@/lib/types";

type SidebarProps = {
  pages: Page[];
};

export default function Sidebar({ pages }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const activeSlug = pathname?.split("/")[1] ?? "";

  const filteredPages = useMemo(() => {
    if (!query.trim()) return pages;
    const lower = query.toLowerCase();
    return pages.filter((page) =>
      `${page.title} ${page.subtitle ?? ""}`.toLowerCase().includes(lower),
    );
  }, [pages, query]);

  return (
    <aside className="relative z-10 w-full border-b border-[rgba(255,255,255,0.08)] bg-[rgba(7,10,18,0.8)] px-4 py-4 backdrop-blur md:px-6 lg:fixed lg:left-0 lg:flex lg:h-screen lg:w-80 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] text-sm font-semibold tracking-wide text-white shadow">
            EA
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">Emerging Atlas</div>
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              Personal Index
            </div>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-xs font-medium text-white transition hover:border-[rgba(255,255,255,0.2)] lg:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="sidebar-nav"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </div>

      <div
        className={clsx(
          "mt-4 space-y-4 lg:mt-8",
          isOpen ? "block" : "hidden lg:block",
        )}
        id="sidebar-nav"
      >
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-2 shadow-sm">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter"
            className="w-full bg-transparent text-sm text-white placeholder:text-[var(--muted)] focus:outline-none"
          />
        </div>

        <nav className="space-y-1">
          {filteredPages.map((page) => {
            const isActive = activeSlug === page.slug;
            return (
              <Link
                key={page.id}
                href={`/${page.slug}`}
                className={clsx(
                  "group flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm transition",
                  isActive
                    ? "border-[rgba(43,245,199,0.4)] bg-[rgba(255,255,255,0.06)] text-white shadow-[0_10px_40px_rgba(43,245,199,0.18)]"
                    : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[var(--muted)] hover:border-[rgba(255,255,255,0.14)] hover:text-white",
                )}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold tracking-tight">
                    {page.title}
                  </span>
                  {page.subtitle && (
                    <span className="text-[12px] text-[var(--muted)]">
                      {page.subtitle}
                    </span>
                  )}
                </div>
                <span
                  className={clsx(
                    "h-2 w-2 rounded-full transition",
                    isActive
                      ? "bg-[var(--primary)] shadow-[0_0_0_6px_rgba(43,245,199,0.15)]"
                      : "bg-[rgba(255,255,255,0.25)] group-hover:bg-[var(--primary)]",
                  )}
                />
              </Link>
            );
          })}
          {filteredPages.length === 0 && (
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-sm text-[var(--muted)]">
              Nothing matches that filter.
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}
