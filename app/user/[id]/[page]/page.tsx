import Alert from '@/components/common/alert';
import UserProfile from '@/components/user/user-profile';
import { db } from '@/lib/db';
import { ParamId } from '@/shared/types/param-id';
import { ParamPage } from '@/shared/types/param-page';

export type ProfilePageProps = {
  params: Promise<ParamId & ParamPage>;
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { id, page } = await params;

  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) return <Alert error message="User not found" />;

  return <UserProfile user={user} page={page} />;
};

export default ProfilePage;
