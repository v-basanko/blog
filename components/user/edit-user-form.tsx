'use client';

import { editUser } from '@/actions/users/edit-user';
import Alert from '@/components/common/alert';
import Button from '@/components/common/button';
import FormField from '@/components/common/form-field';
import Heading from '@/components/common/heading';
import { tags } from '@/lib/tags';
import { EditProfileSchema, EditProfileSchemaType } from '@/schemas/edit-profile-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useState, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type EditUserFormProps = {
  user: User;
  isCredentials: boolean;
};

const EditUserForm = ({ user, isCredentials }: EditUserFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileSchemaType>({
    defaultValues: {
      name: user.name || undefined,
      bio: user.bio || undefined,
      tags: user.tags || undefined,
    },
    resolver: zodResolver(EditProfileSchema),
  });

  const onSubmit: SubmitHandler<EditProfileSchemaType> = (data: EditProfileSchemaType) => {
    setError('');
    startTransition(() => {
      editUser(data, user.id).then((res) => {
        if (res?.error) {
          setError(res.error);
        }

        if (res?.success) {
          setSuccess(res?.success);
        }
      });
    });
  };

  return (
    <form
      className="flex flex-col max-w-[500px] m-auto mt-8 gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Heading title="Update Profile" lg center />
      <FormField
        id="name"
        type="text"
        register={register}
        placeholder="Name"
        errors={errors}
        disabled={isPending}
        label="Name"
      />
      {isCredentials && (
        <FormField
          id="email"
          type="text"
          register={register}
          placeholder="Email"
          errors={errors}
          disabled={isPending || !isCredentials}
        />
      )}
      <FormField
        id="bio"
        type="text"
        register={register}
        placeholder="Bio"
        errors={errors}
        disabled={isPending}
        label="Bio"
      />
      <fieldset className="flex flex-col">
        <legend className="mb-2 pr-2">Select tags</legend>
        <div className="flex gap-4 flex-wrap w-full">
          {tags.map((tag) => {
            if (tag === 'All') {
              return null;
            }
            return (
              <label key={tag} className="flex items-center space-x-2">
                <input type="checkbox" value={tag} {...register('tags')} disabled={false} />
                <span>{tag}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {error && <Alert message={error} error />}
      {success && <Alert message={success} success />}
      <Button type="submit" label={isPending ? 'Saving' : 'Save changes'} disabled={isPending} />
    </form>
  );
};

export default EditUserForm;
