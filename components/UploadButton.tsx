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

  return (
    <UploadButton
      endpoint={endpoint}
      onClientUploadComplete={async (res) => {
        if (!res) return;
        cardFileUpload(res, cardId);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
