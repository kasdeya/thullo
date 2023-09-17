'use server';

import prisma from '@/lib/prismadb';
import { Comment } from '@prisma/client';
import { getServerSession } from 'next-auth';

export const addCommentPrisma = async (cardId: string, comment: string) => {
  const session = await getServerSession();

  try {
    if (!session?.user?.email) return null;

    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });

    if (!user) return null;

    const newComment = await prisma.comment.create({
      data: {
        userId: user.id,
        cardId: cardId,
        body: comment,
      },
      include: {
        user: true,
      },
    });

    return newComment;
  } catch (error) {
    console.log(error);
  }
};
