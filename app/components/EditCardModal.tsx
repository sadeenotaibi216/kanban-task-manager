"use client";

import { useState } from "react";
import { deletecard, updatecard } from "@/app/actions/cards";

type ListOption = {
  id: string;
  title: string;
  cardCount: number;
};

type EditCardModalProps = {
  cardId: string;
  currentTitle: string;
  currentDescription: string;
  currentListId: string;
  currentPosition: number;
  lists: ListOption[];
};

export default function EditCardModal({
  cardId,
  currentTitle,
  currentDescription,
  currentListId,
  currentPosition,
  lists,
}: EditCardModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedListId, setSelectedListId] = useState(currentListId);

  const [selectedPosition, setSelectedPosition] = useState(currentPosition);

  const updateCardWithId = updatecard.bind(null, cardId);
  const deleteCardWithId = deletecard.bind(null, cardId);

  const selectedList = lists.find((list) => list.id === selectedListId);

  const maxPosition =
    selectedListId === currentListId
      ? selectedList?.cardCount || 1
      : (selectedList?.cardCount || 0) + 1;

  async function handleUpdate(formData: FormData) {
    await updateCardWithId(formData);

    setIsOpen(false);
  }

  async function handleDelete() {
    await deleteCardWithId();

    setIsOpen(false);
  }

  function handleOpen() {
    setSelectedListId(currentListId);
    setSelectedPosition(currentPosition);
    setIsOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-left shadow-sm transition hover:border-indigo-500"
      >
        <p className="wrap-break-word text-sm text-slate-200">{currentTitle}</p>

        {currentDescription && (
          <p className="mt-1 wrap-break-word text-xs text-slate-500">
            {currentDescription}
          </p>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Edit card</h2>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-2xl text-slate-400 transition hover:text-white"
              >
                ×
              </button>
            </div>

            <form action={handleUpdate}>
              <div className="mt-6">
                <label className="mb-2 block text-sm text-slate-300">
                  Title
                </label>

                <input
                  name="title"
                  type="text"
                  defaultValue={currentTitle}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm text-slate-300">
                  Description
                  <span className="ml-1 text-slate-500">optional</span>
                </label>

                <textarea
                  name="description"
                  defaultValue={currentDescription}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    List
                    <span className="ml-1 text-slate-500">
                      — moves the card
                    </span>
                  </label>

                  <select
                    name="listId"
                    value={selectedListId}
                    onChange={(e) => {
                      const newListId = e.target.value;

                      setSelectedListId(newListId);

                      const newList = lists.find(
                        (list) => list.id === newListId
                      );

                      if (!newList) {
                        return;
                      }

                      if (newListId === currentListId) {
                        setSelectedPosition(currentPosition);
                      } else {
                        setSelectedPosition(newList.cardCount + 1);
                      }
                    }}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
                  >
                    {lists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Position
                  </label>

                  <select
                    name="position"
                    value={selectedPosition}
                    onChange={(e) =>
                      setSelectedPosition(Number(e.target.value))
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
                  >
                    {Array.from({ length: maxPosition }, (_, index) => {
                      const position = index + 1;

                      return (
                        <option key={position} value={position}>
                          {position}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-left text-sm font-medium text-red-400 hover:text-red-300"
                >
                  Delete card...
                </button>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
