'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { XCircle } from 'lucide-react';
import axios from 'axios';
import { User } from '@prisma/client';
const MemberList = ({ board }: any) => {
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
    <>
      <Avatar>
        {board?.owner.profileImage ? (
          <AvatarImage src={board.owner.profileImage} />
        ) : (
          <AvatarFallback>
            {board?.owner.firstName?.charAt(0).toUpperCase()}
            {board?.owner.lastName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
      {board?.members.map((member: User) => (
        <Avatar key={member.id} className=" overflow-visible">
          {member.profileImage ? (
            <AvatarImage src={member.profileImage} />
          ) : (
            <AvatarFallback>
              {member.firstName?.charAt(0).toUpperCase()}
              {member.lastName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}

          {/* <button
            onClick={() => handleRemoveMember(member.id)}
            className="absolute -right-3 -top-3 text-rose-700"
          >
            <XCircle />
          </button> */}
        </Avatar>
      ))}
    </>
  );
};

export default MemberList;
