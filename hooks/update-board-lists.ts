'use server';
import prisma from '@/lib/prismadb';
import { Board, Card, List } from '@prisma/client';
import { ObjectId } from 'mongodb';
export const updateBoard = async ({
  listOne,
  listTwo,
  type,
  movedCard,
  startIndex,
  finishIndex,
}: any) => {
  // console.log('list one: ', listOne, 'list two: ', listTwo);

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
    console.log('indexes:', startIndex, finishIndex);
    // id object for card probably wont need it
    const id = new ObjectId(movedCard.id);
    // If we dropping the card in same list(column)
    // listOne = starting list = list from which we grabbed the card
    // listTwo = ending list = list in which we dropped the card
    if (listTwo.id === listOne.id) {
      // foor loop update all cards in list need to change each index + 1
      // loop through either list, both should be same list
      for (let index = finishIndex; index < listTwo.cards.length; index++) {
        await prisma.card.update({
          where: {
            id: listTwo.cards[index].id,
          },
          data: {
            index: listTwo.cards[index].index,
            listId: listTwo.cards[index].listId,
          },
        });
      }
    } else {
      for (let index = startIndex; index < listOne.cards.length; index++) {
        await prisma.card.update({
          where: {
            id: listOne.cards[index].id,
          },
          data: {
            index: listOne.cards[index].index,
            listId: listOne.cards[index].listId,
          },
        });
      }

      for (let index = finishIndex; index < listTwo.cards.length; index++) {
        await prisma.card.update({
          where: {
            id: listTwo.cards[index].id,
          },
          data: {
            index: listTwo.cards[index].index,
            listId: listTwo.cards[index].listId,
          },
        });
      }
    }
  }
};
