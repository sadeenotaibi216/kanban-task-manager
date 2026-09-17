import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NewBoardModal from "../components/NewBoardModal";
import NewBoardButton from "../components/NewBoardButton";
import Board from "../components/Board";

export default async function BoardsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const email = session.user.email;

  let user;

  try {
    user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  } catch {
    return (
      <main className="min-h-screen bg-[#020617] px-4 py-6 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
            Failed to load your account. Please try again.
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    redirect("/login");
  }

  let boards;

  try {
    boards = await prisma.board.findMany({
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
  } catch {
    return (
      <main className="min-h-screen bg-[#020617] px-4 py-6 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
            Failed to load your boards. Please try again.
          </div>
        </div>
      </main>
    );
  }

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
