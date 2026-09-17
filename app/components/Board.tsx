import Link from "next/link";
import BoardMenu from "./BoardMenu";

type BoardProps = {
  board: {
    id: string;
    title: string;
    description: string | null;
    lists: {
      _count: {
        cards: number;
      };
    }[];
  };
};

export default function Board({ board }: BoardProps) {
  const cardCount = board.lists.reduce(
    (total, list) => total + list._count.cards,
    0
  );

  return (
    <div className="relative flex min-h-[150px] flex-col rounded-xl border border-slate-700 bg-[#0f172a] transition hover:border-indigo-500 sm:min-h-[160px]">
      <BoardMenu
        boardId={board.id}
        currentTitle={board.title}
        currentDescription={board.description ?? ""}
      />

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
          <p className="mt-2 text-sm text-slate-600">No description</p>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">
            {board.lists.length} {board.lists.length === 1 ? "list" : "lists"}
          </span>

          <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">
            {cardCount} {cardCount === 1 ? "card" : "cards"}
          </span>
        </div>
      </Link>
    </div>
  );
}
