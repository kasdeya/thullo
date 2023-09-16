'use server';
import prisma from '@/lib/prismadb';
import { BoardWithUsersAndListsWithCards } from '@/types';
import { Board, Card, List } from '@prisma/client';
export const getUsersNotInBoard = async ({
  board,
}: BoardWithUsersAndListsWithCards) => {
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        id: {
          in: board?.membersId,
        },
      },
      AND: {
        id: board?.owner.id,
      },
    },
  });
  return users;
};
