import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

import NewListModal from "@/app/components/NewListModal";
import EditBoardModal from "@/app/components/EditBoardModal";
import KanbanBoard from "@/app/components/KanbanBoard";

type BoardPageProps = {
  params: Promise<{
    boardId: string;
  }>;
};

export default async function BoardPage({ params }: BoardPageProps) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const email = session.user.email;
  const { boardId } = await params;

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

  let board;

  try {
    board = await prisma.board.findFirst({
      where: {
        id: boardId,
        userId: user.id,
      },
      include: {
        lists: {
          include: {
            cards: {
              orderBy: {
                position: "asc",
              },
            },
            _count: {
              select: {
                cards: true,
              },
            },
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });
  } catch {
    return (
      <main className="min-h-screen bg-[#020617] px-4 py-6 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
            Failed to load this board. Please try again.
          </div>
        </div>
      </main>
    );
  }

  if (!board) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <p className="mb-2 wrap-break-word text-sm text-indigo-400">
              Boards / {board.title}
            </p>

            <h1 className="wrap-break-word text-2xl font-bold sm:text-3xl">
              {board.title}
            </h1>

            {board.description ? (
              <p className="mt-2 max-w-3xl wrap-break-word text-sm text-slate-400 sm:text-base">
                {board.description}
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No description yet.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 sm:flex-nowrap">
            <EditBoardModal
              boardId={board.id}
              currentTitle={board.title}
              currentDescription={board.description ?? ""}
              buttonText="Edit board"
              buttonClassName="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            />

            <NewListModal boardId={board.id} />
          </div>
        </div>

        {board.lists.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-slate-700 p-6 text-center sm:mt-12 sm:p-10">
            <h2 className="text-lg font-semibold sm:text-xl">
              This board has no lists
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Create your first list to start organizing tasks.
            </p>

            <div className="mt-6 flex justify-center">
              <NewListModal boardId={board.id} />
            </div>
          </div>
        ) : (
          <KanbanBoard boardId={board.id} initialLists={board.lists} />
        )}
      </div>
    </main>
  );
}
