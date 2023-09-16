'use client';
import { AddCard } from '@/components/cards/AddCard';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import prisma from '@/lib/prismadb';
import BoardInside from '@/components/BoardInside';
import AddBoardMember from '@/components/boards/AddBoardMember';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { XCircle } from 'lucide-react';
import axios from 'axios';
import MemberList from '@/components/boards/MemberList';
import BoardMenu from '@/components/boards/BoardMenu';
import useBoardStore from '@/hooks/use-board-store';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { useSession } from 'next-auth/react';

const BoardPage = ({ params }: any) => {
  const { boardId } = useParams();
  const setBoard = useBoardStore((state: any) => state.setBoard);
  const { data: session, status } = useSession();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const board = await prisma.board.findFirst({
        //   where: {
        //     id: boardId as string,
        //   },
        //   include: {
        //     members: true,
        //     lists: {
        //       orderBy: {
        //         index: 'asc',
        //       },
        //       include: {
        //         cards: {
        //           orderBy: {
        //             index: 'asc',
        //           },
        //           include: {
        //             fileAttachments: true,
        //             comments: true,
        //             labels: true,
        //             members: true,
        //           },
        //         },
        //       },
        //     },
        //     owner: true,
        //     labels: true,
        //     cards: {
        //       include: {
        //         fileAttachments: true,
        //       },
        //     },
        //   },
        // });
        const { data } = await axios.get(`/api/boards/${boardId}`);
        const board = data;
        setBoard(board);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [setBoard, boardId]);
  const board = useBoardStore((state: any) => state.board);

  if (board) {
    return (
      <>
        <Header board={board} />
        <div className="flex flex-row justify-between bg-white/10 p-2 mb-5">
          <div className="flex flex-row gap-2">
            <MemberList board={board} />
            {session?.user?.email && <AddBoardMember board={board} />}
          </div>
          <BoardMenu board={board} />
        </div>

        <BoardInside board={board} />
      </>
    );
  } else {
    return null;
  }
};

export default BoardPage;
