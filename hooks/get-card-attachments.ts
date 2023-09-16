'use server';
import prisma from '@/lib/prismadb';
import { Board, Card, List } from '@prisma/client';
export const getCardAttachments = async (cardId: string) => {
  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
    },
    include: {
      fileAttachments: true,
    },
  });

  const fileAttachments = card?.fileAttachments;

  if (card?.fileAttachments) {
    return fileAttachments;
  }
  return null;
};
