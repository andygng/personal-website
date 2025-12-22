import type { SectionWithItems } from "@/lib/types";

export default function ListWithBadgesSection({
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
      <div className="space-y-3">
        <h3
          className="text-2xl font-semibold text-white md:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {section.heading}
        </h3>
        {section.body && (
          <p className="text-[var(--muted)]">{section.body}</p>
        )}
      </div>

      <div className="mt-5 grid gap-3">
        {section.items.map((item) => {
          const progress = item.progress ?? item.meta?.progress;
          const tags = item.tags ?? (item.meta?.tags as string[] | undefined);

          return (
            <article
              key={item.id}
              className="grid grid-cols-[70px_1fr] items-center gap-3 rounded-[18px] border border-[var(--border)] bg-[var(--card)] p-4 md:p-5"
            >
              <div className="grid h-[70px] w-[70px] place-items-center rounded-[16px] border border-[var(--border)] bg-[radial-gradient(circle_at_30%_30%,rgba(255,124,107,0.45),rgba(43,245,199,0.35))] text-[13px] font-bold text-[#031012]">
                {item.badge ?? "•"}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">
                  {item.title}
                </h4>
                {item.subtitle && (
                  <p className="mt-1 text-[14px] text-[var(--muted)]">
                    {item.subtitle}
                  </p>
                )}
                {tags && tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="bubble-link rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.06)] px-3 py-1 text-[12px] text-[var(--muted)] transition"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {typeof progress === "number" && (
                  <div className="mt-3 h-1.5 w-full rounded-full bg-[rgba(255,255,255,0.08)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--primary)]"
                      style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
