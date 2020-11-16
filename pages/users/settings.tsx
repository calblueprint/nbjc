import { useState } from 'react';
import Layout from 'components/Layout';
import { Button, Link, TextField } from '@material-ui/core';
import ProgressStepper from 'components/user/ProgressStepper/index';
import EmailVerify from 'components/user/EmailVerify/index';
import { sampleUserData } from 'utils/sample-data';
import styles from '../../styles/users/Settings.module.css';

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const UserProfSettings: React.FC = () => {
  const [setting, setSetting] = useState(0);
  const hiddenPassword = '******';
  const emailButton =
    setting === 0 ? (
      <div className={styles.field}>
        <div>Email</div>
        <div className={styles.fieldRight}>
          {sampleUserData[0].email}
          <Button
            variant="outlined"
            color="primary"
            disableElevation
            onClick={() => setSetting(1)}
            className={styles.fieldButton}
          >
            Edit
          </Button>
        </div>
      </div>
    ) : (
      <div className={styles.field}>
        <div>Email</div>
        <div className={styles.fieldRight}>
          <TextField
            id="email"
            defaultValue={sampleUserData[0].email}
            variant="outlined"
            size="small"
          />
          <Button
            className={styles.fieldButton}
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => setSetting(0)}
          >
            Save
          </Button>
        </div>
      </div>
    );

  const passwordButton = (
    <div className={styles.passwordButton}>
      <div className={styles.field}>
        <div>Password</div>
        <div className={styles.fieldRight}>
          {hiddenPassword}
          <Link href="../users/password_change">
            <Button
              variant="outlined"
              color="primary"
              disableElevation
              className={styles.fieldButton}
            >
              Edit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="User Profile Settings">
      <EmailVerify />
      <div className={styles.content}>
        <div className={styles.box}>
          <div className={styles.settingsBox}>
            <div className={styles.top}>
              <div className={styles.title}>
                <div>
                  {capitalizeFirstLetter(sampleUserData[0].role)} Profile
                </div>
              </div>
              <div className={styles.settings}>Settings</div>
            </div>
            {emailButton}
            {passwordButton}

            <div className={styles.delete}>
              <Link>Delete User Account</Link>
            </div>
          </div>
          <ProgressStepper />
        </div>
      </div>
    </Layout>
  );
};

export default UserProfSettings;
