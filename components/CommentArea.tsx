import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import useBoardStore from '@/hooks/use-board-store';
import { addCommentPrisma } from '@/lib/add-comment-prisma';
import { Comment } from '@prisma/client';

interface CommentAreaProps {
  listId: string;
  cardId: string;
}

const CommentArea = ({ listId, cardId }: CommentAreaProps) => {
  const [comment, setComment] = useState('');
  const { addCardComment } = useBoardStore();

  const handleSubmitComment = async (listId: string, cardId: string) => {
    // create comment on prisma and add it to the card
    const prismaComment = await addCommentPrisma(cardId, comment);
    // addCommentPrisma
    if (!prismaComment) return;

    addCardComment(listId, cardId, prismaComment);
    // pass return from prisma onto our board store and add it to our card in store
    // addComment
  };

  return (
    <>
      <Label>Comments</Label>
      <Textarea
        placeholder="Write a comment..."
        onChange={(e) => setComment(e.target.value)}
        value={comment}
      />
      <Button onClick={() => handleSubmitComment(listId, cardId)}>
        Comment
      </Button>
    </>
  );
};

export default CommentArea;
