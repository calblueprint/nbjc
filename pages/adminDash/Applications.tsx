import AdminIndex from 'components/adminDash/AdminIndex';
import AdminTable from 'components/adminDash/AdminTable';
// eslint-disable-next-line import/extensions
import { sampleOrgAppData } from '../../utils/sample-data.ts';

const AdminDashboardAppIndex: React.FunctionComponent = () => (
  <AdminIndex head="Application" search="Look for an Application">
    <AdminTable appData={sampleOrgAppData} />
  </AdminIndex>
);

export default AdminDashboardAppIndex;
