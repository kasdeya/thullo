import { BoardList } from '@/components/boards/BoardList';
import { AddBoard } from '@/components/boards/AddBoard';
import Header from '@/components/Header';
import { getServerSession } from 'next-auth';

const Boards = async () => {
  // const { onOpen } = useModal();
  const session = await getServerSession();

  return (
    <>
      {/* BOARDS */}
      {/* ADD BOARD FORM */}
      <Header />
      <div className=" flex flex-col m-auto">
        <div className="flex flex-row place-items-center justify-between py-5 px-10">
          <p>All boards</p>
          {session?.user?.email && <AddBoard />}
        </div>
        <BoardList />
      </div>
      {/* <ButtonForMember></ButtonForMember> */}
    </>
  );
};

export default Boards;
