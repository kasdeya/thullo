'use server';
import prisma from '@/lib/prismadb';
export const fetchBoard = async (boardId: string) => {
  console.log(boardId);
  try {
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
      },
      include: {
        members: true,
        lists: {
          orderBy: {
            index: 'asc',
          },
          include: {
            cards: {
              orderBy: {
                index: 'asc',
              },
              include: {
                fileAttachments: true,
                comments: true,
                labels: true,
                members: true,
              },
            },
          },
        },
        owner: true,
        labels: true,
        cards: {
          include: {
            fileAttachments: true,
          },
        },
      },
    });

    return board;
  } catch (error) {
    console.log(error);
  }
};
