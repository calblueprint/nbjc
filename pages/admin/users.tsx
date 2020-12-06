import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import Layout from 'components/Layout';
import { sampleUserData } from 'utils/sample-data';

const AdminDashboardAppIndex: React.FunctionComponent = () => (
  <Layout title="Admin Users">
    <AdminIndex
      page="User"
      search="Look for a User"
      // TODO: Add button on click
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      addButtonOnClick={() => {}}
    >
      <AdminTable data={sampleUserData} pageType="users" />
    </AdminIndex>
  </Layout>
);

export default AdminDashboardAppIndex;
