"use client";

import { useState } from "react";
import { createCard } from "@/app/actions/cards";

type AddCardProps = {
  listId: string;
};

export default function AddCard({ listId }: AddCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const createCardWithListId = createCard.bind(null, listId);

  async function handleCreate(formData: FormData) {
    await createCardWithListId(formData);
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition hover:bg-slate-800 hover:text-indigo-400"
      >
        + Add card
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-slate-700 bg-[#0f172a] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Add card</h2>

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
                  htmlFor={`add-card-title-${listId}`}
                  className="mb-2 block text-sm text-slate-300"
                >
                  Card title
                </label>

                <input
                  id={`add-card-title-${listId}`}
                  type="text"
                  name="title"
                  required
                  autoFocus
                  placeholder="e.g. Finish homepage"
                  className="w-full rounded-md border border-slate-700 bg-[#020617] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md border border-slate-600 px-4 py-2 text-sm text-white transition hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                >
                  Create card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
