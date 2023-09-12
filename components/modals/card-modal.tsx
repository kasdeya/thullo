import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { useModal } from '@/hooks/use-modal-store';
import { Label } from '../ui/label';
import { Button, buttonVariants } from '../ui/button';
import { FileIcon, PencilIcon, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Textarea } from '../ui/textarea';
import axios from 'axios';
import AddCardMember from '../cards/AddCardMember';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Attachment, Card, User } from '@prisma/client';
import { cardFileDelete } from '@/hooks/card-file-delete';
import { CustomUpload } from '../CustomUpload';
import useBoardStore from '@/hooks/use-board-store';
import { CardWithAttachmentsAndMembers } from '@/types';

const IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];

const CardModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { card, members, listName, boardMembers } = data;
  const [description, setDescription] = useState(
    !!card?.description ? card.description : ''
  );
  const [responseDescription, setResponseDescription] = useState();
  const [editDescription, setEditDescription] = useState(false);
  const [file, setFile] = useState('');
  const [attachments, setAttachments] = useState<Attachment[] | null>();
  const { getCard, getCardMembers } = useBoardStore();

  if (!card) return;
  const cardFromStore = getCard(card.listId, card.id);

  const cardMembers = card ? getCardMembers(card.listId, card.id) : [];

  // useEffect(() => {
  //   if (!!card?.description) setDescription(card?.description);
  //   console.log('card members changed', cardMembers);
  // }, [card?.description, card, attachments, cardMembers]);

  const isModalOpen = isOpen && type === 'cardModal';

  const handleAttachmentDelete = async (attachment: Attachment) => {
    try {
      // await utapi.deleteFiles(attachment.fileKey);
      await cardFileDelete(attachment);
    } catch (error) {
      console.log(error);
    }
  };
  console.log('from store', cardMembers);

  const handleCancelDescription = () => {
    setDescription(
      !!responseDescription
        ? responseDescription
        : card?.description
        ? card.description
        : ''
    );
    setEditDescription(false);
  };

  const handleClose = () => {
    onClose();
  };

  const handleChangeDescription = async () => {
    try {
      const response = await axios.patch(
        `/api/card/${card?.id}/editDescription`,
        {
          description,
        }
      );
      setResponseDescription(response.data.description);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  console.log(card);

  if (!card) return null;

  const formatName = (firstName: string, lastName: string) => {
    const first = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const second = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    const fullName = `${first} ${second}`;
    return fullName;
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={handleClose}>
      <DialogContent className=" max-w-3xl">
        <DialogHeader>
          {card?.coverImage && (
            <Image
              src={card?.coverImage as string}
              alt="Card Cover Image"
              width={100}
              height={100}
              className="!object-cover w-full h-[130px]"
            />
          )}
          <div className="grid grid-cols-[_1fr,_0.5fr]">
            <div>
              <DialogTitle>
                <p>{card?.name}</p>
                <Label>
                  in list <b>{listName}</b>
                </Label>
              </DialogTitle>
              <Label>Description</Label>{' '}
              <Button
                className="!h-[24px] !w-[65px]"
                onClick={() => setEditDescription(true)}>
                <p className="flex flex-row place-items-center gap-1">
                  <PencilIcon size={15} />
                  Edit
                </p>
              </Button>
              <DialogDescription>
                {!editDescription && description}
              </DialogDescription>
              {editDescription && (
                <>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <Button onClick={handleChangeDescription}>Save</Button>
                  <Button onClick={handleCancelDescription}>Cancel</Button>
                </>
              )}
              {/* Attachments */}
              <div>
                <div className="flex gap-2 place-items-center mt-2">
                  <Label>Attachments</Label>
                  {/* <Button>
                    <Plus size={15} className="mr-2" /> Add
                  </Button> */}
                  <CustomUpload
                    cardId={card.id}
                    listId={card.listId}
                  />
                  {/* <FileUploadButton
                    endpoint="cardFile"
                    value={file ? file : ''}
                    onChange={(e) => setFile(e as string)}
                    cardId={card.id}
                  /> */}
                </div>
                {cardFromStore?.fileAttachments &&
                  cardFromStore.fileAttachments.map(
                    (attachment: Attachment) => {
                      const createdAt = new Date(attachment.createdAt);
                      return (
                        <div
                          key={attachment.id}
                          className="flex gap-2 my-4">
                          {IMAGE_TYPES.some(
                            (type) => type === attachment.filetype
                          ) ? (
                            <Image
                              src={attachment.url as string}
                              alt={'Attachment Preview'}
                              fill
                              className="!h-[50px] !w-[83px] !object-cover !relative rounded-lg"
                            />
                          ) : (
                            <FileIcon className="!h-[50px] !w-[83px]" />
                          )}
                          <div className="flex flex-col">
                            <Label className="text-[8px]">
                              Added{' '}
                              {createdAt.toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </Label>
                            <p className="text-[10px]">{attachment.filename}</p>
                            <div className="flex flex-row gap-2">
                              <a
                                className={`!h-[24px] ${buttonVariants({
                                  variant: 'default',
                                })}`}
                                href={attachment.url as string}
                                target="_blank"
                                rel="noreferrer noopener">
                                Download
                              </a>
                              <Button
                                className="!h-[24px]"
                                onClick={() =>
                                  handleAttachmentDelete(attachment)
                                }>
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>
              <div>
                {/* Comments */}
                <Label>Comments</Label>
              </div>
            </div>
            <div className="">
              <div className="flex flex-col">
                <Label>Actions</Label>
                <Button>Cover</Button>
                <Button>Labels</Button>
              </div>
              <Label>Members</Label>
              <>
                {cardFromStore &&
                  cardFromStore.members.map((member: User, index) => (
                    <div
                      key={member.id}
                      className="flex flex-row place-items-center gap-2">
                      <Avatar>
                        <AvatarImage src={member?.profileImage as string} />
                        <AvatarFallback>
                          {member?.firstName?.charAt(0).toUpperCase()}
                          {member?.lastName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p>
                          {member?.firstName &&
                            member?.lastName &&
                            formatName(member.firstName, member.lastName)}
                        </p>
                      </div>
                    </div>
                  ))}
              </>
              <AddCardMember
                card={card}
                boardMembers={boardMembers}
              />
            </div>
          </div>
        </DialogHeader>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
