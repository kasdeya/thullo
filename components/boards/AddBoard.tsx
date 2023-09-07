'use client';
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '../ui/button';

export const AddBoard = () => {
  const { onOpen } = useModal();
  return (
    <div>
      <Button onClick={() => onOpen('createBoard')}>Add board</Button>
    </div>
  );
};
