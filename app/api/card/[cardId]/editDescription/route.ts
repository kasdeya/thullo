import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
export async function PATCH(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  const { description } = await req.json();
  const session = await getServerSession();

  if (!description) {
    return new NextResponse('No description provided', { status: 401 });
  }

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const updatedCard = await prisma.card.update({
      where: {
        id: params.cardId,
      },
      data: {
        description: description,
      },
    });
    return NextResponse.json(updatedCard);
  } catch (error) {
    console.log(error);
    return new NextResponse('[CARD_DESCRIPTION_INTERNAL_ERROR]', {
      status: 500,
    });
  }
}
