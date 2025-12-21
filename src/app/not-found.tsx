import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.04)] p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
        <div className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
          Lost the thread
        </div>
        <h1
          className="text-3xl font-semibold text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Page not found
        </h1>
        <p className="text-[var(--muted)]">
          The page you’re looking for isn’t published yet.
        </p>
        <Link
          href="/about"
          className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.05)] px-4 py-2 text-sm font-semibold text-white transition hover:border-[rgba(255,255,255,0.2)]"
        >
          Back to About
        </Link>
      </div>
    </div>
  );
}
