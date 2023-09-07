import { BoardList } from '@/components/boards/BoardList';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/use-modal-store';
import axios from 'axios';
import { ButtonForMember } from '@/components/test';
import { AddBoard } from '@/components/boards/AddBoard';

const Boards = async () => {
  // const { onOpen } = useModal();
  return (
    <div>
      {/* BOARDS */}
      {/* ADD BOARD FORM */}
      <AddBoard />
      <BoardList />
      {/* <ButtonForMember></ButtonForMember> */}
    </div>
  );
};

export default Boards;
