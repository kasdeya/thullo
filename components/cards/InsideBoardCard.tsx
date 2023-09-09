'use client';

import Image from 'next/image';
import { Board, User } from '@prisma/client';
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
} from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';

const InsideBoardCard = ({ board }: any) => {
  const router = useRouter();

  return (
    <Card
      key={board.id}
      className="w-[330px] cursor-pointer opacity-80 hover:opacity-100 transition"
      onClick={() => router.push(`/boards/${board.id}`)}
    >
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
          {board.owner?.profileImage && (
            <AvatarImage src={board.owner?.profileImage} />
          )}
          {board.owner && !board.owner?.profileImage && (
            <AvatarFallback>
              {board.owner.firstName?.charAt(0).toUpperCase()}
              {board.owner.lastName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        {board.members &&
          board.members.map((member: User, index: number) => {
            if (member && index < 3)
              return (
                <Avatar key={index}>
                  <AvatarImage></AvatarImage>
                  <AvatarFallback>
                    {member.firstName?.charAt(0).toUpperCase()}
                    {member.lastName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              );
          })}
        {board.membersId?.length > 2 && (
          <span>
            +{board.membersId.length - 3}{' '}
            {board.membersId.length - 3 === 1 ? 'other' : 'others'}
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

export default InsideBoardCard;
