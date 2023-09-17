'use server';
import prisma from '@/lib/prismadb';

export const deleteList = async (id: string) => {
  try {
    const list = await prisma.list.delete({
      where: {
        id: id,
      },
    });

    return list;
  } catch (error) {
    console.log(error);
  }
};
