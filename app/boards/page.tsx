import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import NewBoardModal from "../components/NewBoardModal";
import NewBoardButton from "../components/NewBoardButton";
import EditBoardModal from "../components/EditBoardModal";
import { deleteBoard } from "@/app/actions/boards";

type BoardsPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function BoardsPage({ searchParams }: BoardsPageProps) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const params = await searchParams;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const boards = await prisma.board.findMany({
    where: {
      userId: user.id,
    },
    include: {
      lists: {
        include: {
          _count: {
            select: {
              cards: true,
            },
          },
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Your Boards</h1>

            <p className="mt-2 text-sm text-slate-400">
              {boards.length} {boards.length === 1 ? "board" : "boards"}
            </p>
          </div>

          <div className="self-start">
            <NewBoardButton />
          </div>
        </div>

        {params.message === "no-changes" && (
          <div className="mt-6 rounded-md border border-amber-800 bg-amber-950/40 p-4 text-sm text-amber-300">
            Board information wasn&apos;t updated because there were no changes
            made.
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {boards.map((board) => {
            const deleteBoardWithId = deleteBoard.bind(null, board.id);

            const cardCount = board.lists.reduce(
              (total, list) => total + list._count.cards,
              0
            );

            return (
              <div
                key={board.id}
                className="relative flex min-h-[150px] flex-col rounded-xl border border-slate-700 bg-[#0f172a] transition hover:border-indigo-500 sm:min-h-[160px]"
              >
                <details className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
                  <summary className="cursor-pointer list-none rounded-md px-2 py-1 text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white">
                    ...
                  </summary>

                  <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-slate-700 bg-[#111827] shadow-xl sm:w-52">
                    <Link
                      href={`/boards/${board.id}`}
                      className="block px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
                    >
                      Open board
                    </Link>

                    <EditBoardModal
                      boardId={board.id}
                      currentTitle={board.title}
                      currentDescription={board.description ?? ""}
                    />

                    <form action={deleteBoardWithId}>
                      <button
                        type="submit"
                        className="w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-slate-800"
                      >
                        Delete board
                      </button>
                    </form>
                  </div>
                </details>

                <Link
                  href={`/boards/${board.id}`}
                  className="flex flex-1 flex-col p-5 pr-14 sm:p-6 sm:pr-16"
                >
                  <h2 className="break-words text-base font-semibold sm:text-lg">
                    {board.title}
                  </h2>

                  {board.description ? (
                    <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-slate-400">
                      {board.description}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-slate-600">
                      No description
                    </p>
                  )}

                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">
                      {board.lists.length}{" "}
                      {board.lists.length === 1 ? "list" : "lists"}
                    </span>

                    <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">
                      {cardCount} {cardCount === 1 ? "card" : "cards"}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}

          <NewBoardModal />
        </div>
      </div>
    </main>
  );
}
