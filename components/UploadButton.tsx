'use client';

import { FileIcon, X } from 'lucide-react';
import Image from 'next/image';

import { UploadDropzone, UploadButton } from '@/lib/uploadthing';

import '@uploadthing/react/styles.css';
import '@/lib/prismadb';
import { cardFileUpload } from '@/hooks/card-file-upload';

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: 'boardImage' | 'cardImage' | 'cardFile';
  cardId: string;
}

export const FileUploadButton = ({
  onChange,
  value,
  endpoint,
  cardId,
}: FileUploadProps) => {
  const onComplete = () => {};

  const fileType = value?.split('.').pop();

  //   if (value && (endpoint === 'boardImage' || endpoint === 'cardImage')) {
  //     return (
  //       <div className=" h-20 w-full block">
  //         <Image
  //           fill
  //           src={value}
  //           alt="Upload"
  //           className="object-cover !relative !h-20 rounded-md"
  //         />
  //         <button
  //           onClick={() => onChange('')}
  //           className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
  //           type="button"
  //         >
  //           <X className="h-4 w-4" />
  //         </button>
  //       </div>
  //     );
  //   }

  //   if (value && endpoint === 'cardFile') {
  //     return (
  //       <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
  //         <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
  //         <a
  //           href={value}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
  //         >
  //           {value}
  //         </a>
  //         <button
  //           onClick={() => onChange('')}
  //           className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
  //           type="button"
  //         >
  //           <X className="h-4 w-4" />
  //         </button>
  //       </div>
  //     );
  //   }

  return (
    <UploadButton
      endpoint={endpoint}
      onClientUploadComplete={async (res) => {
        // onChange(res?.[0].url);
        // console.log(res?.[0].url);
        // await prisma?.card.update({
        //   where: {
        //     id: cardId
        //   },
        //   data: {
        //     attachments: {
        //         push: res?.[0]
        //     }
        //   }
        // });

        if (!res) return;

        cardFileUpload(res, cardId);

        // const extractedFileType = res?.[0].name.split('.').pop();

        // await prisma?.attachment.create({
        //   data: {
        //     filename: res?.[0].name,
        //     filetype: extractedFileType ? extractedFileType : '',
        //     size: res?.[0].size,
        //     cardId: cardId,
        //   },
        // });
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
