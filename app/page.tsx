import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto max-w-6xl px-8 py-16">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <span className="mb-5 inline-block rounded-md bg-slate-800 px-3 py-1 text-sm text-slate-300">
              Task management for small teams
            </span>

            <h1 className="mb-5 text-5xl font-bold leading-tight">
              Plan work in lists.
              <br />
              Move it when
              <br />
              it&apos;s ready.
            </h1>

            <p className="mb-7 max-w-lg leading-7 text-slate-400">
              Boards, lists and cards — every move made deliberately through a
              control, so nothing slips out of place by accident.
            </p>

            <div className="flex gap-3">
              <Link
                href="/register"
                className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-medium transition hover:bg-indigo-500"
              >
                Get started
              </Link>

              <Link
                href="/login"
                className="rounded-md border border-slate-600 px-5 py-3 text-sm font-medium transition hover:bg-slate-800"
              >
                Log in
              </Link>
            </div>
          </div>

          <div className="relative h-72 overflow-hidden rounded-xl border border-slate-700 bg-[#0f172a]">
            <Image
              src="/log.png"
              alt="TaskFlow preview"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <div className="cursor-pointer rounded-xl border border-slate-700 bg-[#0f172a] p-6 transition duration-200 hover:border-indigo-500 hover:bg-slate-800">
            <h3 className="mb-2 text-lg font-semibold">Boards</h3>

            <p className="text-sm leading-6 text-slate-400">
              One board per project, private to you, deleted clearly when
              you&apos;re done.
            </p>
          </div>

          <div className="cursor-pointer rounded-xl border border-slate-700 bg-[#0f172a] p-6 transition duration-200 hover:border-indigo-500 hover:bg-slate-800">
            <h3 className="mb-2 text-lg font-semibold">Lists</h3>

            <p className="text-sm leading-6 text-slate-400">
              Ordered columns — rename, reorder and delete them whenever you
              need.
            </p>
          </div>

          <div className="cursor-pointer rounded-xl border border-slate-700 bg-[#0f172a] p-6 transition duration-200 hover:border-indigo-500 hover:bg-slate-800">
            <h3 className="mb-2 text-lg font-semibold">Cards</h3>

            <p className="text-sm leading-6 text-slate-400">
              Create tasks and move them between lists as your work progresses.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
