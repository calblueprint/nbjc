import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import Layout from 'components/Layout';
import { sampleOrgAppData } from '../../utils/sample-data';

const AdminDashboardAppIndex: React.FunctionComponent = () => (
  <Layout>
    <AdminIndex page="Application" search="Look for an Application">
      <AdminTable data={sampleOrgAppData} pageType="applications" />
    </AdminIndex>
  </Layout>
);

export default AdminDashboardAppIndex;
