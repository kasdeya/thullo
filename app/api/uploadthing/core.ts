// import { auth } from '@clerk/nextjs';
import { getServerSession } from 'next-auth';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const handleAuth = () => {
  // const { userId } = auth();
  // if (!userId) throw new Error('Unauthorized');
  // return { userId: userId };
  const session = getServerSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return { ...session };
};

export const ourFileRouter = {
  boardImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  cardImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  cardFile: f(['image', 'pdf', 'video', 'audio', 'blob', 'text'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
