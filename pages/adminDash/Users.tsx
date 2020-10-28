import AdminIndex from 'components/adminDash/AdminIndex';
import AdminTable from 'components/adminDash/AdminTable';
// eslint-disable-next-line import/extensions
import { sampleUserData } from 'utils/sample-data.ts';

const AdminDashboardAppIndex: React.FunctionComponent = () => (
  <AdminIndex head="User" search="Look for a User">
    <AdminTable useData={sampleUserData} />
  </AdminIndex>
);

export default AdminDashboardAppIndex;
