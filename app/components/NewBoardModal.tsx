"use client";

import { useActionState, useState } from "react";
import { createBoard } from "@/app/actions/boards";

export default function NewBoardModal() {
  const [isOpen, setIsOpen] = useState(false);

  const initialState = {
    message: "",
  };

  const [state, formAction, loading] = useActionState(
    createBoard,
    initialState
  );

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="flex min-h-[150px] w-full items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#0f172a] text-sm font-medium text-indigo-400 transition hover:border-indigo-500 hover:bg-slate-900 sm:min-h-[160px]"
      >
        + Create new board
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-md rounded-xl border border-slate-700 bg-[#111827] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Create board</h2>

              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="text-xl text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Board title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  disabled={loading}
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {state.message && (
                <p className="text-sm text-red-400">{state.message}</p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="w-full rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
