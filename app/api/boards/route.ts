import prisma from '@/lib/prismadb';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { name, imageUrl, isPublic } = await req.json();
  const session = await getServerSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  console.log(session);
  const profile = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });
  console.log(profile);

  console.log(name, imageUrl, isPublic);

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
    });

    return NextResponse.json(board);
  } catch (error) {
    console.log('[BOARD_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
