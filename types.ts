import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { User, Board, List, Card, Label, Comment } from '@prisma/client';

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
