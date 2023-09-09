import { getUser } from '@/lib/get-user';
import prisma from '@/lib/prismadb';
// import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import BoardCard from './BoardCard';

export const BoardList = async () => {
  //   const { data: sessionone, status } = await useSession();
  const session = await getServerSession();
  const user = await getUser(session?.user?.email as string);
  //   if (status === 'authenticated') {
  // const user = await getUser(session?.user?.email as string);
  //   }
  const boardsWithMembers = await prisma.board.findMany({
    where: {
      OR: [
        {
          userId: user?.id, // Filter boards created by the user
        },
        {
          membersId: {
            has: user?.id, // Filter boards where the user is a member
          },
        },
      ],
    },
    include: {
      members: true,
      owner: true,
    },
  });

  return (
    <div className="w-full flex flex-wrap gap-4">
      {boardsWithMembers.map((board) => (
        <BoardCard key={board.id} board={board} />
      ))}
    </div>
  );
};
