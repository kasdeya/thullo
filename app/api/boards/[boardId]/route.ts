import prisma from '@/lib/prismadb';
import { data } from 'autoprefixer';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
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
}

export async function POST(
  req: Request,
  { params }: { params: { boardId: string } }
) {
  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  try {
    const { name, description, imageUrl, labels, members, listId } =
      await req.json();

    console.log('route test', listId);

    const cardsInList = await prisma.list.findFirst({
      where: {
        id: listId as string,
      },
      include: {
        cards: true,
      },
    });

    const numberOfCards = cardsInList?.cards.length;

    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const newCard = await prisma.card.create({
      data: {
        name: name as string,
        description: description as string,
        index: numberOfCards ? numberOfCards + 1 : 0,
        userId: user?.id,
        listId: listId as string,
        coverImage: imageUrl as string,
        boardId: params.boardId,
      },
    });

    return NextResponse.json(newCard);
  } catch (error) {
    console.log(error);
  }
}
