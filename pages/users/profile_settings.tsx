import { FunctionComponent, useState } from 'react';
import UsersDrawer from 'components/users/UsersDrawer';
import Layout from 'components/Layout';
import UserEdit from 'components/users/UserEdit';

const UserProfSettings: FunctionComponent<{ initial?: number }> = () => {
  // const [edit, setEdit] = useState(0);
  return (
    <Layout title="User Profile Settings">
      <UsersDrawer page="User">
        (edit === 0)? <UserEdit /> : undefined;
      </UsersDrawer>
    </Layout>
  );
};

export default UserProfSettings;
