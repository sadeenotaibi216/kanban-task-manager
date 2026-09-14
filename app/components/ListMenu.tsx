"use client";

import { useRef } from "react";
import { deleteList, moveList } from "@/app/actions/lists";
import EditListModal from "./EditListModal";

type ListMenuProps = {
  listId: string;
  currentTitle: string;
  isFirstList: boolean;
  isLastList: boolean;
};

export default function ListMenu({
  listId,
  currentTitle,
  isFirstList,
  isLastList,
}: ListMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  function closeMenu() {
    detailsRef.current?.removeAttribute("open");
  }

  const moveListLeft = moveList.bind(null, listId, "left");
  const moveListRight = moveList.bind(null, listId, "right");
  const deleteListWithId = deleteList.bind(null, listId);

  return (
    <details ref={detailsRef} className="relative shrink-0">
      <summary className="cursor-pointer list-none rounded-md px-2 py-1 text-slate-400 transition hover:bg-slate-800 hover:text-white">
        ...
      </summary>

      <div className="absolute right-0 z-20 mt-2 w-48 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-slate-700 bg-[#111827] shadow-xl sm:w-52">
        <EditListModal
          listId={listId}
          currentTitle={currentTitle}
          closeMenu={closeMenu}
        />

        <form action={moveListLeft}>
          <button
            type="submit"
            disabled={isFirstList}
            onClick={closeMenu}
            className={`w-full px-4 py-3 text-left text-sm transition ${
              isFirstList
                ? "cursor-not-allowed text-slate-600"
                : "text-slate-200 hover:bg-slate-800"
            }`}
          >
            Move left
          </button>
        </form>

        <form action={moveListRight}>
          <button
            type="submit"
            disabled={isLastList}
            onClick={closeMenu}
            className={`w-full px-4 py-3 text-left text-sm transition ${
              isLastList
                ? "cursor-not-allowed text-slate-600"
                : "text-slate-200 hover:bg-slate-800"
            }`}
          >
            Move right
          </button>
        </form>

        <form action={deleteListWithId}>
          <button
            type="submit"
            onClick={closeMenu}
            className="w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-slate-800"
          >
            Delete list...
          </button>
        </form>
      </div>
    </details>
  );
}
