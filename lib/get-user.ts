'use server';
import prisma from '@/lib/prismadb';
import { getServerSession } from 'next-auth';
// export const getUser = async (userEmail: string) => {
export const getUser = async () => {
  const session = await getServerSession();

  if (!session?.user?.email) return null;

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  return user;
};
