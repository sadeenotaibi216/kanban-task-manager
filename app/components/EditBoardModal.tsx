"use client";

import { useActionState, useState } from "react";
import { updateBoard } from "@/app/actions/boards";

type EditBoardModalProps = {
  boardId: string;
  currentTitle: string;
  currentDescription: string;
  buttonText?: string;
  buttonClassName?: string;
  closeMenu?: () => void;
};

type UpdateBoardState = {
  message: string;
  success: boolean;
};

export default function EditBoardModal({
  boardId,
  currentTitle,
  currentDescription,
  buttonText = "Edit board",
  buttonClassName = "",
  closeMenu,
}: EditBoardModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateBoardWithId = updateBoard.bind(null, boardId);

  const initialState: UpdateBoardState = {
    message: "",
    success: false,
  };

  async function editBoardAction(
    previousState: UpdateBoardState,
    formData: FormData
  ): Promise<UpdateBoardState> {
    const result = await updateBoardWithId(previousState, formData);

    if (result.success) {
      setIsOpen(false);
      closeMenu?.();
    }

    return result;
  }

  const [state, formAction, loading] = useActionState(
    editBoardAction,
    initialState
  );

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    if (!loading) {
      setIsOpen(false);
      closeMenu?.();
    }
  }

  return (
    <>
      <button type="button" onClick={handleOpen} className={buttonClassName}>
        {buttonText}
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
              <h2 className="text-xl font-semibold text-white">Edit board</h2>

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
                  defaultValue={currentTitle}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
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
                  defaultValue={currentDescription}
                  rows={4}
                  disabled={loading}
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {state.message && (
                <p className="text-sm text-red-400">{state.message}</p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
