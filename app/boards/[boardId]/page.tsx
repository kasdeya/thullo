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

  return (
    <div>
      <h1>board page</h1>

      <div className="flex flex-row gap-2 bg-white/20 p-2">
        <Avatar>
          {board?.owner.profileImage ? (
            <AvatarImage src={board.owner.profileImage} />
          ) : (
            <AvatarFallback>
              {board?.owner.firstName?.charAt(0).toUpperCase()}
              {board?.owner.lastName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        {board?.members.map((member) => (
          <Avatar key={member.id}>
            {member.profileImage ? (
              <AvatarImage src={member.profileImage} />
            ) : (
              <AvatarFallback>
                {member.firstName?.charAt(0).toUpperCase()}
                {member.lastName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        ))}

        <AddBoardMember board={board} />
      </div>

      <BoardInside board={board} />
    </div>
  );
};

export default BoardPage;
