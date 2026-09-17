import ListMenu from "@/app/components/ListMenu";
import AddCard from "@/app/components/AddCard";
import EditCardModal from "@/app/components/EditCardModal";
import DraggableCard from "@/app/components/DraggableCard";
import DroppableList from "@/app/components/DroppableList";

type ListOption = {
  id: string;
  title: string;
  cardCount: number;
};

type BoardListProps = {
  list: {
    id: string;
    title: string;
    cards: {
      id: string;
      title: string;
      description: string | null;
      position: number;
    }[];
    _count: {
      cards: number;
    };
  };
  isFirstList: boolean;
  isLastList: boolean;
  listOptions: ListOption[];
};

export default function BoardList({
  list,
  isFirstList,
  isLastList,
  listOptions,
}: BoardListProps) {
  return (
    <DroppableList listId={list.id}>
      <div className="relative flex min-h-[210px] w-full min-w-0 flex-col rounded-xl border border-slate-800 bg-[#0f172a] p-4 shadow-lg">
        <div className="flex items-start justify-between gap-3 pr-8">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="wrap-break-word font-semibold text-slate-100">
              {list.title}
            </h2>

            <span className="shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
              {list._count.cards}
            </span>
          </div>

          <ListMenu
            listId={list.id}
            currentTitle={list.title}
            isFirstList={isFirstList}
            isLastList={isLastList}
          />
        </div>

        {list.cards.length === 0 ? (
          <div className="mt-4 flex min-h-[100px] items-center justify-center rounded-lg bg-slate-900/40 px-4 py-5 text-center">
            <p className="text-sm text-slate-500">No cards yet</p>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {list.cards.map((card) => (
              <DraggableCard key={card.id} cardId={card.id}>
                <EditCardModal
                  cardId={card.id}
                  currentTitle={card.title}
                  currentDescription={card.description ?? ""}
                  currentListId={list.id}
                  currentPosition={card.position}
                  lists={listOptions}
                />
              </DraggableCard>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3">
          <AddCard listId={list.id} />
        </div>
      </div>
    </DroppableList>
  );
}
