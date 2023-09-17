'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { BoardWithUsersAndListsWithCards } from '@/types';
import { MoreHorizontal, Pencil } from 'lucide-react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { editBoardTitle } from '@/lib/edit-board-title';

const BoardMenu = ({ board }: BoardWithUsersAndListsWithCards) => {
  const [description, setDescription] = useState(
    board?.description ? board.description : ''
  );
  const [isEditing, setIsEditing] = useState(false);
  const { data: session, status } = useSession();
  const [editTitle, setEditTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(board?.title ? board.title : '');

  const formatName = (firstName: string, lastName: string) => {
    const first = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const second = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    const fullName = `${first} ${second}`;
    return fullName;
  };
  const handleEditDescription = async () => {
    try {
      await axios.patch(`/api/boards/${board?.id}/editDescription`, {
        description,
        board,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditing(false);
    }
  };
  const handleRemoveMember = async (userId: string) => {
    try {
      await axios.patch(`/api/boards/${board?.id}/removeMember`, {
        userId,
        board,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditTitle = async () => {
    if (newTitle === board?.title) return;
    if (!board || !newTitle) return;
    editBoardTitle(board?.id, newTitle);
    setEditTitle(false);
  };

  const handleCancelEditTitle = () => {
    setNewTitle(board?.title as string);
    setEditTitle(false);
  };

  const createdAt = !board?.createdAt ? null : new Date(board.createdAt);

  useEffect(() => {
    setDescription(board?.description ?? '');
  }, [description, board]);

  return (
    <Sheet>
      <SheetTrigger className="flex flex-row gap-2 place-items-center">
        <MoreHorizontal /> Show Menu
      </SheetTrigger>
      <SheetContent>
        {/* <ScrollArea className="h-full w-full  p-5"> */}
        <SheetHeader>
          {!editTitle ? (
            <SheetTitle
              className="font-extrabold"
              onClick={() => setEditTitle(true)}>
              {/* {board?.title} */}
              {newTitle}
            </SheetTitle>
          ) : (
            <div className="flex flex-row place-items-center">
              <Input
                className="m-3"
                onChange={(e) => setNewTitle(e.target.value)}
                value={newTitle}
              />
              <Button onClick={handleEditTitle}>Save</Button>
              <Button
                variant={'ghost'}
                onClick={handleCancelEditTitle}>
                Cancel
              </Button>
            </div>
          )}
          <div>
            <span className="font-bold">Made by</span>
            <div className="flex flex-row place-items-center gap-2">
              <Avatar>
                <AvatarImage src={board?.owner.profileImage as string} />
                <AvatarFallback>
                  {board?.owner.firstName?.charAt(0).toUpperCase()}
                  {board?.owner.lastName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="">
                <p>
                  {board?.owner.firstName &&
                    board?.owner.lastName &&
                    formatName(board.owner.firstName, board.owner.lastName)}
                </p>
                <p className=" text-xs">
                  {createdAt &&
                    createdAt.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row place-items-center gap-2">
            <span className="font-bold">Description</span>
            <span className="text-[10px] text-green-500">markdown enabled</span>
            {session?.user?.email && (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex gap-2 bg-transparent border-gray-500 border-2 text-gray-500 h-[30px]">
                <Pencil size={15} />
                Edit
              </Button>
            )}
          </div>
          {!isEditing && (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {description}
            </ReactMarkdown>
          )}
          {isEditing && (
            <>
              <Textarea
                value={description as string}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button onClick={handleEditDescription}>Save</Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </>
          )}
          <span className="font-bold">Team</span>

          <div className="flex flex-col gap-2">
            {board && (
              <div className="flex flex-row place-items-center gap-2">
                <Avatar>
                  <AvatarImage src={board?.owner.profileImage as string} />
                  <AvatarFallback>
                    {board.owner.firstName?.charAt(0).toUpperCase()}
                    {board.owner.lastName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p>
                  {board.owner.firstName &&
                    board.owner.lastName &&
                    formatName(board.owner.firstName, board.owner.lastName)}
                </p>
              </div>
            )}
            {board?.members.map((member) => (
              <div
                className="flex flex-row place-items-center gap-2"
                key={member.id}>
                <Avatar>
                  {member.profileImage ? (
                    <AvatarImage src={member.profileImage} />
                  ) : (
                    <AvatarFallback>
                      {member.firstName?.charAt(0).toUpperCase()}
                      {member.lastName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-row place-items-center justify-between w-full">
                  <p>
                    {member.firstName &&
                      member.lastName &&
                      formatName(member.firstName, member.lastName)}
                  </p>

                  {session?.user?.email && (
                    <Button
                      onClick={() => handleRemoveMember(member.id)}
                      className="bg-transparent text-rose-600 border-rose-600 border">
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SheetHeader>
        {/* </ScrollArea> */}
      </SheetContent>
    </Sheet>
  );
};

export default BoardMenu;
