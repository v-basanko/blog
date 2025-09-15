import { auth } from '@/auth';
import Alert from '@/components/common/alert';
import EditUserForm from '@/components/user/edit-user-form';
import { db } from '@/lib/db';
import { getUserById } from '@/lib/user';
import { ParamId } from '@/shared/types/param-id';

type EditUserPageProps = {
  params: Promise<ParamId>;
};

const EditUserPage = async ({ params }: EditUserPageProps) => {
  const { id } = await params;

  const user = await getUserById(id);

  if (!user) return <Alert error message="User not found" />;

  const session = await auth();

  if (session?.user.userId !== user.id) {
    return <Alert error message="You are not authorized to edit this user" />;
  }

  const account = await db.account.findFirst({
    where: {
      userId: user.id,
    },
  });

  const isOAuthProvider = ['google', 'github'].includes(account?.provider);

  const isCredentials = !isOAuthProvider;

  return <EditUserForm user={user} isCredentials={isCredentials} />;
};

export default EditUserPage;
