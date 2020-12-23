import { Organization } from '@prisma/client';
import prisma from 'utils/prisma';
import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import Layout from 'components/Layout';
import { GetServerSideProps } from 'next';
import getSession from 'utils/getSession';

type AdminOrgIndexProps = {
  orgs: Organization[];
};

const AdminOrgIndex: React.FunctionComponent<AdminOrgIndexProps> = ({
  orgs,
}) => (
  <Layout>
    <AdminIndex
      page="Organization"
      search="Look for an Organization"
      // TODO: Add button on click
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      addButtonOnClick={() => {}}
    >
      <AdminTable data={orgs} pageType="organizations" />
    </AdminIndex>
  </Layout>
);

export default AdminOrgIndex;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);
    if (session && session.user.role === 'admin') {
      const approvedOrganizations = await prisma.organization.findMany({
        where: {
          active: true,
        },
        select: {
          id: true,
          name: true,
          organizationType: true,
          workType: true,
          contactName: true,
          contactEmail: true,
          createdAt: true,
        },
      });
      const orgs = JSON.parse(JSON.stringify(approvedOrganizations));
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
