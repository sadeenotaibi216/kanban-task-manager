"use client";

import { createCard } from "@/app/actions/cards";

type NewCardModalProps = {
  listId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function NewCardModal({
  listId,
  isOpen,
  onClose,
}: NewCardModalProps) {
  const createCardWithListId = createCard.bind(null, listId);

  async function handleCreate(formData: FormData) {
    await createCardWithListId(formData);
    onClose();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-700 bg-[#111827] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Create card</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-slate-400 transition hover:text-white"
          >
            ×
          </button>
        </div>

        <form action={handleCreate} className="space-y-4">
          <div>
            <label
              htmlFor={`card-title-${listId}`}
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Card title
            </label>

            <input
              id={`card-title-${listId}`}
              name="title"
              type="text"
              placeholder="Enter card title"
              required
              autoFocus
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              Create card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
