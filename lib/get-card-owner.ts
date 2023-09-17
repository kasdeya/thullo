'use server';
import prisma from '@/lib/prismadb';
import { Board, Card, List } from '@prisma/client';
export const getCardOwner = async (card: Card) => {
  try {
    const owner = await prisma.user.findFirst({
      where: {
        id: card.userId,
      },
    });

    return owner;
  } catch (error) {
    console.log(error);
  }
};
