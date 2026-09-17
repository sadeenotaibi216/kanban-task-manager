"use client";

import { useActionState, useState } from "react";
import { createBoard } from "@/app/actions/boards";

export default function NewBoardButton() {
  const [isOpen, setIsOpen] = useState(false);

  const initialState = {
    message: "",
  };

  const [state, formAction, loading] = useActionState(
    createBoard,
    initialState
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
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
                disabled={loading}
                className="text-xl text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form action={formAction} className="space-y-5">
              <div>
                <label
                  htmlFor="new-board-title"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Title
                </label>

                <input
                  id="new-board-title"
                  type="text"
                  name="title"
                  required
                  disabled={loading}
                  placeholder="e.g. Marketing site"
                  className="w-full rounded-md border border-slate-700 bg-[#020617] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="new-board-description"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Description <span className="text-slate-500">optional</span>
                </label>

                <textarea
                  id="new-board-description"
                  name="description"
                  rows={4}
                  disabled={loading}
                  placeholder="What is this board for?"
                  className="w-full resize-none rounded-md border border-slate-700 bg-[#020617] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {state.message && (
                <p className="text-sm text-red-400">{state.message}</p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="rounded-md border border-slate-600 px-4 py-2 text-sm text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create board"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
