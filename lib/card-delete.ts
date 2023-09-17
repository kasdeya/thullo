'use server';
import prisma from '@/lib/prismadb';
export const cardDelete = async (id: string) => {
  try {
    const deletedCard = await prisma.card.delete({
      where: {
        id: id,
      },
    });

    const list = await prisma.list.findFirst({
      where: {
        id: deletedCard.listId,
      },
      include: {
        cards: true,
      },
    });

    if (!list) return;

    for (let i = deletedCard.index; i < list.cards.length; i++) {
      await prisma.card.update({
        where: {
          id: list.cards[i].id,
        },
        data: {
          index: list.cards.length - i,
        },
      });
    }

    return deletedCard;
  } catch (error) {
    console.log(error);
  }
};
