import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from '@hello-pangea/dnd';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Board, User } from '@prisma/client';
import prisma from '@/lib/prismadb';
import { getCardMembers } from '@/hooks/get-card-members';
import { getCardOwner } from '@/hooks/get-card-owner';
import { useEffect, useState } from 'react';
import { useModal } from '@/hooks/use-modal-store';

type Props = {
  card: any;
  index: number;
  id: any;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  board: Board;
  listName: string;
};

const DraggableCard = ({
  card,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
  board,
  listName,
}: Props) => {
  const [owner, setOwner] = useState<any>();
  const [members, setMembers] = useState<any>();
  const { onOpen } = useModal();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getCardMembers(card);

        setMembers(fetchedUsers);
      } catch (error) {
        console.log('Error fetching members: ', error);
      }
    };

    const fetchOwner = async () => {
      try {
        const fetchedOwner = await getCardOwner(card);
        setOwner(fetchedOwner);
      } catch (error) {
        console.log('Error fetching owner: ', error);
      }
    };

    fetchOwner();
    fetchUsers();
  }, [card.cardMembers, card.userId, card]);

  return (
    <div
      className="rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      onClick={() => onOpen('cardModal', { card, members, listName })}
    >
      <Card
        key={card.id}
        className="cursor-pointer opacity-80 hover:opacity-100 transition"
      >
        <CardHeader className="">
          {card.coverImage && (
            <div className="h-40">
              <Image
                src={card.coverImage}
                alt="Cover Image"
                fill
                className="!relative object-cover rounded-md"
              />
            </div>
          )}
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <CardTitle>{card.name}</CardTitle>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Avatar>
            {owner?.profileImage && (
              <AvatarImage src={owner?.profileImage as string} />
            )}
            {card.userId && !owner?.profileImage && (
              <AvatarFallback>
                {owner?.firstName?.charAt(0).toUpperCase()}
                {owner?.lastName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          {/* {members &&
            members.map((member: User, index: number) => {
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
            })} */}
          {/* {card.membersId?.length > 2 && (
            <span>
              +{card.membersId.length - 3}{' '}
              {card.membersId.length - 3 === 1 ? 'other' : 'others'}
            </span> */}
          {/* )} */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DraggableCard;
