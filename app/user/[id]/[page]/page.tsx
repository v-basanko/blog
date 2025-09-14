import Alert from '@/components/common/alert';
import UserProfile from '@/components/user/user-profile';
import { db } from '@/lib/db';

const ProfilePage = async ({ params }: { params: Promise<{ id: string; page: string }> }) => {
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
