import { CardWithAttachments, CardWithAttachmentsAndMembers } from '@/types';
import { Attachment, Card, Prisma, User } from '@prisma/client';
import { create } from 'zustand';
export type ModalType =
  | 'createBoard'
  | 'createCard'
  | 'createList'
  | 'cardModal';

interface ModalData {
  listId?: string;
  boardId?: string;
  userId?: string;
  card?: CardWithAttachmentsAndMembers | null;
  members?: User[] | null;
  listName?: string;
  boardMembers?: User[];
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
