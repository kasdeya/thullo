'use server';
import prisma from '@/lib/prismadb';
type Color = {
  name: string;
  value: string;
};
interface dataProps {
  boardId: string;
  cardId: string;
  color: Color | undefined;
  labelBody: string;
}
export const createLabel = async (data: dataProps) => {
  const { boardId, cardId, color, labelBody } = data;
  if (!color) return null;

  try {
    const label = await prisma.label.create({
      data: {
        body: labelBody,
        color: color.value,
        boardId: boardId,
        cardsIds: [cardId],
      },
    });

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

    return label;
  } catch (error) {
    console.log(error);
  }
};
