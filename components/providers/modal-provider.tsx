'use client';
import { useEffect, useState } from 'react';
import CreateBoardModal from '../modals/create-board-modal';
import CreateCardModal from '../modals/create-card-modal';
import CreateListModal from '../modals/create-list-modal';

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {children}
      <CreateBoardModal />
      <CreateCardModal />
      <CreateListModal />
    </>
  );
};
