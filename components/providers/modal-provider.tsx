'use client';
import { useEffect, useState } from 'react';
import CreateBoardModal from '../modals/create-board-modal';

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
    </>
  );
};
