"use client";

import { updateList } from "@/app/actions/lists";

type EditListModalProps = {
  listId: string;
  currentTitle: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function EditListModal({
  listId,
  currentTitle,
  isOpen,
  onClose,
}: EditListModalProps) {
  const updateListWithId = updateList.bind(null, listId);

  async function handleUpdate(formData: FormData) {
    await updateListWithId(formData);
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
          <h2 className="text-xl font-semibold text-white">Edit list</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-slate-400 transition hover:text-white"
          >
            ×
          </button>
        </div>

        <form action={handleUpdate} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              List title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              defaultValue={currentTitle}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none transition focus:border-slate-500"
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
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
