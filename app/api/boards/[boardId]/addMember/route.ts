import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function PATCH(req: Request) {
  const { selectedUsers, board } = await req.json();

  try {
    const session = await getServerSession();

    const ogBoard = await prisma.board.findFirst({
      where: {
        id: board.id,
      },
    });

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (selectedUsers.length === 0) {
      return new NextResponse('No users selected', { status: 402 });
    }

    // If we only adding one user

    if (selectedUsers.length === 1) {
      const alreadyExists = ogBoard?.membersId.some(
        (member: string) => member === selectedUsers[0]
      );

      if (alreadyExists) {
        return new NextResponse('User already a member', { status: 401 });
      }

      const updatedBoard = await prisma.board.update({
        where: {
          id: board.id,
        },
        data: {
          membersId: {
            push: selectedUsers[0],
          },
        },
      });
      return NextResponse.json(updatedBoard);
    }

    // If we adding multiple users we need to check if our board has users in it or not
    // if it does we need to spread the previous users and add the new ones with set
    // if it doesnt we just spread the new users were pushing

    if (selectedUsers.length > 1) {
      const hasCommonValues = (arr1: string[], arr2: string[]) => {
        for (let i = 0; i < arr1.length; i++) {
          if (arr1.includes(arr2[i])) {
            return true; // Found a common value
          }
        }
        return false; // No common values found
      };

      if (!ogBoard?.membersId) return;

      const alreadyExists = hasCommonValues(ogBoard.membersId, selectedUsers);

      if (alreadyExists) {
        return new NextResponse('User already a member', { status: 401 });
      }

      if (ogBoard && ogBoard?.membersId.length > 0) {
        const updatedBoard = await prisma.board.update({
          where: {
            id: board.id,
          },
          data: {
            membersId: {
              set: [...ogBoard?.membersId, ...selectedUsers],
            },
          },
        });
        return NextResponse.json(updatedBoard);
      }

      if (ogBoard && ogBoard?.membersId.length === 0) {
        const updatedBoard = await prisma.board.update({
          where: {
            id: board.id,
          },
          data: {
            membersId: {
              set: [...selectedUsers],
            },
          },
        });
        return NextResponse.json(updatedBoard);
      }
    }
  } catch (error) {
    console.log(error);
    return new NextResponse('[INTERNAL_ERROR_ADDING_MEMBERS_TO_LIST]', {
      status: 500,
    });
  }
}
