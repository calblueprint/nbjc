import AdminIndex from 'components/adminDash/AdminIndex';
import AdminTable from 'components/adminDash/AdminTable';
// eslint-disable-next-line import/extensions
import { sampleOrgData } from 'utils/sample-data.ts';

const AdminDashboardOrgIndex: React.FunctionComponent = () => (
  <AdminIndex head="Organization" search="Look for an Organization">
    <AdminTable useData={sampleOrgData} />
  </AdminIndex>
);

export default AdminDashboardOrgIndex;
