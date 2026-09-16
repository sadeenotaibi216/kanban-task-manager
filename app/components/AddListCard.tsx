"use client";

import { useActionState, useState } from "react";
import { createList } from "@/app/actions/lists";

type AddListCardProps = {
  boardId: string;
};

type CreateListState = {
  message: string;
  success: boolean;
};

export default function AddListCard({ boardId }: AddListCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const createListWithBoardId = createList.bind(null, boardId);

  const initialState: CreateListState = {
    message: "",
    success: false,
  };

  async function createListAction(
    previousState: CreateListState,
    formData: FormData
  ): Promise<CreateListState> {
    const result = await createListWithBoardId(previousState, formData);

    if (result.success) {
      setIsOpen(false);
    }

    return result;
  }

  const [state, formAction, loading] = useActionState(
    createListAction,
    initialState
  );

  function handleClose() {
    if (!loading) {
      setIsOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex min-h-[210px] w-full items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-400 transition hover:border-indigo-500 hover:text-indigo-400"
      >
        Add list
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-md rounded-xl border border-slate-700 bg-[#0f172a] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Add list</h2>

              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="text-xl text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form action={formAction} className="space-y-5">
              <div>
                <label
                  htmlFor="add-list-title"
                  className="mb-2 block text-sm text-slate-300"
                >
                  List title
                </label>

                <input
                  id="add-list-title"
                  type="text"
                  name="title"
                  required
                  autoFocus
                  disabled={loading}
                  placeholder="e.g. To Do"
                  className="w-full rounded-md border border-slate-700 bg-[#020617] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {state.message && (
                <p className="text-sm text-red-400">{state.message}</p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
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
                  {loading ? "Creating..." : "Create list"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
