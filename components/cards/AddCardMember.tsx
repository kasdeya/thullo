'use client';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Input } from '../ui/input';
import prisma from '@/lib/prismadb';
import { useState } from 'react';
import { User } from '@prisma/client';
import { CardWithAttachmentsAndMembers } from '@/types';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import axios from 'axios';
import useBoardStore from '@/hooks/use-board-store';

interface AddCardProps {
  card: CardWithAttachmentsAndMembers;
  boardMembers: User[] | null | undefined;
}

const AddCardMember = ({ card, boardMembers }: AddCardProps) => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { board, updateCardMembers } = useBoardStore();

  const nonAddedMembers = () => {
    if (!card.members) {
      return boardMembers;
    }

    const idsAlreadyAdded = card.members.map((user: User) => user.id);
    const result = boardMembers?.filter(
      (boardMember: User) => !idsAlreadyAdded.includes(boardMember.id)
    );
    return result;
  };

  let test = nonAddedMembers();

  const handleSearch = (e: any) => {
    if (!boardMembers) return;

    const search = e.target.value.toLowerCase();
    const searchArray = search.split(/\s+/).filter(Boolean);
    const filteredMembers = boardMembers.filter((member: User) => {
      return searchArray.every(
        (term: string) =>
          member?.firstName?.toLowerCase().includes(term) ||
          member?.lastName?.toLowerCase().includes(term)
      );
    });
    setSearch(e.target.value);
    setSearchResults(filteredMembers);
  };

  const formatName = (firstName: string, lastName: string) => {
    const first = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const second = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    const fullName = `${first} ${second}`;
    return fullName;
  };

  const handleSelectUser = (user: User) => {
    if (userSelected(user.id) === false) {
      setSelectedUsers((prev) => [...prev, user.id]);
    } else if (userSelected(user.id) === true) {
      setSelectedUsers((prev) =>
        prev.filter((userInArr) => userInArr !== user.id)
      );
    }
  };

  const userSelected = (id: string) => {
    return selectedUsers.some((user) => user === id);
  };

  const handleSubmit = async () => {
    if (!card || selectedUsers.length === 0) {
      return null;
    }
    try {
      const newCard = await axios.patch(`/api/card/${card.id}/addMember`, {
        selectedUsers,
        card,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpen(false);

      const newMembers = (boardMembers as User[] | undefined)?.filter(
        (member: User) => selectedUsers.includes(member.id)
      );
      if (!newMembers) return;
      updateCardMembers(card.listId, card.id, newMembers);
      setSelectedUsers([]);
    }
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full mt-4 flex justify-between">
          Assign a member <Plus />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          <div className="space-y-2 flex flex-col gap-2">
            <h4 className="font-medium leading-none">Members</h4>
            <p className="text-sm text-muted-foreground">
              Assign memebers to this card
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="items-center gap-4">
              <Input
                id="user"
                className="col-span-2 h-8"
                placeholder="User..."
                value={search}
                onChange={handleSearch}
              />
            </div>
            <div className="gap-4 w-full">
              <ScrollArea className="w-full">
                <ul className="">
                  {search === '' ? (
                    test?.map((member: User) => {
                      return (
                        <li
                          onClick={() => handleSelectUser(member)}
                          className={`flex flex-row gap-2 place-items-center p-2 hover:bg-white/10 cursor-pointer w-full ${
                            userSelected(member.id) ? 'bg-white/10' : ''
                          }`}
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
                          <p>
                            {member.firstName &&
                              member.lastName &&
                              formatName(member.firstName, member.lastName)}
                          </p>
                        </li>
                      );
                    })
                  ) : searchResults?.length === 0 ? (
                    <li>No matching members found</li>
                  ) : (
                    searchResults?.map((member: User) => (
                      <li
                        onClick={() => handleSelectUser(member)}
                        className={`flex flex-row gap-2 place-items-center p-2 hover:bg-white/10 cursor-pointer ${
                          userSelected(member.id) ? 'bg-white/10' : ''
                        }`}
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
                        <p>
                          {member.firstName &&
                            member.lastName &&
                            formatName(member.firstName, member.lastName)}
                        </p>
                      </li>
                    ))
                  )}
                </ul>
              </ScrollArea>
            </div>
            <div className="flex items-center">
              <Button onClick={handleSubmit}>Invite</Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddCardMember;
