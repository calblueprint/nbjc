import { FunctionComponent } from 'react';
import Layout from 'components/Layout';
import styles from 'styles/users/SettingsEdit.module.css';
import SampleUser from './sample';
import SettingsEdit from '../../components/user/edit';

const UserProfSettings: FunctionComponent<{ initial?: number }> = () => {
  const hiddenPassword: string = '*'.repeat(SampleUser.Password.length);
  return (
    <Layout title="User Profile Settings">
      <div className={styles.content}>
        <SettingsEdit
          userType={SampleUser.ProfileType}
          email={SampleUser.Email}
          password={hiddenPassword}
        />
      </div>
    </Layout>
  );
};

export default UserProfSettings;
