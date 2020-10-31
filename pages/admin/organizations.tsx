import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import Layout from 'components/Layout';
import { sampleOrgData } from 'utils/sample-data';

const AdminDashboardOrgIndex: React.FunctionComponent = () => (
  <Layout>
    <AdminIndex head="Organization" search="Look for an Organization">
      <AdminTable useData={sampleOrgData} />
    </AdminIndex>
  </Layout>
);

export default AdminDashboardOrgIndex;
