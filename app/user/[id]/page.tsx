import { redirect } from 'next/navigation';

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  redirect(`/user/${id}/1`);
};

export default UserPage;
