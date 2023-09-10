import { Draggable, DraggableProvided, Droppable } from '@hello-pangea/dnd';
import { Card } from '@prisma/client';
import DraggableCard from './DraggableCard';
import { PlusIcon } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';

const Column = ({ id, name, cards, index, board }: any) => {
  const { onOpen } = useModal();

  return (
    <Draggable draggableId={name} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {/* render card */}
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`pb-2 p-2 rounded-2xl shadow-sm 
                 ${snapshot.isDraggingOver ? 'bg-green-200/0' : 'bg-white/0'}
                `}
              >
                <h2 className="">{name}</h2>
                {/* {provided.placeholder} */}
                <div className="space-y-2 mt-2">
                  {cards.map((card: Card, index: number) => {
                    if (card.listId === id)
                      return (
                        <Draggable
                          key={card.id}
                          draggableId={card.id}
                          index={index}
                        >
                          {(provided) => (
                            <DraggableCard
                              card={card}
                              index={index}
                              id={id}
                              innerRef={provided.innerRef}
                              draggableProps={provided.draggableProps}
                              dragHandleProps={provided.dragHandleProps}
                              board={board}
                              listName={name}
                            />
                          )}
                        </Draggable>
                      );
                  })}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

          <button
            onClick={() =>
              onOpen('createCard', { listId: id, boardId: board.id })
            }
            className="mt-5 p-2 flex justify-between bg-[#DAE4FD] text-[#2F80ED] rounded-md  w-full font-bold"
          >
            Add another card
            <PlusIcon />
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
