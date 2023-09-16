import { Draggable, DraggableProvided, Droppable } from '@hello-pangea/dnd';
import { Card, Label } from '@prisma/client';
import DraggableCard from './DraggableCard';
import { PlusIcon } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';
import { CardWithAttachments, CardWithAttachmentsAndMembers } from '@/types';
import useBoardStore from '@/hooks/use-board-store';
import { useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useEffect, useState } from 'react';
import { deleteList } from '@/hooks/remove-list';

const Column = ({ id, name, cards, index, board }: any) => {
  const { onOpen } = useModal();
  const { data: session } = useSession();
  const [showAlert, setShowAlert] = useState(false);
  const { removeList } = useBoardStore();
  let alertTimeout: any;

  const handleListDelete = async (id: string) => {
    // if list empty
    if (cards.length == 0) {
      // delete from database
      const deletedList = await deleteList(id);
      removeList(id);
      // delete from store
    }
    // else
    // alert move cards outside list or delete them.
    console.log(id);
    console.log(cards.length > 0);
    if (cards.length > 0) {
      if (showAlert) return;
      setShowAlert(true);
      alertTimeout = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(alertTimeout);
    };
  }, [alertTimeout]);

  return (
    <Draggable
      draggableId={name}
      index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}>
          {showAlert && (
            <Alert>
              <AlertTitle></AlertTitle>
              <AlertDescription>
                List must be empty before deletion
              </AlertDescription>
            </Alert>
          )}
          {/* render card */}
          <Droppable
            droppableId={index.toString()}
            type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`pb-2 p-2 rounded-2xl shadow-sm
                 ${snapshot.isDraggingOver ? 'bg-green-200/0' : 'bg-white/0'}
                `}>
                <div className="flex flex-row justify-between place-items-center">
                  <h2 className="">{name}</h2>
                  <Button
                    variant={'ghost'}
                    className="text-rose-500"
                    onClick={() => handleListDelete(id)}>
                    Delete
                  </Button>
                </div>
                {/* {provided.placeholder} */}
                <div className="space-y-2 mt-2">
                  {cards &&
                    cards.map(
                      (
                        card: CardWithAttachmentsAndMembers & {
                          labels: Label[];
                        },
                        index: number
                      ) => {
                        if (card.listId === id)
                          return (
                            <Draggable
                              key={card.id}
                              draggableId={card.id}
                              index={index}>
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
                      }
                    )}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

          {session?.user?.email && (
            <button
              onClick={() =>
                onOpen('createCard', { listId: id, boardId: board.id })
              }
              className="mt-5 p-2 flex justify-between bg-[#DAE4FD] text-[#2F80ED] rounded-md  w-full font-bold">
              Add another card
              <PlusIcon />
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Column;
