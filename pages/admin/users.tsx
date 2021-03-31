import prisma from 'utils/prisma';
import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import Layout from 'components/Layout';
import { TableUser } from 'interfaces/admin';
import { GetServerSideProps } from 'next';
import getSession from 'utils/getSession';

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);
    if (session && session.user.role === 'admin') {
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
    }
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
};
