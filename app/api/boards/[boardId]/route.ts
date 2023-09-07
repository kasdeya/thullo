import prisma from '@/lib/prismadb';
import { data } from 'autoprefixer';
import { NextRequest, NextResponse } from 'next/server';
export async function PATCH(
  req: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const { userId } = await req.json();
    console.log(userId);

    const updatedBoard = await prisma.board.update({
      where: {
        id: params.boardId,
      },
      data: {
        membersId: {
          push: userId,
        },
      },
    });

    console.log(updatedBoard);

    return NextResponse.json(updatedBoard);
  } catch (error) {
    console.log(error);
  }
  // try {
  //     const board = prisma.board.findFirst({
  //         where: {
  //             id: boardId
  //         }
  //     })
  //     const user = prisma.board.findFirst({
  //         where: {
  //             id: userId
  //         }
  //     })
  //     const board = prisma.board.update({
  //         where: {
  //             membersId: {...board.membersId, memberId}
  //         }
  //     })
  // } catch (error) {
  // }
}
