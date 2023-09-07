import { getUser } from '@/lib/get-user';
import Image from 'next/image';
import prisma from '@/lib/prismadb';
// import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import axios from 'axios';

export const BoardList = async () => {
  //   const { data: sessionone, status } = await useSession();
  //   console.log(sessionone);
  const session = await getServerSession();
  console.log(session);
  const user = await getUser(session?.user?.email as string);
  console.log(user);
  //   if (status === 'authenticated') {
  // const user = await getUser(session?.user?.email as string);
  //   }

  const boards = await prisma.board.findMany({
    where: {
      userId: user?.id,
    },
  });

  console.log(boards);

  return (
    <div className="w-full flex flex-wrap gap-4">
      {boards.map((board) => (
        <Card key={board.id} className=" w-[330px]">
          <CardHeader className="">
            {board.coverImage ? (
              <div className="h-40">
                <Image
                  src={board.coverImage}
                  alt="Cover Image"
                  fill
                  className="!relative object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="h-40 bg-gray-700 rounded-md">
                <Image
                  src={'/images/default-cover.jpg'}
                  alt="Cover Image"
                  fill
                  className="!relative object-cover rounded-md"
                />
              </div>
            )}
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle>{board.title}</CardTitle>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Avatar>
              {user?.profileImage && <AvatarImage src={user.profileImage} />}
              {user && !user?.profileImage && (
                <AvatarFallback>
                  {user.firstName?.charAt(0).toUpperCase()}
                  {user.lastName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            {board.membersId &&
              board.membersId.map(async (member, index) => {
                let mem = await prisma.user.findFirst({
                  where: {
                    id: member,
                  },
                });
                if (mem && index < 3)
                  return (
                    <Avatar key={index}>
                      <AvatarImage></AvatarImage>
                      <AvatarFallback>
                        {mem.firstName?.charAt(0).toUpperCase()}
                        {mem.lastName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  );
              })}
            {board.membersId.length > 2 && (
              <span>
                +{board.membersId.length - 3}{' '}
                {board.membersId.length - 3 === 1 ? 'other' : 'others'}
              </span>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
