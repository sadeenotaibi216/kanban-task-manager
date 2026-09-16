"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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

  const router = useRouter();

  const [isOpening, startTransition] = useTransition();

  function handleOpenBoard() {
    startTransition(() => {
      router.push(`/boards/${boardId}`);
    });
  }

  const deleteBoardWithId = deleteBoard.bind(null, boardId);

  const initialState = {
    message: "",
  };

  const [state, formAction, loading] = useActionState(
    deleteBoardWithId,
    initialState
  );

  return (
    <div className="absolute right-3 top-3 z-20">
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        ⋯
      </button>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="absolute right-0 top-10 z-30 w-48 overflow-hidden rounded-lg border border-slate-700 bg-[#111827] shadow-xl">
            <button
              type="button"
              onClick={handleOpenBoard}
              disabled={isOpening}
              className="block w-full px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOpening ? "Opening..." : "Open board"}
            </button>

            <EditBoardModal
              boardId={boardId}
              currentTitle={currentTitle}
              currentDescription={currentDescription}
              buttonText="Edit board"
              buttonClassName="w-full px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-800"
              closeMenu={() => setIsMenuOpen(false)}
            />

            <form action={formAction}>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete board"}
              </button>
            </form>

            {state.message && (
              <p className="px-4 py-2 text-xs text-red-400">{state.message}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
