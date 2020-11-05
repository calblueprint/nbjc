import { FunctionComponent } from 'react';
import Layout from 'components/Layout';
import styles from 'styles/users/SettingsEdit.module.css';
import SampleUser from './sample';
import SettingsSave from '../../components/user/save';

const UserProfSettings: FunctionComponent<{ initial?: number }> = () => {
  return (
    <Layout title="User Profile Settings">
      <div className={styles.content}>
        <SettingsSave
          userType={SampleUser.ProfileType}
          email={SampleUser.Email}
          password={SampleUser.Password}
        />
      </div>
    </Layout>
  );
};

export default UserProfSettings;
