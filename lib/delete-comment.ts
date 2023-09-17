'use server';
import prisma from '@/lib/prismadb';
export const deleteComment = async (commentId: string) => {
  try {
    const delettedComment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    return deleteComment;
  } catch (error) {
    console.log(error);
  }
};
