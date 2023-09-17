'use server';
import prisma from '@/lib/prismadb';
import { Board, Card, List } from '@prisma/client';
export const getCardMembers = async (card: Card) => {
  const members = await prisma.user.findMany({
    where: {
      id: {
        in: card.cardMembers,
      },
    },
  });
  return members;
};
