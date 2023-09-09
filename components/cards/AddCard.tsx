'use client';
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '../ui/button';

export const AddCard = () => {
  const { onOpen } = useModal();
  return (
    <div>
      <Button onClick={() => onOpen('createCard')}>Add Card</Button>
    </div>
  );
};
