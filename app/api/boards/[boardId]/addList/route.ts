import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function POST(req: Request) {
  const { name, boardId } = await req.json();
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
      },
      include: {
        lists: true,
      },
    });

    const numberOfLists = board?.lists.length;

    const list = await prisma.list.create({
      data: {
        name: name,
        index: numberOfLists ? numberOfLists - 1 : 0,
        boardId: boardId,
      },
    });

    return NextResponse.json(list);
  } catch (error) {
    console.log(error);
  }
}
