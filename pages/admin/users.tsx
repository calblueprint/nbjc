import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import Layout from 'components/Layout';
import { sampleUserData } from 'utils/sample-data';

const AdminDashboardAppIndex: React.FunctionComponent = () => (
  <Layout title="Admin Users">
    <AdminIndex head="User" search="Look for a User">
      <AdminTable useData={sampleUserData} />
    </AdminIndex>
  </Layout>
);

export default AdminDashboardAppIndex;
