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
    <main className="min-h-screen bg-[#020617] px-6 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Boards</h1>

            <p className="mt-2 text-sm text-slate-400">
              {boards.length} {boards.length === 1 ? "board" : "boards"}
            </p>
          </div>

          <NewBoardButton />
        </div>

        {params.message === "no-changes" && (
          <div className="mt-6 rounded-md border border-amber-800 bg-amber-950/40 p-4 text-sm text-amber-300">
            Board information wasn&apos;t updated because there were no changes
            made.
          </div>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => {
            const deleteBoardWithId = deleteBoard.bind(null, board.id);

            const cardCount = board.lists.reduce(
              (total, list) => total + list._count.cards,
              0,
            );

            return (
              <div
                key={board.id}
                className="relative flex min-h-[160px] flex-col rounded-xl border border-slate-700 bg-[#0f172a] transition hover:border-indigo-500"
              >
                <details className="absolute right-4 top-4 z-10">
                  <summary className="cursor-pointer list-none rounded-md px-2 py-1 text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white">
                    ...
                  </summary>

                  <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-lg border border-slate-700 bg-[#111827] shadow-xl">
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
                  className="flex flex-1 flex-col p-6 pr-16"
                >
                  <h2 className="break-words text-lg font-semibold">
                    {board.title}
                  </h2>

                  {board.description ? (
                    <p className="mt-2 line-clamp-2 break-all text-sm leading-6 text-slate-400">
                      {board.description}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-slate-600">
                      No description
                    </p>
                  )}

                  <div className="mt-auto flex gap-2 pt-4">
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
