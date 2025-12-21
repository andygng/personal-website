import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import { fetchNavPages } from "@/lib/queries";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pages = await fetchNavPages();

  return (
    <div className="relative min-h-screen">
      <div className="noise" aria-hidden />
      <div className="glow-blob" aria-hidden />
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <Sidebar pages={pages} />
        <main className="flex-1 px-4 py-10 sm:px-6 lg:ml-80 lg:px-12">
          <div className="mx-auto w-full max-w-5xl space-y-16">{children}</div>
        </main>
      </div>
    </div>
  );
}
