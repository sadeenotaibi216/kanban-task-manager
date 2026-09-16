"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020617] px-4 text-white">
      <div className="w-full max-w-md rounded-xl border border-red-900 bg-[#0f172a] p-6 text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>

        <p className="mt-2 text-sm text-slate-400">
          An unexpected error occurred. Please try again.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium transition hover:bg-indigo-500"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
