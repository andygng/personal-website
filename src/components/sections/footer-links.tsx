import Link from "next/link";
import type { SectionWithItems } from "@/lib/types";

export default function FooterLinksSection({
  section,
  index,
}: {
  section: SectionWithItems;
  index: number;
}) {
  return (
    <footer
      className="fade-up mt-16 border-t border-[var(--border)] pt-6"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex flex-col gap-4 text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <div>
          {section.heading && (
            <div
              className="text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {section.heading}
            </div>
          )}
          {section.body && <p className="text-sm">{section.body}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {section.items.map((item) => {
            const href = item.url ?? "#";
            const isExternal = href?.startsWith("http");

            return (
              <Link
                key={item.id}
                href={href}
                className="bubble-link rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-sm text-white transition hover:border-[rgba(255,255,255,0.18)]"
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
