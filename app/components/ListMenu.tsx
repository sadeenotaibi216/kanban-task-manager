"use client";

import { useState } from "react";
import { deleteList } from "@/app/actions/lists";
import EditListModal from "./EditListModal";

type ListMenuProps = {
  listId: string;
  currentTitle: string;
};

export default function ListMenu({ listId, currentTitle }: ListMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const deleteListWithId = deleteList.bind(null, listId);

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
