"use client";

import { useState } from "react";
import { createBoard } from "@/app/actions/boards";

export default function NewBoardModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex min-h-[160px] w-full items-center justify-center rounded-xl border border-dashed border-indigo-500 text-sm font-medium text-indigo-400 transition hover:bg-indigo-500/5 hover:text-indigo-300"
      >
        New board
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-[#0f172a] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">New board</h2>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xl text-slate-400 transition hover:text-white"
              >
                ×
              </button>
            </div>

            <form action={createBoard} className="space-y-5">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Title
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Marketing site"
                  className="w-full rounded-md border border-slate-700 bg-[#020617] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Description <span className="text-slate-500">optional</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="What is this board for?"
                  className="w-full resize-none rounded-md border border-slate-700 bg-[#020617] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
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
                  Create board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
