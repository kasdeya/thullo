import { AddCard } from '@/components/cards/AddCard';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import prisma from '@/lib/prismadb';
import BoardInside from '@/components/BoardInside';

const BoardPage = async ({ params }: any) => {
  const board = await prisma.board.findFirst({
    where: {
      id: params.boardId,
    },
    include: {
      members: true,
      lists: {
        orderBy: {
          index: 'asc',
        },
        include: {
          cards: {
            orderBy: {
              index: 'asc',
            },
          },
        },
      },
      owner: true,
      labels: true,
      cards: true,
    },
  });

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
  };

  return (
    <div>
      <h1>board page</h1>
      <BoardInside board={board} />
    </div>
  );
};

export default BoardPage;
