'use client';
import { Board, Card, List } from '@prisma/client';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import Column from './Column';
import prisma from '@/lib/prismadb';
import { updateBoard } from '@/hooks/update-board-lists';
import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';

const BoardInside = ({ board }: any) => {
  const { onOpen } = useModal();
  const handleOnDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (type === 'column') {
      board.lists[source.index].index = destination.index;
      board.lists[destination.index].index = source.index;
      const [removed] = board.lists.splice(source.index, 1);
      board.lists.splice(destination?.index, 0, removed);
      updateBoard({
        listOne: board.lists[source.index],
        listTwo: board.lists[destination.index],
        type: 'list',
      });
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const [removed] = board.lists[source.droppableId].cards.splice(
        source.index,
        1
      );
      board.lists[destination.droppableId].cards.splice(
        destination.index,
        0,
        removed
      );
    } else {
      const idStart = board.lists[source.droppableId].id;
      const idFinish = board.lists[destination.droppableId].id;
      const [removed] = board.lists[source.droppableId].cards.splice(
        source.index,
        1
      );
      removed.listId = idFinish;

      board.lists[destination.droppableId].cards.splice(
        destination.index,
        0,
        removed
      );
    }

    board.lists[source.droppableId].cards.forEach(
      (card: any, index: number) => {
        card.index = index;
      }
    );
    board.lists[destination.droppableId].cards.forEach(
      (card: any, index: number) => {
        card.index = index;
      }
    );

    updateBoard({
      listOne: board.lists[source.droppableId],
      listTwo: board.lists[destination.droppableId],
      type: 'card',
      movedCard: board.lists[destination.droppableId].cards[destination.index],
      startIndex: source.index,
      finishIndex: destination.index,
    });
  };

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided) => (
            <div
              className="grid grid-cols-1 md:grid-cols-5 gap-5 max-w-7xl mx-auto"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {/* Rendering all the colums */}
              {/* {board?.lists && <Column />} */}
              {board.lists.map(
                (list: List & { cards: Card }, index: number) => (
                  <Column
                    id={list.id}
                    name={list.name}
                    cards={list.cards}
                    index={index}
                    key={list.id}
                    board={board}
                  />
                )
              )}

              {/* <Column /> */}
              {provided.placeholder}

              <button
                onClick={() => onOpen('createList')}
                className="h-10 p-2 flex justify-between bg-[#DAE4FD] text-[#2F80ED] rounded-md  w-full font-bold"
              >
                Add a list
                <Plus />
              </button>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default BoardInside;
