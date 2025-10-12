'use client';

import { addComment } from '@/actions/comments/add-comment';
import { createNotification } from '@/actions/notifications/create-notification';
import Button from '@/components/common/button';
import TextAreaField from '@/components/common/text-area';
import { useSocket } from '@/context/socket-context';
import { CommentSchema, CommentSchemaType } from '@/schemas/comment-schema';
import { NotificationType } from '@/shared/enum/notification-type.enum';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type AddCommentsFormProps = {
  blogId: string;
  parentId?: string;
  repliedToId?: string;
  placeholder?: string;
  creatorId?: string;
};

const AddCommentsForm = ({
  blogId,
  parentId,
  repliedToId,
  placeholder,
  creatorId,
}: AddCommentsFormProps) => {
  const [isPending, startTransition] = useTransition();
  const { sendNotification } = useSocket();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentSchemaType>({
    resolver: zodResolver(CommentSchema),
  });

  const onSubmit: SubmitHandler<CommentSchemaType> = (data) => {
    startTransition(() => {
      addComment({
        values: data,
        blogId,
        parentId,
        repliedToUserId: repliedToId,
      }).then(async (result) => {
        if (result.error) {
          return toast.error(result.error);
        }
        if (result.success) {
          if (repliedToId) {
            await createNotification({
              recipientId: repliedToId,
              type: NotificationType.COMMENT_REPLY,
              commentId: parentId,
              entityType: 'COMMENT',
              content: data.content,
            });

            sendNotification(repliedToId);
          }

          if (creatorId) {
            await createNotification({
              recipientId: creatorId,
              type: NotificationType.NEW_COMMENT,
              blogId,
              entityType: 'BLOG',
              content: data.content,
            });

            sendNotification(creatorId);
          }

          toast.success(result.success);
          reset();
        }
      });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col my-2">
      <TextAreaField
        id="content"
        register={register}
        errors={errors}
        placeholder={placeholder ? placeholder : 'Add comment'}
        disabled={isPending}
        inputClassNames=""
      />
      <div>
        <Button type="submit" label={isPending ? 'Submitting...' : 'Submit'}></Button>
      </div>
    </form>
  );
};

export default AddCommentsForm;
