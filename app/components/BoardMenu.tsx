"use client";

import { useRef } from "react";
import Link from "next/link";
import { deleteBoard } from "@/app/actions/boards";
import EditBoardModal from "./EditBoardModal";

type BoardMenuProps = {
  boardId: string;
  currentTitle: string;
  currentDescription: string;
};

export default function BoardMenu({
  boardId,
  currentTitle,
  currentDescription,
}: BoardMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  function closeMenu() {
    detailsRef.current?.removeAttribute("open");
  }

  const deleteBoardWithId = deleteBoard.bind(null, boardId);

  return (
    <details
      ref={detailsRef}
      className="absolute right-3 top-3 z-20 sm:right-4 sm:top-4"
    >
      <summary className="cursor-pointer list-none rounded-md px-2 py-1 text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white">
        ...
      </summary>

      <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-lg border border-slate-700 bg-[#111827] shadow-xl sm:w-52">
        <Link
          href={`/boards/${boardId}`}
          onClick={closeMenu}
          className="block px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
        >
          Open board
        </Link>

        <EditBoardModal
          boardId={boardId}
          currentTitle={currentTitle}
          currentDescription={currentDescription}
          closeMenu={closeMenu}
        />

        <form action={deleteBoardWithId}>
          <button
            type="submit"
            onClick={closeMenu}
            className="w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-slate-800"
          >
            Delete board
          </button>
        </form>
      </div>
    </details>
  );
}
