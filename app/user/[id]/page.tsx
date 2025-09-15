import { ParamId } from '@/shared/types/param-id';
import { redirect } from 'next/navigation';

const UserPage = async ({ params }: { params: Promise<ParamId> }) => {
  const { id } = await params;

  redirect(`/user/${id}/1`);
};

export default UserPage;
