import { AddCard } from '@/components/cards/AddCard';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import prisma from '@/lib/prismadb';
import BoardInside from '@/components/BoardInside';
import AddBoardMember from '@/components/boards/AddBoardMember';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { XCircle } from 'lucide-react';
import axios from 'axios';
import MemberList from '@/components/boards/MemberList';
import BoardMenu from '@/components/boards/BoardMenu';

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
      cards: {
        include: {
          fileAttachments: true,
        },
      },
    },
  });

  return (
    <div>
      <h1>board page</h1>

      <div className="flex flex-row justify-between bg-white/20 p-2">
        <div className="flex flex-row gap-2">
          <MemberList board={board} />
          <AddBoardMember board={board} />
        </div>
        <BoardMenu board={board} />
      </div>

      <BoardInside board={board} />
    </div>
  );
};

export default BoardPage;
