'use server';
import prisma from '@/lib/prismadb';

export const avatarImageUpload = async (res: any, userId: string) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profileImage: res?.[0].url,
      },
    });
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};
