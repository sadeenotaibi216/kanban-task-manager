"use client";

import { useActionState, useState } from "react";
import { deleteList, moveList } from "@/app/actions/lists";
import EditListModal from "./EditListModal";

type ListMenuProps = {
  listId: string;
  currentTitle: string;
  isFirstList: boolean;
  isLastList: boolean;
};

type ListActionState = {
  message: string;
  success: boolean;
};

export default function ListMenu({
  listId,
  currentTitle,
  isFirstList,
  isLastList,
}: ListMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const deleteListWithId = deleteList.bind(null, listId);

  const moveLeftWithId = moveList.bind(null, listId, "left");

  const moveRightWithId = moveList.bind(null, listId, "right");

  const initialState: ListActionState = {
    message: "",
    success: false,
  };

  async function deleteAction(
    previousState: ListActionState,
    formData: FormData
  ): Promise<ListActionState> {
    const result = await deleteListWithId(previousState, formData);

    if (result.success) {
      setIsMenuOpen(false);
    }

    return result;
  }

  const [deleteState, deleteFormAction, deleting] = useActionState(
    deleteAction,
    initialState
  );

  async function moveLeftAction(
    previousState: ListActionState,
    formData: FormData
  ): Promise<ListActionState> {
    const result = await moveLeftWithId(previousState, formData);

    if (result.success) {
      setIsMenuOpen(false);
    }

    return result;
  }

  const [leftState, leftFormAction, movingLeft] = useActionState(
    moveLeftAction,
    initialState
  );

  async function moveRightAction(
    previousState: ListActionState,
    formData: FormData
  ): Promise<ListActionState> {
    const result = await moveRightWithId(previousState, formData);

    if (result.success) {
      setIsMenuOpen(false);
    }

    return result;
  }

  const [rightState, rightFormAction, movingRight] = useActionState(
    moveRightAction,
    initialState
  );

  const isBusy = deleting || movingLeft || movingRight;

  const actionMessage =
    deleteState.message || leftState.message || rightState.message;

  function handleEdit() {
    setIsMenuOpen(false);
    setIsEditOpen(true);
  }

  return (
    <>
      <div className="absolute right-3 top-3 z-20">
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          disabled={isBusy}
          className="flex h-8 w-8 items-center justify-center rounded-md text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          ⋯
        </button>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />

            <div className="absolute right-0 top-10 z-30 w-48 overflow-hidden rounded-lg border border-slate-700 bg-[#111827] shadow-xl">
              <button
                type="button"
                onClick={handleEdit}
                disabled={isBusy}
                className="w-full px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Edit list
              </button>

              <form action={leftFormAction}>
                <button
                  type="submit"
                  disabled={isFirstList || isBusy}
                  className="w-full px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-600 disabled:hover:bg-transparent"
                >
                  {movingLeft ? "Moving..." : "Move left"}
                </button>
              </form>

              <form action={rightFormAction}>
                <button
                  type="submit"
                  disabled={isLastList || isBusy}
                  className="w-full px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-600 disabled:hover:bg-transparent"
                >
                  {movingRight ? "Moving..." : "Move right"}
                </button>
              </form>

              <form action={deleteFormAction}>
                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete list"}
                </button>
              </form>

              {actionMessage && (
                <p className="px-4 py-2 text-xs text-red-400">
                  {actionMessage}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <EditListModal
        listId={listId}
        currentTitle={currentTitle}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}
