'use client';

import UserSummary from '@/components/blog/user-summary';
import AddCommentsForm from '@/components/comments/add-comments-form';
import CommentReactions from '@/components/comments/comment-reactions';
import { CommentWithUser } from '@/components/comments/list-comments';
import ListReplies from '@/components/comments/list-replies';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

type CommentCardProps = {
  comment: CommentWithUser;
};

const CommentCard = ({ comment }: CommentCardProps) => {
  const session = useSession();
  const userId = session.data?.user.userId;

  const [showForm, setShowForm] = useState<boolean>(false);
  const [showReplies, setShowReplies] = useState<boolean>(false);

  return (
    <div className="border-2 p-4 flex flex-col gap-2 rounded-md mt-6">
      <UserSummary user={comment.user} createdDate={comment.createdAt} />
      <p>{comment.content}</p>
      <CommentReactions
        comment={comment}
        setShowForm={setShowForm}
        setShowReplies={setShowReplies}
      />

      {(showForm || showReplies) && (
        <div className="border-1-2 pl-2 my-2 ml-4">
          {showForm && userId && (
            <AddCommentsForm
              blogId={comment.blogId}
              parentId={comment.id}
              repliedToId={comment.userId}
              placeholder="Add Reply"
            />
          )}
          {showReplies && <ListReplies comment={comment} userId={userId} />}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
