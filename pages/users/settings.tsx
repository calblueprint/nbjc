import { useState } from 'react';
import Layout from 'components/Layout';
import styles from 'styles/users/SettingsEdit.module.css';
import { Button, Link } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import SettingsSave from '../../components/user/Save/index';
import SettingsEdit from '../../components/user/Edit/index';
import { SampleUser } from '../../utils/sample-data';

const UserProfSettings: React.FC = () => {
  const [setting, setSetting] = useState(0);
  const hiddenPassword = '******';
  const editButton: typeof Button =
    setting === 0 ? (
      <Button
        variant="outlined"
        color="primary"
        disableElevation
        startIcon={<CreateIcon />}
        onClick={() => setSetting(1)}
      >
        Edit
      </Button>
    ) : undefined;

  const userComponent: React.ReactElement =
    setting === 0 ? (
      <SettingsEdit
        userType={SampleUser.ProfileType}
        email={SampleUser.Email}
        password={hiddenPassword}
      />
    ) : (
      <SettingsSave
        userType={SampleUser.ProfileType}
        email={SampleUser.Email}
        password={hiddenPassword}
      />
    );

  const saveButton: typeof Button =
    setting === 0 ? undefined : (
      <Button
        onClick={() => setSetting(0)}
        variant="contained"
        color="primary"
        disableElevation
      >
        Save
      </Button>
    );
  return (
    <Layout title="User Profile Settings">
      <div className={styles.content}>
        <div className={styles.box}>
          <div className={styles.top}>
            <div className={styles.title}>
              <div>{SampleUser.ProfileType} Profile</div>
              <div className={styles.edit}>{editButton}</div>
            </div>
            <div className={styles.settings}>Settings</div>
          </div>

          {userComponent}

          <div className={styles.delete}>
            <Link>Delete User Account</Link> {saveButton}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfSettings;
