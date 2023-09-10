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
import { useState } from 'react';
import axios from 'axios';

const BoardMenu = ({ board }: BoardWithUsersAndListsWithCards) => {
  const [description, setDescription] = useState(
    board?.description ? board.description : ''
  );
  const [isEditing, setIsEditing] = useState(false);
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
    console.log(userId);
    try {
      await axios.patch(`/api/boards/${board?.id}/removeMember`, {
        userId,
        board,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Sheet>
      <SheetTrigger className="flex flex-row gap-2 place-items-center">
        <MoreHorizontal /> Show Menu
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{board?.title}</SheetTitle>
          <div>
            <Label>Made by</Label>
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
                  {board?.createdAt.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row place-items-center gap-2">
            <Label>Description</Label>
            <Button
              onClick={() => setIsEditing(true)}
              className="flex gap-2 bg-transparent border-gray-500 border-2 text-gray-500 h-[30px]"
            >
              <Pencil size={15} />
              Edit
            </Button>
          </div>
          {!isEditing && <SheetDescription>{description}</SheetDescription>}
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
          <Label>Team</Label>

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
                key={member.id}
              >
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
                  <Button
                    onClick={() => handleRemoveMember(member.id)}
                    className="bg-transparent text-rose-600 border-rose-600 border"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default BoardMenu;
