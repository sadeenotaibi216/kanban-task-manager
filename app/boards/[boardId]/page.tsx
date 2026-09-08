import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

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

  const { boardId } = await params;

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
  });

  if (!board) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#020617] px-8 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-sm text-indigo-400">Boards / {board.title}</p>

        <h1 className="text-3xl font-bold">{board.title}</h1>

        {board.description && (
          <p className="mt-2 break-words text-slate-400">{board.description}</p>
        )}

        <div className="mt-12 rounded-xl border border-dashed border-slate-700 p-10 text-center">
          <h2 className="text-xl font-semibold">This board has no lists</h2>

          <p className="mt-2 text-sm text-slate-400">
            Create your first list to start organizing tasks.
          </p>
        </div>
      </div>
    </main>
  );
}
