import UsersDrawer from 'components/users/UsersDrawer';
import Layout from 'components/Layout';

const UserProfSettings: React.FC = () => {
  return (
    <Layout title="User Profile Settings">
      <UsersDrawer page="User">
        <p>hi</p>
      </UsersDrawer>
    </Layout>
  );
};

export default UserProfSettings;
