"use client";

import { useState } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const deleteListWithId = deleteList.bind(null, listId);
  const moveLeft = moveList.bind(null, listId, "left");
  const moveRight = moveList.bind(null, listId, "right");

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
            <button
              type="button"
              onClick={handleEdit}
              className="w-full px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-800"
            >
              Edit list
            </button>

            <form action={moveLeft}>
              <button
                type="submit"
                disabled={isFirstList}
                className="w-full px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-600 disabled:hover:bg-transparent"
              >
                Move left
              </button>
            </form>

            <form action={moveRight}>
              <button
                type="submit"
                disabled={isLastList}
                className="w-full px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-600 disabled:hover:bg-transparent"
              >
                Move right
              </button>
            </form>

            <form action={deleteListWithId}>
              <button
                type="submit"
                className="w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-slate-800"
              >
                Delete list
              </button>
            </form>
          </div>
        )}
      </div>

      <EditListModal
        listId={listId}
        currentTitle={currentTitle}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}
