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
import { Board, Comment, Label, User } from '@prisma/client';
import prisma from '@/lib/prismadb';
import { getCardMembers } from '@/hooks/get-card-members';
import { getCardOwner } from '@/hooks/get-card-owner';
import { useEffect, useState } from 'react';
import { useModal } from '@/hooks/use-modal-store';
import { CardWithAttachments, CardWithAttachmentsAndMembers } from '@/types';
import useBoardStore from '@/hooks/use-board-store';
import { PlusIcon } from 'lucide-react';
import { Button } from './ui/button';
import LabelBadge from './LabelBadge';

type Props = {
  card: CardWithAttachmentsAndMembers & { labels: Label[] };
  index: number;
  id: any;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  board: Board & { members: User[]; owner: User };
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
  const { getCard, getCardMembers } = useBoardStore();

  const cardFromStore = getCard(
    card.listId,
    card.id
  ) as CardWithAttachmentsAndMembers & {
    labels: Label[];
    comments: Comment[] & { user: User };
  };

  const boardMembers = [...board.members, board.owner];

  return (
    <div
      className="rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      onClick={() =>
        onOpen('cardModal', {
          card,
          members,
          listName,
          boardMembers,
        })
      }>
      <Card
        key={card.id}
        className="cursor-pointer opacity-80 hover:opacity-100 transition">
        <CardHeader className="">
          {card.coverImage && (
            <div className="h-40 !relative">
              <Image
                src={card.coverImage}
                alt="Cover Image"
                fill
                className="!relative object-cover rounded-md"
                sizes="(max-width: 100%)"
                priority={true}
              />
            </div>
          )}
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <CardTitle>{card.name}</CardTitle>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 max-w-full items-start">
          <div className="overflow-hidden overflow-ellipsis whitespace-nowrap flex-row flex flex-wrap gap-2 max-w-full">
            {cardFromStore?.members &&
              cardFromStore.members.map((member: User, index: number) => {
                // if (index < 3) {
                return (
                  <Avatar
                    key={member.id}
                    className="">
                    <AvatarImage src={member.profileImage as string} />
                    <AvatarFallback>
                      {member.firstName?.charAt(0).toUpperCase()}
                      {member.lastName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                );
                // }
              })}

            <Button className="p-2 bg-blue-500">
              <PlusIcon
                className="stroke-2"
                size={20}
              />
            </Button>
          </div>
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
          {}
          <div className="flex flex-row flex-wrap gap-2">
            {cardFromStore?.labels &&
              cardFromStore?.labels.map((label) => (
                <LabelBadge
                  label={label}
                  key={label.id}
                />
              ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DraggableCard;
