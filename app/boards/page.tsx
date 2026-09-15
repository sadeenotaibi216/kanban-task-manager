import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import NewBoardModal from "../components/NewBoardModal";
import NewBoardButton from "../components/NewBoardButton";
import Board from "../components/Board";

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
          {boards.map((board) => (
            <Board key={board.id} board={board} />
          ))}

          <NewBoardModal />
        </div>
      </div>
    </main>
  );
}
