'use server';
import prisma from '@/lib/prismadb';
import { BoardWithUsersAndListsWithCards } from '@/types';
import { Board, Card, List } from '@prisma/client';
export const getUsersNotInCard = async (card: Card) => {
  const board = await prisma.board.findFirst({
    where: {
      id: card.boardId,
    },
  });

  if (!board?.userId) return;

  const users = await prisma.user.findMany({
    where: {
      AND: [
        {
          id: {
            in: [board.userId, ...board.membersId],
          },
        },
        {
          NOT: {
            id: {
              in: card?.cardMembers || [],
            },
          },
        },
      ],
    },
  });
  console.log('ran', users);
  return users;
};
