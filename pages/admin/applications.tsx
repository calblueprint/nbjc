import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import Layout from 'components/Layout';
import { sampleOrgAppData } from '../../utils/sample-data';

const AdminDashboardAppIndex: React.FunctionComponent = () => (
  <Layout>
    <AdminIndex head="Application" search="Look for an Application">
      <AdminTable appData={sampleOrgAppData} />
    </AdminIndex>
  </Layout>
);

export default AdminDashboardAppIndex;
