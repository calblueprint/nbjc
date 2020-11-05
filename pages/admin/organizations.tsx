import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import Layout from 'components/Layout';
import { sampleOrgData } from 'utils/sample-data';

const AdminDashboardOrgIndex: React.FunctionComponent = () => (
  <Layout>
    <AdminIndex page="Organization" search="Look for an Organization">
      <AdminTable data={sampleOrgData} pageType="organizations" />
    </AdminIndex>
  </Layout>
);

export default AdminDashboardOrgIndex;
