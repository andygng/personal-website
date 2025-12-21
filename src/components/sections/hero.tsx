import { Markdown } from "@/components/Markdown";
import type { SectionWithItems } from "@/lib/types";

type HeroMeta = {
  kicker?: string;
  chips?: string[];
  cta_primary?: { label: string; href: string };
  cta_secondary?: { label: string; href: string };
  panel_heading?: string;
};

export default function HeroSection({
  section,
  index,
}: {
  section: SectionWithItems;
  index: number;
}) {
  const meta = (section.meta as HeroMeta) ?? {};
  const chips = meta.chips ?? [];
  const panelHeading =
    typeof meta.panel_heading === "string"
      ? meta.panel_heading
      : "Fast snapshot";

  return (
    <section
      className="fade-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="glass-card grid gap-7 border border-[var(--border)] p-8 text-white md:p-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative z-10 space-y-6">
          <div className="text-[12px] uppercase tracking-[0.2em] text-[var(--muted)]">
            {meta.kicker ?? "Currently Placeholder"}
          </div>
          <div className="space-y-4">
            <h1
              className="text-3xl leading-tight md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {section.heading ?? "Designing thoughtful products and playful tools."}
            </h1>
            <Markdown
              content={
                section.body ??
                "A personal corner for notes on craft, principles I lean on, and the media shaping my taste."
              }
              className="text-[15px]"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {meta.cta_primary && meta.cta_primary.label && (
              <a
                href={meta.cta_primary.href || "#"}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-gradient-to-r from-[var(--primary)] to-[#78ffd8] px-4 py-2 text-sm font-bold text-[#062017] shadow-[0_10px_40px_rgba(43,245,199,0.25)] transition hover:-translate-y-[2px]"
              >
                {meta.cta_primary.label}
              </a>
            )}
            {meta.cta_secondary && meta.cta_secondary.label && (
              <a
                href={meta.cta_secondary.href || "#"}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.06)] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-[2px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
              >
                {meta.cta_secondary.label}
              </a>
            )}
          </div>
        </div>

        <div className="relative z-10 rounded-[18px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div
            className="text-xl font-semibold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {panelHeading}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.length > 0
              ? chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[12px] text-[var(--muted)] shadow-inner"
                  >
                    {chip}
                  </span>
                ))
              : ["Based in: Anywhere", "Focus: Product & systems", "Stack: Web / Design / Writing"].map(
                  (chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[12px] text-[var(--muted)] shadow-inner"
                    >
                      {chip}
                    </span>
                  ),
                )}
          </div>
        </div>
      </div>
    </section>
  );
}
