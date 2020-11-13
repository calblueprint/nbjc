import { useState } from 'react';
import Layout from 'components/Layout';
import styles from 'styles/users/Settings.module.css';
import { Button, Link } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import SettingsShow from '../../components/user/Save/index';
import SettingsEdit from '../../components/user/Edit/index';
import { sampleUserData } from '../../utils/sample-data';
import ProgressStepper from '../../components/user/ProgressStepper/index';
import EmailVerify from '../../components/user/EmailVerify/index';

const UserProfSettings: React.FC = () => {
  const [setting, setSetting] = useState(0);
  const hiddenPassword = '******';
  const editButton =
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
    ) : null;

  const userComponent =
    setting === 0 ? (
      <SettingsEdit
        userType={sampleUserData[0].role}
        email={sampleUserData[0].email}
        password={hiddenPassword}
      />
    ) : (
      <SettingsShow
        userType={sampleUserData[0].role}
        email={sampleUserData[0].email}
        password={hiddenPassword}
      />
    );

  const showButton =
    setting === 0 ? null : (
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
      <EmailVerify />
      <div className={styles.content}>
        <div className={styles.box}>
          <div className={styles.top}>
            <div className={styles.title}>
              <div>{sampleUserData[0].role} Profile</div>
              <div className={styles.edit}>{editButton}</div>
            </div>
            <div className={styles.settings}>Settings</div>
          </div>

          {userComponent}

          <div className={styles.delete}>
            <Link>Delete User Account</Link> {showButton}
          </div>
        </div>
        <ProgressStepper />
      </div>
    </Layout>
  );
};

export default UserProfSettings;
