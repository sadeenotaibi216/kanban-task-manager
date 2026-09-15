import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

import NewListModal from "@/app/components/NewListModal";
import AddListCard from "@/app/components/AddListCard";
import EditBoardModal from "@/app/components/EditBoardModal";
import ListMenu from "@/app/components/ListMenu";
import AddCard from "@/app/components/AddCard";

type BoardPageProps = {
  params: Promise<{
    boardId: string;
  }>;

  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function BoardPage({
  params,
  searchParams,
}: BoardPageProps) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { boardId } = await params;
  const pageParams = await searchParams;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const board = await prisma.board.findFirst({
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

        {pageParams.message === "no-list-changes" && (
          <div className="mt-6 rounded-md border border-amber-800 bg-amber-950/40 p-4 text-sm text-amber-300">
            No changes to save.
          </div>
        )}

        {pageParams.message === "no-card-changes" && (
          <div className="mt-6 rounded-md border border-amber-800 bg-amber-950/40 p-4 text-sm text-amber-300">
            No changes to save.
          </div>
        )}

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
          <div className="mt-8 grid grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-10 lg:grid-cols-3">
            {board.lists.map((list, index) => {
              const isFirstList = index === 0;
              const isLastList = index === board.lists.length - 1;

              return (
                <div
                  key={list.id}
                  className="relative w-full min-w-0 rounded-xl border border-slate-800 bg-[#0f172a] p-4 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3 pr-8">
                    <div className="flex min-w-0 items-center gap-2">
                      <h2 className="wrap-break-word font-semibold text-slate-100">
                        {list.title}
                      </h2>

                      <span className="shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                        {list._count.cards}
                      </span>
                    </div>

                    <ListMenu
                      listId={list.id}
                      currentTitle={list.title}
                      isFirstList={isFirstList}
                      isLastList={isLastList}
                    />
                  </div>

                  {list.cards.length === 0 ? (
                    <div className="mt-4 rounded-lg bg-slate-900/40 px-4 py-5 text-center">
                      <p className="text-sm text-slate-500">No cards yet</p>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-2">
                      {list.cards.map((card) => (
                        <div
                          key={card.id}
                          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 shadow-sm transition hover:border-slate-600"
                        >
                          <p className="wrap-break-word text-sm text-slate-200">
                            {card.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <AddCard listId={list.id} />
                </div>
              );
            })}

            <AddListCard boardId={board.id} />
          </div>
        )}
      </div>
    </main>
  );
}
