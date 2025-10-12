'use client';

import getComments from '@/actions/comments/get-comments';
import { CommentWithUser } from '@/components/comments/list-comments';
import ReplyCard from '@/components/comments/reply-card';
import { useEffect, useState, useTransition } from 'react';

type ListRepliesProps = {
  comment: CommentWithUser;
  userId?: string;
};

const ListReplies = ({ comment, userId }: ListRepliesProps) => {
  const [replies, setReplies] = useState<CommentWithUser[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    startTransition(() => {
      getComments({ blogId: comment.blogId, parentId: comment.id, userId }).then((res) => {
        if (res.error) {
          setError(res.error);
        }

        if (res.success) {
          setReplies(res.success.comments);
        }
      });
    });
  }, [comment, userId]);

  return (
    <div className="text-sm">
      {isPending && <p>Loading...</p>}
      {error && <p className="text-rose-500">{error}</p>}
      {!isPending &&
        !error &&
        replies.map((reply) => {
          return (
            <div key={reply.id}>
              <ReplyCard reply={reply} />
            </div>
          );
        })}
    </div>
  );
};

export default ListReplies;
