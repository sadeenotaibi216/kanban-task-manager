"use client";

import { useActionState, useState } from "react";
import { createCard } from "@/app/actions/cards";

type AddCardProps = {
  listId: string;
};

type CreateCardState = {
  message: string;
  success: boolean;
};

export default function AddCard({ listId }: AddCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const createCardWithListId = createCard.bind(null, listId);

  const initialState: CreateCardState = {
    message: "",
    success: false,
  };

  async function createCardAction(
    previousState: CreateCardState,
    formData: FormData
  ): Promise<CreateCardState> {
    const result = await createCardWithListId(previousState, formData);

    if (result.success) {
      setIsOpen(false);
    }

    return result;
  }

  const [state, formAction, loading] = useActionState(
    createCardAction,
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
        className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition hover:bg-slate-800 hover:text-indigo-400"
      >
        + Add card
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
              <h2 className="text-xl font-bold text-white">Add card</h2>

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
                  disabled={loading}
                  placeholder="e.g. Finish homepage"
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
                  {loading ? "Creating..." : "Create card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
