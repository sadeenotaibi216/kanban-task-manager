import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import NewBoardModal from "../components/NewBoardModal";
import { deleteBoard } from "@/app/actions/boards";

export default async function BoardsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

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
    orderBy: {
      title: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div>
          <h1 className="text-3xl font-bold">Your Boards</h1>

          <p className="mt-2 text-sm text-slate-400">
            {boards.length} {boards.length === 1 ? "board" : "boards"}
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => {
            const deleteBoardWithId = deleteBoard.bind(null, board.id);

            return (
              <div
                key={board.id}
                className="flex min-h-[160px] flex-col rounded-xl border border-slate-700 bg-[#0f172a] transition hover:border-indigo-500"
              >
                <Link
                  href={`/boards/${board.id}`}
                  className="flex flex-1 flex-col p-6"
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
                </Link>

                <div className="border-t border-slate-800 px-6 py-3">
                  <form action={deleteBoardWithId}>
                    <button
                      type="submit"
                      className="text-sm font-medium text-red-400 transition hover:text-red-300"
                    >
                      Delete board
                    </button>
                  </form>
                </div>
              </div>
            );
          })}

          <NewBoardModal />
        </div>
      </div>
    </main>
  );
}
