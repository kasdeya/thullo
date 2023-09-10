'use server';
import prisma from '@/lib/prismadb';
import { Board, Card, List } from '@prisma/client';
import { ObjectId } from 'mongodb';
export const updateBoard = async ({
  listOne,
  listTwo,
  type,
  movedCard,
}: any) => {
  console.log('list one: ', listOne, 'list two: ', listTwo);

  ('use server');
  if (type === 'list') {
    await prisma.list.update({
      where: {
        id: listOne.id,
      },
      data: {
        index: listOne.index,
      },
    });

    await prisma.list.update({
      where: {
        id: listTwo.id,
      },
      data: {
        index: listTwo.index,
      },
    });
  }

  if (type === 'card') {
    if (listTwo.id === listOne.id) {
      await prisma.card.deleteMany({
        where: {
          listId: movedCard.listId,
        },
      });

      await prisma.card.findFirst({
        where: {
          id: listOne.id,
        },
      });

      const cardsOneWithoutId = listOne.cards.map((card: any) => {
        // Create a copy of the card object without the 'id' property
        const { id, ...cardWithoutId } = card;
        return cardWithoutId;
      });

      const id = new ObjectId(movedCard.id);

      await prisma.card.createMany({
        data: { id: id, ...cardsOneWithoutId[0] },
      });
    } else {
      await prisma.card.deleteMany({
        where: {
          listId: listOne.id,
        },
      });

      if (!!listOne.cards[0]) {
        const cardsOneWithoutId = listOne.cards.map((card: any) => {
          // Create a copy of the card object without the 'id' property
          const { id, ...cardWithoutId } = card;
          return cardWithoutId;
        });

        const id = new ObjectId(movedCard.id);
        await prisma.card.createMany({
          data: { id: id, ...cardsOneWithoutId[0] },
        });
      }

      await prisma.card.deleteMany({
        where: {
          listId: listTwo.id,
        },
      });

      if (!!listTwo.cards[0]) {
        const cardsTwoWithoutId = listTwo.cards.map((card: any) => {
          // Create a copy of the card object without the 'id' property
          const { id, ...cardWithoutId } = card;
          return cardWithoutId;
        });

        const test = { id: listTwo.id, ...cardsTwoWithoutId };
        const id = new ObjectId(movedCard.id);

        await prisma.card.createMany({
          data: { id: id, ...cardsTwoWithoutId[0] },
        });
      }
    }
  }
};
