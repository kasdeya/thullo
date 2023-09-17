'use server';
import prisma from '@/lib/prismadb';
export const editComment = async (commentId: string, commentBody: string) => {
  try {
    const edittedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        body: commentBody,
        editted: true,
      },
    });

    return edittedComment;
  } catch (error) {
    console.log(error);
  }
};
