"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { moveCard } from "@/app/actions/cards";
import BoardList from "@/app/components/BoardList";
import AddListCard from "@/app/components/AddListCard";

type Card = {
  id: string;
  title: string;
  description: string | null;
  position: number;
};

type List = {
  id: string;
  title: string;
  cards: Card[];
  _count: {
    cards: number;
  };
};

type KanbanBoardProps = {
  boardId: string;
  initialLists: List[];
};

export default function KanbanBoard({
  boardId,
  initialLists = [],
}: KanbanBoardProps) {
  const [lists, setLists] = useState<List[]>(initialLists);
  const [moveError, setMoveError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const cardId = active.id.toString();
    const targetListId = over.id.toString();

    setMoveError("");

    const sourceList = lists.find((list) =>
      list.cards.some((card) => card.id === cardId)
    );

    const targetList = lists.find((list) => list.id === targetListId);

    if (!sourceList || !targetList) {
      return;
    }

    if (sourceList.id === targetList.id) {
      return;
    }

    const previousLists = lists;

    setLists((currentLists) => {
      const updatedLists = currentLists.map((list) => ({
        ...list,
        cards: [...list.cards],
        _count: {
          ...list._count,
        },
      }));

      const oldList = updatedLists.find((list) => list.id === sourceList.id);

      const newList = updatedLists.find((list) => list.id === targetList.id);

      if (!oldList || !newList) {
        return currentLists;
      }

      const cardIndex = oldList.cards.findIndex((card) => card.id === cardId);

      if (cardIndex === -1) {
        return currentLists;
      }

      const [movedCard] = oldList.cards.splice(cardIndex, 1);

      oldList.cards = oldList.cards.map((card, index) => ({
        ...card,
        position: index + 1,
      }));

      const movedCardWithNewPosition = {
        ...movedCard,
        position: newList.cards.length + 1,
      };

      newList.cards.push(movedCardWithNewPosition);

      oldList._count.cards = oldList.cards.length;
      newList._count.cards = newList.cards.length;

      return updatedLists;
    });

    try {
      const result = await moveCard(cardId, targetListId);

      if (!result.success) {
        setLists(previousLists);
        setMoveError(result.message || "Failed to move card.");
      }
    } catch {
      setLists(previousLists);
      setMoveError("Failed to move card.");
    }
  }

  const listOptions = lists.map((list) => ({
    id: list.id,
    title: list.title,
    cardCount: list._count.cards,
  }));

  return (
    <>
      {moveError && (
        <div className="mt-6 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {moveError}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragEnd={handleDragEnd}
      >
        <div className="mt-8 grid grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-10 lg:grid-cols-3">
          {lists.map((list, index) => (
            <BoardList
              key={list.id}
              list={list}
              isFirstList={index === 0}
              isLastList={index === lists.length - 1}
              listOptions={listOptions}
            />
          ))}

          <AddListCard boardId={boardId} />
        </div>
      </DndContext>
    </>
  );
}
