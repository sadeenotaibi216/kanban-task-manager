import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
          <div>
            <span className="mb-4 inline-block rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-300 sm:mb-5 sm:text-sm">
              Task management for small teams
            </span>

            <h1 className="mb-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Plan work in lists.
              <br />
              Move it when
              <br />
              it&apos;s ready.
            </h1>

            <p className="mb-7 max-w-lg text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
              Boards, lists and cards — every move made deliberately through a
              control, so nothing slips out of place by accident.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="w-full rounded-md bg-indigo-600 px-5 py-3 text-center text-sm font-medium transition hover:bg-indigo-500 sm:w-auto"
              >
                Get started
              </Link>

              <Link
                href="/login"
                className="w-full rounded-md border border-slate-600 px-5 py-3 text-center text-sm font-medium transition hover:bg-slate-800 sm:w-auto"
              >
                Log in
              </Link>
            </div>
          </div>

          <div className="relative h-56 overflow-hidden rounded-xl border border-slate-700 bg-[#0f172a] sm:h-64 md:h-72">
            <Image
              src="/log.png"
              alt="TaskFlow preview"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-3">
          <div className="cursor-pointer rounded-xl border border-slate-700 bg-[#0f172a] p-5 transition duration-200 hover:border-indigo-500 hover:bg-slate-800 sm:p-6">
            <h3 className="mb-2 text-lg font-semibold">Boards</h3>

            <p className="text-sm leading-6 text-slate-400">
              One board per project, private to you, deleted clearly when
              you&apos;re done.
            </p>
          </div>

          <div className="cursor-pointer rounded-xl border border-slate-700 bg-[#0f172a] p-5 transition duration-200 hover:border-indigo-500 hover:bg-slate-800 sm:p-6">
            <h3 className="mb-2 text-lg font-semibold">Lists</h3>

            <p className="text-sm leading-6 text-slate-400">
              Ordered columns — rename, reorder and delete them whenever you
              need.
            </p>
          </div>

          <div className="cursor-pointer rounded-xl border border-slate-700 bg-[#0f172a] p-5 transition duration-200 hover:border-indigo-500 hover:bg-slate-800 sm:p-6">
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
