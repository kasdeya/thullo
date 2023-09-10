import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
export async function PATCH(req: Request) {
  const { description, board } = await req.json();

  const session = await getServerSession();

  if (!session?.user?.email) {
    return new NextResponse('Unathorized', { status: 401 });
  }

  try {
    const updatedDescription = await prisma.board.update({
      where: {
        id: board.id,
      },
      data: {
        description: description,
      },
    });

    return NextResponse.json(updatedDescription);
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
