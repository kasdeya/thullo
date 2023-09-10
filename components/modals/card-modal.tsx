import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { useModal } from '@/hooks/use-modal-store';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { PencilIcon, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Textarea } from '../ui/textarea';
import axios from 'axios';
import AddCardMember from '../cards/AddCardMember';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { FileUploadButton } from '../UploadButton';
import { Attachment, Card } from '@prisma/client';
import { getCardAttachments } from '@/hooks/get-card-attachments';
const CardModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { card, members, listName } = data;
  // const { card }: Card & { fileAttachments: Attachment[] } = data;
  const [description, setDescription] = useState(
    !!card?.description ? card.description : ''
  );
  const [responseDescription, setResponseDescription] = useState();
  const [editDescription, setEditDescription] = useState(false);
  const [file, setFile] = useState('');
  const [attachments, setAttachments] = useState<Attachment[] | null>();

  useEffect(() => {
    if (!!card?.description) setDescription(card?.description);

    const fetchAttachments = async () => {
      try {
        if (!card) return;
        const fetchedAttachments = await getCardAttachments(card.id);
        setAttachments(fetchedAttachments);
        console.log('ran');
      } catch (error) {
        console.log(error);
      }
    };

    fetchAttachments();
    console.log(attachments);
  }, [card?.description, card, attachments]);

  const isModalOpen = isOpen && type === 'cardModal';

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
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
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
              <Button onClick={() => setEditDescription(true)}>
                <PencilIcon size={15} className="mr-2" />
                Edit
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
                <div>
                  <Label>Attachments</Label>
                  <Button>
                    <Plus size={15} className="mr-2" /> Add
                  </Button>
                  <FileUploadButton
                    endpoint="cardFile"
                    value={file ? file : ''}
                    onChange={(e) => setFile(e as string)}
                    cardId={card.id}
                  />
                </div>
                {attachments &&
                  attachments.map((attachment: any) => (
                    <div key={attachment.id}>{attachment.filename}</div>
                  ))}
              </div>
              {/* Comments */}
            </div>
            <div className="">
              <div className="flex flex-col">
                <Label>Actions</Label>
                <Button>Cover</Button>
                <Button>Labels</Button>
              </div>
              <Label>Members</Label>
              {/* Actions */}
              {/* Members */}
              {members &&
                members.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-row place-items-center gap-2"
                  >
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

              <AddCardMember {...card} />
            </div>
          </div>
        </DialogHeader>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
