import AdminIndex from 'components/admin/AdminIndex';
import AdminTable from 'components/admin/AdminTable';
import Layout from 'components/Layout';
import { sampleQuestionData } from 'utils/sample-data';

const AdminDashboardQuestionIndex: React.FunctionComponent = () => (
  <Layout>
    <AdminIndex page="Questions" search="Look for a question">
      <AdminTable data={sampleQuestionData} pageType="questions" />
    </AdminIndex>
  </Layout>
);

export default AdminDashboardQuestionIndex;
