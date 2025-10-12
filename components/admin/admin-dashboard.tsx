import { getCounts } from '@/actions/admin/get-counts';
import Heading from '@/components/common/heading';

const AdminDashboard = async () => {
  const res = await getCounts();

  const usersCount = res.success?.usersCount ?? 0;
  const blogsCount = res.success?.blogsCount ?? 0;

  return (
    <div>
      <Heading title="Analitics" center lg></Heading>
      <div className="flex items-center flex-wrap justify-center mt-12 gap-12">
        <div className="flex flex-col items-center gap-2 border rounded-sm px-12 py-8 text-4x1">
          <span className="font-bold">{usersCount}</span>
          <span>Users</span>
        </div>
        <div className="flex flex-col items-center gap-2 border rounded-sm px-12 py-8 text-4x1">
          <span className="font-bold">{blogsCount}</span>
          <span>Blogs</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
