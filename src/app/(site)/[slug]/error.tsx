"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] p-6 text-white">
      <h2 className="text-xl font-semibold">Something went wrong.</h2>
      <p className="mt-2 text-[var(--muted)]">
        {error.message || "We couldn’t load this page right now."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.06)] px-4 py-2 text-sm font-semibold transition hover:border-[rgba(255,255,255,0.18)]"
      >
        Try again
      </button>
    </div>
  );
}
