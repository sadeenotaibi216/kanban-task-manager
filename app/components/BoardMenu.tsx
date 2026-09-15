"use client";

import { useState } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const deleteBoardWithId = deleteBoard.bind(null, boardId);

  function handleEdit() {
    setIsMenuOpen(false);
    setIsEditOpen(true);
  }

  return (
    <>
      <div className="absolute right-3 top-3 z-20">
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          ⋯
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-10 z-30 w-48 overflow-hidden rounded-lg border border-slate-700 bg-[#111827] shadow-xl">
            <Link
              href={`/boards/${boardId}`}
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
            >
              Open board
            </Link>

            <button
              type="button"
              onClick={handleEdit}
              className="w-full px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-800"
            >
              Edit board
            </button>

            <form action={deleteBoardWithId}>
              <button
                type="submit"
                className="w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-slate-800"
              >
                Delete board
              </button>
            </form>
          </div>
        )}
      </div>

      <EditBoardModal
        boardId={boardId}
        currentTitle={currentTitle}
        currentDescription={currentDescription}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}
