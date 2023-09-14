import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import {
  User,
  Board,
  List,
  Card,
  Label,
  Comment,
  Attachment,
} from '@prisma/client';

export type BoardWithUsers = Board & {
  members: User[];
};

export type BoardWithUsersAndLists = Board & {
  members: User[];
  lists: List[];
};

export type ListWithCards = List & { cards: Card[] };

export type BoardWithUsersAndListsWithCards = {
  board:
    | (Board & {
        members: User[];
        owner: User;
        labels: Label[];
        cards: Card[];
        lists: (List & { cards: Card[] })[];
      })
    | null;
};

export type CardWithAttachments = Card & { fileAttachments: Attachment[] };
export type CardWithAttachmentsAndMembers = Card & {
  fileAttachments: Attachment[];
  members: User[];
};

export type CommentWithUser = Comment & { user: User };
