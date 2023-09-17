'use server';
import prisma from '@/lib/prismadb';
export const updateDbCardCover = async (cardId: string, imageUrl: string) => {
  try {
    const updatedCard = await prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        coverImage: imageUrl,
      },
    });
    return updatedCard;
  } catch (error) {
    console.log(error);
  }
};
