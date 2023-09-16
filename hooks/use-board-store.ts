// boardStore.js
import { CardWithAttachmentsAndMembers } from '@/types';
import { Attachment, Card, Comment, Label, List, User } from '@prisma/client';
import { create } from 'zustand';

interface Board {
  id?: string;
  cards?: Card[] & {
    fileAttachments?: Attachment[];
    cardMembers?: User[];
    labels: Label[];
    comments: Comment[];
  };
  coverImage?: string;
  description?: string;
  labels?: Label[];
  lists?: List[] & {
    cards?: Card[] & {
      members?: User[];
      fileAttachments?: Attachment[];
      labels: Label[];
      comments: Comment[] & { user: User };
    };
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
  ) =>
    | (CardWithAttachmentsAndMembers & { comments: Comment[] & { user: User } })
    | null;
  updateCardAttachments: (
    listId: string,
    cardId: string,
    newAttachment: any
  ) => void;
  updateCardCover: (listId: string, cardId: string, newImage: string) => void;
  addBoardLabel: (boardId: string, label: Label) => void;
  addCardLabel: (listId: string, cardId: string, label: Label) => void;
  addCard: (listId: string, card: Card) => void;
  addCardComment: (listId: string, cardId: string, comment: Comment) => void;
  removeList: (listId: string) => void;
  deleteCard: (listId: string, cardId: string) => void;
  addList: (list: List) => void;
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
        comments: Comment[] & { user: User };
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
  updateCardCover: (listId: string, cardId: string, newImage: string) => {
    set((state: any) => {
      // Find the list by listId
      const updatedLists = [...state.board.lists];
      const listIndex = updatedLists.findIndex((list) => list.id === listId);
      if (listIndex !== -1) {
        // Find the card by cardId
        const updatedCards = [...updatedLists[listIndex].cards];
        const cardIndex = updatedCards.findIndex((card) => card.id === cardId);
        if (cardIndex !== -1) {
          // Update the coverImage of the card with the new imageUrl
          updatedCards[cardIndex].coverImage = newImage;
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
  addBoardLabel: (boardId: string, label: Label) => {
    set((state: any) => {
      const updatedLabels = [...state.board.labels, label];
      const updatedBoard = { ...state.board };
      updatedBoard.labels = updatedLabels;
      return { board: updatedBoard };
      // return state.board.labels.push(label);
      // return {board}
    });
  },
  addCardLabel: (listId: string, cardId: string, label: Label) => {
    set((state: any) => {
      // Find the list by listId
      const updatedLists = [...state.board.lists];
      const listIndex = updatedLists.findIndex((list) => list.id === listId);
      if (listIndex !== -1) {
        // Find the card by cardId
        const updatedCards = [...updatedLists[listIndex].cards];
        const cardIndex = updatedCards.findIndex((card) => card.id === cardId);
        if (cardIndex !== -1) {
          // Update the labels of the card with the new label
          updatedCards[cardIndex].labels = [
            ...updatedCards[cardIndex].labels,
            label,
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
  addCard: (listId: string, card: Card) => {
    set((state: any) => {
      // Find the list by listId
      //@ts-ignore
      card.members = [];
      //@ts-ignore
      card.comments = [];
      //@ts-ignore
      card.labels = [];
      //@ts-ignore
      card.fileAttachments = [];
      const updatedLists = [...state.board.lists];
      const listIndex = updatedLists.findIndex((list) => list.id === listId);

      updatedLists[listIndex].cards = [...updatedLists[listIndex].cards, card];

      const updatedBoard = { ...state.board };
      updatedBoard.lists = updatedLists;
      return { board: updatedBoard };
      // return state.board.labels.push(label);
      // return {board}
    });
  },
  addCardComment: (listId: string, cardId: string, comment: Comment) => {
    set((state: any) => {
      // Find the list by listId
      const updatedLists = [...state.board.lists];
      const listIndex = updatedLists.findIndex((list) => list.id === listId);
      if (listIndex !== -1) {
        // Find the card by cardId
        const updatedCards = [...updatedLists[listIndex].cards];
        const cardIndex = updatedCards.findIndex((card) => card.id === cardId);
        if (cardIndex !== -1) {
          // Update the labels of the card with the new label
          updatedCards[cardIndex].comments = [
            ...updatedCards[cardIndex].comments,
            comment,
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
  removeList: (listId: string) => {
    set((state: any) => {
      const updatedLists = [...state.board.lists];
      const listIndex = updatedLists.findIndex((list) => list.id === listId);
      updatedLists.splice(listIndex, 1);
      const updatedBoard = { ...state.board };
      updatedBoard.lists = updatedLists;
      return { board: updatedBoard };
    });
  },
  deleteCard: (listId: string, cardId: string) => {
    set((state: any) => {
      // Find the list by listId
      const updatedLists = [...state.board.lists];
      const listIndex = updatedLists.findIndex((list) => list.id === listId);
      if (listIndex !== -1) {
        // Find the card by cardId
        const updatedCards = [...updatedLists[listIndex].cards];
        const cardIndex = updatedCards.findIndex((card) => card.id === cardId);
        if (cardIndex !== -1) {
          // Delete the card inside the list
          for (let i = cardIndex; i < updatedCards.length; i++) {
            updatedCards[i].index--;
          }
          updatedCards.splice(cardIndex, 1);
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
  addList: (list: List) => {
    set((state: any) => {
      const updatedLists = [...state.board.lists, list];
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
