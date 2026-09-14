"use client";

import { useState } from "react";
import { updateList } from "@/app/actions/lists";

type EditListModalProps = {
  listId: string;
  currentTitle: string;
  closeMenu: () => void;
};

export default function EditListModal({
  listId,
  currentTitle,
  closeMenu,
}: EditListModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateListWithId = updateList.bind(null, listId);

  async function handleUpdate(formData: FormData) {
    closeMenu();

    await updateListWithId(formData);

    setIsOpen(false);
  }

  function handleCancel() {
    setIsOpen(false);
    closeMenu();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-800"
      >
        Edit list
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6 sm:px-6">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-[#0f172a] p-4 shadow-xl sm:p-6">
            <div className="mb-5 flex items-center justify-between sm:mb-6">
              <h2 className="text-lg font-semibold text-white sm:text-xl">
                Edit list
              </h2>

              <button
                type="button"
                onClick={handleCancel}
                className="text-xl text-slate-400 transition hover:text-white"
              >
                ×
              </button>
            </div>

            <form action={handleUpdate} className="space-y-5">
              <div>
                <label
                  htmlFor={`list-title-${listId}`}
                  className="mb-2 block text-sm text-slate-300"
                >
                  List title
                </label>

                <input
                  id={`list-title-${listId}`}
                  type="text"
                  name="title"
                  required
                  defaultValue={currentTitle}
                  className="w-full rounded-md border border-slate-700 bg-[#020617] px-3 py-2.5 text-white outline-none focus:border-indigo-500 sm:px-4 sm:py-3"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full rounded-md px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 sm:w-auto"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
