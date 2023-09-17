'use client';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import prisma from '@/lib/prismadb';
import { useEffect, useState } from 'react';
import { Board, User } from '@prisma/client';
import { BoardWithUsersAndListsWithCards } from '@/types';
import { getUsersNotInBoard } from '@/lib/get-users-not-in-board';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import axios from 'axios';

const AddBoardMember = ({ board }: BoardWithUsersAndListsWithCards) => {
  const [members, setMembers] = useState<any>();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsersNotInBoard = async () => {
      const users = await getUsersNotInBoard({ board: board });

      setMembers(users);
    };

    if (!members) {
      fetchUsersNotInBoard();
    }
  }, [board, members, selectedUsers]);

  const handleSearch = (e: any) => {
    const search = e.target.value.toLowerCase();
    const searchArray = search.split(/\s+/).filter(Boolean);
    const filteredMembers = members.filter((member: User) => {
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
    if (!board || selectedUsers.length === 0) {
      return null;
    }
    try {
      await axios.patch(`/api/boards/${board.id}/addMember`, {
        selectedUsers,
        board,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="ml-3">
          <Plus />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          <div className="space-y-2 flex flex-col gap-2">
            <h4 className="font-medium leading-none">Invite to Board</h4>
            <p className="text-sm text-muted-foreground">
              Search users you want to invite
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
                  {search === '' && members ? (
                    members.map((member: User) => {
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
                  ) : searchResults.length === 0 ? (
                    <li>No matching members found</li>
                  ) : (
                    searchResults.map((member: User) => (
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

export default AddBoardMember;
