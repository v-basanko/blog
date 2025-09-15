'use client';

import Button from '@/components/common/button';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';

type EditProfileButtonProps = {
  user: User;
};

const EditProfileButton = ({ user }: EditProfileButtonProps) => {
  const router = useRouter();

  return <Button onClick={() => router.push(`/user/edit/${user.id}`)} label="Edit" />;
};

export default EditProfileButton;
