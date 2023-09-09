import { create } from 'zustand';
export type ModalType = 'createBoard' | 'createCard' | 'createList';

interface ModalData {}

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  listId: string;
  boardId: string;
  userId: string;
  onOpen: (
    type: ModalType,
    listId?: string,
    boardId?: string,
    userId?: string
  ) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  listId: '',
  boardId: '',
  userId: '',
  onOpen: (type, listId = '', boardId = '', userId = '') =>
    set({ isOpen: true, type, listId, boardId, userId }),
  onClose: () => set({ type: null, isOpen: false }),
}));
