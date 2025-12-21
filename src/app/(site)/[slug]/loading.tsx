export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-6 w-32 rounded bg-[rgba(255,255,255,0.08)]" />
      <div className="h-10 w-64 rounded bg-[rgba(255,255,255,0.1)]" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-32 rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.05)]"
          />
        ))}
      </div>
    </div>
  );
}
