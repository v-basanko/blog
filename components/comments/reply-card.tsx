import UserSummary from '@/components/blog/user-summary';
import AddCommentsForm from '@/components/comments/add-comments-form';
import CommentReactions from '@/components/comments/comment-reactions';
import { CommentWithUser } from '@/components/comments/list-comments';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

type ReplyCardProps = {
  reply: CommentWithUser;
};

const ReplyCard = ({ reply }: ReplyCardProps) => {
  const session = useSession();
  const userId = session.data?.user.userId;

  const [showForm, setShowForm] = useState<boolean>(false);

  return (
    <div className="p-4 pr-0 flex flex-col gap-2">
      <UserSummary user={reply.user} createdDate={reply.createdAt} />
      <p>
        {reply.repliedToUser && (
          <span className="bg-secondary px-2 py-1 rounded text-sm cursor-pointer">
            @{reply.repliedToUser.name}
          </span>
        )}{' '}
        {reply.content}
      </p>
      <CommentReactions comment={reply} setShowForm={setShowForm} isReply={true} />

      {showForm && (
        <div className="border-1-2 pl-2 my-2 ml-4">
          {showForm && userId && (
            <AddCommentsForm
              blogId={reply.blogId}
              userId={userId}
              parentId={reply.parentId ? reply.parentId : undefined}
              repliedToId={reply.userId}
              placeholder="Add Reply"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReplyCard;
