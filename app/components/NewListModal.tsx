"use client";

import { useState } from "react";
import { createList } from "@/app/actions/lists";

type NewListModalProps = {
  boardId: string;
};

export default function NewListModal({ boardId }: NewListModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const createListWithBoardId = createList.bind(null, boardId);

  async function handleCreate(formData: FormData) {
    await createListWithBoardId(formData);

    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
      >
        Add list
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6 sm:px-6">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-[#0f172a] p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between sm:mb-6">
              <h2 className="text-lg font-bold sm:text-xl">Add list</h2>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xl text-slate-400 transition hover:text-white"
              >
                ×
              </button>
            </div>

            <form action={handleCreate} className="space-y-5">
              <div>
                <label
                  htmlFor="list-title"
                  className="mb-2 block text-sm text-slate-300"
                >
                  List title
                </label>

                <input
                  id="list-title"
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. To Do"
                  className="w-full rounded-md border border-slate-700 bg-[#020617] px-3 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 sm:px-4 sm:py-3"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-md border border-slate-600 px-4 py-2 text-sm transition hover:bg-slate-800 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 sm:w-auto"
                >
                  Create list
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
