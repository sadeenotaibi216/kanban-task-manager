"use client";

import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

type DroppableListProps = {
  listId: string;
  children: ReactNode;
};

export default function DroppableList({
  listId,
  children,
}: DroppableListProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: listId,
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-full rounded-xl transition ${
        isOver ? "ring-2 ring-indigo-500" : ""
      }`}
    >
      {children}
    </div>
  );
}
