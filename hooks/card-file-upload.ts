'use server';
import { ObjectId } from 'mongodb';
import prisma from '@/lib/prismadb';
export const cardFileUpload = async (res: any, cardId: string) => {
  const extractedFileType = res?.[0].name.split('.').pop();
  console.log(res);

  const newAttachment = await prisma?.attachment.create({
    data: {
      filename: res?.[0].name,
      filetype: extractedFileType ? extractedFileType : '',
      size: res?.[0].size,
      cardId: cardId,
      url: res?.[0].url,
      fileKey: res?.[0].fileKey,
    },
  });

  return newAttachment;
};
