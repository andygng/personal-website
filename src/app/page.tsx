import EditorialHome from "@/components/home/EditorialHome";
import { fetchChaptersWithItems } from "@/lib/queries";

export default async function Home() {
  const chapters = await fetchChaptersWithItems();

  return (
    <div className="relative min-h-screen">
      <div className="noise" aria-hidden />
      <div className="glow-blob" aria-hidden />
      <div className="relative z-10">
        <EditorialHome chapters={chapters} />
      </div>
    </div>
  );
}
