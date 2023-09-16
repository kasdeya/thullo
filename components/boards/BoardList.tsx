import { getUser } from '@/lib/get-user';
import prisma from '@/lib/prismadb';
// import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import BoardCard from './BoardCard';
import { Fragment } from 'react';

export const BoardList = async () => {
  // const { data: sessionone, status } = await useSession();
  // const session = await getServerSession();
  const user = await getUser();
  //   if (status === 'authenticated') {
  // const user = await getUser(session?.user?.email as string);
  //   }

  if (!user) {
    const publicBoards = await prisma.board.findMany({
      where: {
        public: true,
      },
      include: {
        members: true,
        owner: true,
      },
    });

    return (
      // <div className="w-auto m-auto flex flex-wrap gap-5">
      <div className="w-auto grid grid-cols-[repeat(auto-fill,_minmax(330px,_1fr))] gap-5">
        {publicBoards.map((board) => (
          <BoardCard
            key={board.id}
            board={board}
          />
        ))}
      </div>
    );
  }

  if (user) {
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
          {
            public: true,
          },
        ],
      },
      include: {
        members: true,
        owner: true,
      },
    });

    return (
      // <div className="w-auto m-auto flex flex-wrap gap-5">
      <div className="w-auto grid grid-cols-[repeat(auto-fill,_minmax(330px,_1fr))] gap-5">
        {boardsWithMembers.map((board) => (
          <BoardCard
            key={board.id}
            board={board}
          />
        ))}
      </div>
    );
  }
};
