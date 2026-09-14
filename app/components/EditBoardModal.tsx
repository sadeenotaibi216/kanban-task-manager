"use client";

import { useState } from "react";
import { updateBoard } from "@/app/actions/boards";

type EditBoardModalProps = {
  boardId: string;
  currentTitle: string;
  currentDescription: string;
};

export default function EditBoardModal({
  boardId,
  currentTitle,
  currentDescription,
}: EditBoardModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateBoardWithId = updateBoard.bind(null, boardId);

  async function handleUpdate(formData: FormData) {
    await updateBoardWithId(formData);

    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-800"
      >
        Edit title & description
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-[#0f172a] p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white">
              Edit board
            </h2>

            <form
              action={handleUpdate}
              className="mt-6 space-y-4"
            >
              <div>
                <label
                  htmlFor={`title-${boardId}`}
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Title
                </label>

                <input
                  id={`title-${boardId}`}
                  name="title"
                  type="text"
                  defaultValue={currentTitle}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-[#020617] px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor={`description-${boardId}`}
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Description
                </label>

                <textarea
                  id={`description-${boardId}`}
                  name="description"
                  defaultValue={currentDescription}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-slate-700 bg-[#020617] px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}