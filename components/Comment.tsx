import { CommentWithUser } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Fragment, useState } from 'react';
import { Textarea } from './ui/textarea';
import { editComment } from '@/hooks/edit-comment';
import { deleteComment } from '@/hooks/delete-comment';

const Comment = ({ comment }: any) => {
  const [edit, setEdit] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [commentBody, setCommentBody] = useState(
    comment.body ? comment.body : ''
  );
  const [responseComment, setResponseComment] = useState('');
  const [editted, setEditted] = useState(false);

  console.log(comment);

  const date = new Date(comment.createdAt);

  const formatName = (firstName: string, lastName: string) => {
    const first = firstName?.charAt(0).toUpperCase() + firstName?.slice(1);
    const second = lastName?.charAt(0).toUpperCase() + lastName?.slice(1);
    const fullName = `${first} ${second}`;
    return fullName;
  };

  const handleCancelComment = () => {
    setCommentBody(
      !!responseComment ? responseComment : comment?.body ? comment.body : ''
    );
    setEdit(false);
  };

  const handleChangeComment = async () => {
    try {
      const response = await editComment(comment.id, commentBody);
      if (!response) return;
      setResponseComment(response.body);
      setEdit(false);
      setEditted(true);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleDeleteComment = async () => {
    await deleteComment(comment.id);
    setIsDeleted(true);
  };

  if (!isDeleted) {
    return (
      <div className="border-b border-gray-200/10 py-8">
        <div className="flex flex-row gap-4">
          <Avatar>
            <AvatarImage src={comment.user?.profileImage} />
            <AvatarFallback>
              <AvatarFallback>
                {comment.user?.firstName?.charAt(0).toUpperCase()}
                {comment.user?.lastName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-row justify-between w-full">
            <div>
              <p className="font-medium text-[14px]">
                {formatName(comment.user?.firstName, comment.user?.lastName)}
              </p>
              <p className="text-gray-400 text-[12px]">
                {date.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="w-full flex flex-row justify-end gap-3 place-items-center">
            {!edit && (
              <Button
                variant={'ghost'}
                onClick={() => setEdit(true)}
                className="w-min p-1 h-min">
                Edit
              </Button>
            )}
            {edit && (
              <Button
                variant={'ghost'}
                className="w-min p-1 h-min"
                onClick={handleCancelComment}>
                Cancel
              </Button>
            )}{' '}
            -{' '}
            <Button
              variant={'ghost'}
              onClick={handleDeleteComment}
              className="w-min p-1 h-min">
              Delete
            </Button>
          </div>
        </div>
        {edit && (
          <Fragment>
            <Textarea
              onChange={(e) => setCommentBody(e.target.value)}
              value={commentBody}
            />
            <Button onClick={handleChangeComment}>Save</Button>
          </Fragment>
        )}

        {edit ? null : !edit && !responseComment ? (
          <Fragment>
            <p className="mt-2 ml-1 text-[16px]">{comment?.body}</p>
            {(editted || comment.editted) && <p>(edited)</p>}
          </Fragment>
        ) : (
          <Fragment>
            <p className="mt-2 ml-1 text-[16px]">{responseComment}</p>
            {(editted || comment.editted) && <p>(edited)</p>}
          </Fragment>
        )}
      </div>
    );
  }

  if (isDeleted) {
    return null;
  }
};

export default Comment;
