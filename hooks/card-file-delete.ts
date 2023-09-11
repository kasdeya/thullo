'use server';
import { Attachment } from '@prisma/client';
import { utapi } from 'uploadthing/server';
import prisma from '@/lib/prismadb';

export const cardFileDelete = async (attachment: Attachment) => {
  try {
    await utapi.deleteFiles(attachment.fileKey);
    await prisma.attachment.delete({
      where: {
        id: attachment.id,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
