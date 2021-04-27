import prisma from 'utils/prisma';
import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import Layout from 'components/Layout';
import { TableOrgApplication } from 'interfaces/admin';
import { GetServerSideProps } from 'next';
import getSession from 'utils/getSession';

type AdminAppIndexProps = {
  orgs: TableOrgApplication[];
};

const AdminAppIndex: React.FunctionComponent<AdminAppIndexProps> = ({
  orgs,
}) => (
  <Layout>
    <AdminIndex
      page="Application"
      search="Look for an Application"
      // TODO: Add button on click
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      addButtonOnClick={() => {}}
    >
      <AdminTable data={orgs} pageType="applications" />
    </AdminIndex>
  </Layout>
);

export default AdminAppIndex;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);
    if (session && session.user.role === 'admin') {
      const orgs = await prisma.organization.findMany({
        where: {
          active: false,
        },
        select: {
          id: true,
          name: true,
          applicationStatus: true,
          contactName: true,
          contactEmail: true,
          contactPhone: true,
          createdAt: true,
        },
      });
      return {
        props: { orgs },
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
