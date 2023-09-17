'use server';

import { Label } from '@prisma/client';
import prisma from '@/lib/prismadb';

export const addCardLabelPrisma = async (cardId: string, label: Label) => {
  if (!label) return;
  try {
    await prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        cardLabels: {
          push: label.id,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};
