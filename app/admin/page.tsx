import { auth } from '@/auth';
import AdminDashboard from '@/components/admin/admin-dashboard';
import Alert from '@/components/common/alert';
import Container from '@/components/layout/container';
import { UserRole } from '@/shared/enum/user-role.enum';

const Admin = async () => {
  const session = await auth();

  const isAdmin = session?.user?.role === UserRole.ADMIN;

  if (!isAdmin)
    return (
      <Container>
        <Alert error message={'Access Denied'} />
      </Container>
    );

  return (
    <Container>
      <AdminDashboard />
    </Container>
  );
};

export default Admin;
