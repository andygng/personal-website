import { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionRenderer from "@/components/sections/SectionRenderer";
import { fetchMetadataForSlug, fetchPageBySlug } from "@/lib/queries";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const metadata = await fetchMetadataForSlug(params.slug);
  if (!metadata) return { title: "Page not found" };

  return {
    title: metadata.title,
    description: metadata.description ?? undefined,
  };
}

export default async function Page({ params }: PageProps) {
  const pageData = await fetchPageBySlug(params.slug);

  if (!pageData) {
    notFound();
  }

  const { page, sections } = pageData;

  return (
    <div className="space-y-14">
      <div className="fade-up space-y-2" style={{ animationDelay: "0.02s" }}>
        <div className="text-[12px] uppercase tracking-[0.2em] text-[var(--muted)]">
          {page.subtitle ?? "Page"}
        </div>
        <h2
          className="text-3xl font-semibold text-white md:text-[34px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {page.title}
        </h2>
        {page.description && (
          <p className="text-[var(--muted)]">{page.description}</p>
        )}
      </div>

      <SectionRenderer sections={sections} />
    </div>
  );
}
