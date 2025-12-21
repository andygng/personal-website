import { Markdown } from "@/components/Markdown";
import type { SectionWithItems } from "@/lib/types";

export default function CardGridSection({
  section,
  index,
}: {
  section: SectionWithItems;
  index: number;
}) {
  const hint =
    typeof section.meta?.hint === "string" ? section.meta.hint : undefined;

  return (
    <section
      className="fade-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="mb-4 text-[12px] uppercase tracking-[0.18em] text-[var(--muted)]">
        {hint ?? section.heading ?? "Section"}
      </div>
      <div className="space-y-4">
        <h3
          className="text-2xl font-semibold text-white md:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {section.heading}
        </h3>
        <Markdown content={section.body} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {section.items.map((item) => (
          <article
            key={item.id}
            className="group relative overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--card)] p-5 transition duration-200 hover:-translate-y-1 hover:border-[rgba(43,245,199,0.35)] hover:shadow-[var(--shadow-glow)]"
          >
            <span className="mb-3 inline-block text-[12px] uppercase tracking-[0.08em] text-[var(--primary)]">
              {item.badge ??
                (typeof item.meta?.tag === "string" ? item.meta.tag : undefined) ??
                "—"}
            </span>
            <h4 className="text-lg font-semibold text-white">{item.title}</h4>
            {item.subtitle && (
              <p className="mt-1 text-[14px] text-[var(--muted)]">
                {item.subtitle}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
