import prisma from '@/lib/prismadb';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { number } from 'zod';

export async function POST(req: Request) {
  const { name, imageUrl, isPublic } = await req.json();
  const session = await getServerSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const profile = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  try {
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const board = await prisma.board.create({
      data: {
        userId: profile.id,
        title: name as string,
        coverImage: imageUrl as string,
        public: isPublic as boolean,
      },
      include: {
        cards: true,
        lists: true,
      },
    });

    const numberOfLists = board.lists.length;

    const boardId = board.id;
    // Create the list and associated card using the boardId
    await prisma.list.create({
      data: {
        index: 0,
        name: 'initial',
        board: {
          connect: { id: boardId },
        },
        cards: {
          create: {
            name: 'initial card',
            index: 0,
            userId: profile.id,
            description: 'description',
            boardId,
          },
        },
      },
    });

    return NextResponse.json(board);
  } catch (error) {
    console.log('[BOARD_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
