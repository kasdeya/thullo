'use server';
import prisma from '@/lib/prismadb';
export const editBoardTitle = async (boardId: string, title: string) => {
  try {
    const editedBoard = await prisma.board.update({
      where: {
        id: boardId,
      },
      data: {
        title: title,
      },
    });

    return editedBoard;
  } catch (error) {
    console.log(error);
  }
};
