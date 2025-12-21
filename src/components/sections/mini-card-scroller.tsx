import type { SectionWithItems } from "@/lib/types";

export default function MiniCardScrollerSection({
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
      <div className="mt-5 grid auto-cols-[minmax(220px,1fr)] grid-flow-col gap-4 overflow-x-auto pb-3">
        {section.items.map((item) => (
          <article
            key={item.id}
            className="grid grid-cols-[60px_1fr] items-center gap-3 rounded-[16px] border border-[var(--border)] bg-[var(--card)] p-4 transition hover:-translate-y-1 hover:border-[rgba(43,245,199,0.35)]"
          >
            <div className="grid h-[60px] w-[60px] place-items-center rounded-[14px] border border-[var(--border)] bg-gradient-to-br from-[rgba(43,245,199,0.26)] to-[rgba(255,124,107,0.32)] text-[12px] font-bold text-[#041012]">
              {item.cover_label ?? item.badge ?? "•"}
            </div>
            <div>
              <h4 className="text-[17px] font-semibold text-white">
                {item.title}
              </h4>
              {item.subtitle && (
                <p className="mt-1 text-[var(--muted)] text-sm">{item.subtitle}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
