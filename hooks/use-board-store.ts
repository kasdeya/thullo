// boardStore.js
import { CardWithAttachmentsAndMembers } from '@/types';
import { Attachment, Card, Label, List, User } from '@prisma/client';
import { create } from 'zustand';

interface Board {
  id?: string;
  cards?: Card[] & { fileAttachments?: Attachment[]; cardMembers?: User[] };
  coverImage?: string;
  description?: string;
  labels?: Label[];
  lists?: List[] & {
    cards?: Card[] & { members?: User[]; fileAttachments?: Attachment[] };
  };
  members?: User[];
  membersId?: string[];
  owner?: User;
  public?: boolean;
  title?: string;
  userId?: string;
  updatedAt?: string;
  createdAt?: string;
}

interface BoardState {
  board: Board | null;
  setBoard: (newBoard: any) => void;
  updateCardMembers: (
    listId: string,
    cardId: string,
    newMembers: User[]
  ) => void; // Specify the types here
  getCardMembers: (listId: string, cardId: string) => void;
  getCard: (
    listId: string,
    cardId: string
  ) => CardWithAttachmentsAndMembers | null;
  updateCardAttachments: (
    listId: string,
    cardId: string,
    newAttachment: any
  ) => void;
}

const useBoardStore = create<BoardState>((set) => ({
  board: null, // Initialize with null or an empty object
  setBoard: (newBoard: any) => set({ board: newBoard }),
  updateCardMembers: (listId: string, cardId: string, newMembers: User[]) => {
    set((state: any) => {
      // Find the list by listId
      const updatedLists = [...state.board.lists];
      const listIndex = updatedLists.findIndex((list) => list.id === listId);
      if (listIndex !== -1) {
        // Find the card by cardId
        const updatedCards = [...updatedLists[listIndex].cards];
        const cardIndex = updatedCards.findIndex((card) => card.id === cardId);
        if (cardIndex !== -1) {
          // Update the members of the card with the new array
          updatedCards[cardIndex].members = [
            ...updatedCards[cardIndex].members,
            ...newMembers,
          ];
        }
        // Update the card array within the list
        updatedLists[listIndex].cards = updatedCards;
      }
      // Update the list array within the board
      const updatedBoard = { ...state.board };

      updatedBoard.lists = updatedLists;

      return { board: updatedBoard };
    });
  },
  getCardMembers: (listId: string, cardId: string) => {
    const card = getCardFromBoard(listId, cardId) as Card & { members: User[] };
    console.log(card);
    return card ? card.members : [];
  },
  getCard: (listId: string, cardId: string) => {
    const board = useBoardStore.getState().board;
    const list = board?.lists?.find((list) => list.id === listId) as List & {
      cards: Card[];
    };
    if (list) {
      return list.cards.find((card) => card.id === cardId) as Card & {
        fileAttachments: Attachment[];
        members: User[];
      };
    }
    return null;
  },
  updateCardAttachments: (
    listId: string,
    cardId: string,
    newAttachment: Attachment[]
  ) => {
    set((state: any) => {
      // Find the list by listId
      const updatedLists = [...state.board.lists];
      const listIndex = updatedLists.findIndex((list) => list.id === listId);
      if (listIndex !== -1) {
        // Find the card by cardId
        const updatedCards = [...updatedLists[listIndex].cards];
        const cardIndex = updatedCards.findIndex((card) => card.id === cardId);
        if (cardIndex !== -1) {
          // Update the attachments of the card with the new array
          updatedCards[cardIndex].fileAttachments = [
            ...updatedCards[cardIndex].fileAttachments,
            newAttachment,
          ];
        }
        // Update the card array within the list
        updatedLists[listIndex].cards = updatedCards;
      }
      // Update the list array within the board
      const updatedBoard = { ...state.board };

      updatedBoard.lists = updatedLists;

      return { board: updatedBoard };
    });
  },
}));

function getCardFromBoard(listId: string, cardId: string) {
  const board = useBoardStore.getState().board;
  const list = board?.lists?.find((list) => list.id === listId) as List & {
    cards: Card[];
    members: User[];
  };
  if (list) {
    return list.cards.find((card) => card.id === cardId);
  }
  return null;
}

export default useBoardStore;
