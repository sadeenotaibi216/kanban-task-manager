"use client";

import { useDraggable } from "@dnd-kit/core";
import { ReactNode } from "react";

type DraggableCardProps = {
  cardId: string;
  children: ReactNode;
};

export default function DraggableCard({
  cardId,
  children,
}: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: cardId,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.02)`
      : undefined,

    zIndex: isDragging ? 50 : undefined,

    position: "relative" as const,

    boxShadow: isDragging ? "0 12px 30px rgba(0, 0, 0, 0.35)" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={isDragging ? "cursor-grabbing" : "cursor-pointer"}
    >
      {children}
    </div>
  );
}
