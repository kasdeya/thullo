import prisma from '@/lib/prismadb';
export const getUser = async (userEmail: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email: userEmail,
    },
  });

  return user;
};
