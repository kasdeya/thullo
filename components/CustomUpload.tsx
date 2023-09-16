// Note: `useUploadThing` is IMPORTED FROM YOUR CODEBASE using the `generateReactHelpers` function
import { useDropzone } from 'react-dropzone';
import type { FileWithPath } from 'react-dropzone';

import { generateClientDropzoneAccept } from 'uploadthing/client';

import { useUploadThing } from '@/hooks/uploadthing';
import { useCallback, useState } from 'react';
import { cardFileUpload } from '@/hooks/card-file-upload';
import { Button, buttonVariants } from './ui/button';
import { PlusIcon } from 'lucide-react';
import { Label } from './ui/label';
import useBoardStore from '@/hooks/use-board-store';
import { Attachment } from '@prisma/client';

export function CustomUpload({ cardId, listId }: any) {
  const [files, setFiles] = useState<File[]>([]);
  const { updateCardAttachments } = useBoardStore();

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { startUpload, permittedFileInfo } = useUploadThing('cardFile', {
    onClientUploadComplete: async (res) => {
      const prismaRes = await cardFileUpload(res, cardId);
      updateCardAttachments(listId, cardId, prismaRes);
      setFile(null);
      setUploading(false);
      //   alert('uploaded successfully!');
    },
    onUploadError: () => {
      setUploadError(true);
      setUploading(false);
      setFile(null);
      //   alert('error occurred while uploading');
    },
    onUploadBegin: () => {
      setUploading(true);
      //   alert('upload has begun');
    },
  });

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  const [file, setFile] = useState<File | null>();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  return (
    // <div {...getRootProps()}>
    //   <input {...getInputProps()} />
    <div className="flex gap-2">
      {!file && !uploading && (
        <div>
          <input
            type="file"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
            className="hidden"
            id="file-input"
            name="file-input"
          />
          <Label
            id="file-input"
            htmlFor="file-input"
            className={`cursor-pointer items-center place-items-center flex !h-[24px] !w-[65px] ${buttonVariants(
              {
                variant: 'default',
              }
            )}`}>
            <p className="flex items-center place-items-center">
              <PlusIcon
                size={15}
                className="stroke-2"
              />{' '}
              Add
            </p>
          </Label>
        </div>
      )}
      {file && !uploading && (
        <div className="flex flex-row gap-2">
          <p>{file.name}</p>
          <Button
            className="cursor-pointer items-center flex !h-[24px] !w-[65px]"
            onClick={() => startUpload([file])}>
            Upload
          </Button>
          <Button
            className="cursor-pointer items-center flex !h-[24px] !w-[65px]"
            onClick={() => setFile(undefined)}>
            Cancel
          </Button>
        </div>
      )}
      {file && uploading && (
        <div className="flex flex-row gap-2">
          <p>Uploading {file.name}...</p>
        </div>
      )}
      {!file && !uploading && uploadError && (
        <div className="flex flex-row gap-2">
          <p>Upload error.</p>
        </div>
      )}
    </div>
    //   Drop files here!
    // </div>
  );
}
