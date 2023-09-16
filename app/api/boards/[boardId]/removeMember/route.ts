import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function PATCH(req: Request) {
  const { userId, board } = await req.json();

  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!userId) {
      return new NextResponse('No users selected', { status: 402 });
    }

    const ogBoard = await prisma.board.findFirst({
      where: {
        id: board.id,
      },
    });

    const index = ogBoard?.membersId.findIndex(
      (members) => members === (userId as string)
    );
    if (index) {
      const membersWithRemovedUser = ogBoard?.membersId.splice(index, 1);

      if (membersWithRemovedUser && ogBoard) {
        await prisma.board.update({
          where: {
            id: board.id,
          },
          data: {
            membersId: {
              set: [...ogBoard?.membersId],
            },
          },
        });
      }

      return NextResponse.json(membersWithRemovedUser);
    }
  } catch (error) {
    console.log(error);
    return new NextResponse('[INTERNAL_ERROR_ADDING_MEMBERS_TO_LIST]', {
      status: 500,
    });
  }
}
