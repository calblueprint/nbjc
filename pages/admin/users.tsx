import { PrismaClient } from '@prisma/client';
import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import Layout from 'components/Layout';
import { TableUser } from 'interfaces/admin';
import { GetServerSideProps } from 'next';

const prisma = new PrismaClient();

type AdminUsersIndexProps = {
  users: TableUser[];
};

const AdminUsersIndex: React.FunctionComponent<AdminUsersIndexProps> = ({
  users,
}) => (
  <Layout title="Admin Users">
    <AdminIndex
      page="User"
      search="Look for a User"
      // TODO: Add button on click
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      addButtonOnClick={() => {}}
    >
      <AdminTable data={users} pageType="users" />
    </AdminIndex>
  </Layout>
);

export default AdminUsersIndex;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        role: true,
        email: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const users = JSON.parse(JSON.stringify(allUsers));
    return {
      props: { users },
    };
  } catch (err) {
    console.log(err);
    return { props: { errors: err.message } };
  }
};
