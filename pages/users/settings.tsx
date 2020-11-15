import { useState } from 'react';
import Layout from 'components/Layout';
import styles from 'styles/users/Settings.module.css';
import { Button, Link, TextField } from '@material-ui/core';
import { sampleUserData } from '../../utils/sample-data';
import ProgressStepper from '../../components/user/ProgressStepper/index';
import EmailVerify from '../../components/user/EmailVerify/index';

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const UserProfSettings: React.FC = () => {
  const [setting, setSetting] = useState(0);
  const hiddenPassword = '******';
  const emailButton =
    setting === 0 ? (
      <div className={styles.emailEdit}>
        <div>Email</div>
        <div className={styles.emailButton}>
          {sampleUserData[0].email}
          <Button
            variant="outlined"
            color="primary"
            disableElevation
            onClick={() => setSetting(1)}
          >
            Edit
          </Button>
        </div>
      </div>
    ) : (
      <div className={styles.emailEdit}>
        <div>Email</div>
        <div className={styles.emailButton}>
          <TextField
            id="email"
            defaultValue={sampleUserData[0].email}
            variant="outlined"
            size="small"
            className={styles.textfield}
          />
          <Button
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
      <div className={styles.emailEdit}>
        <div>Password</div>
        <div className={styles.emailButton}>
          {hiddenPassword}
          <Link href="../users/password_change">
            <Button variant="outlined" color="primary" disableElevation>
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
          <div className={styles.top}>
            <div className={styles.title}>
              <div>{capitalizeFirstLetter(sampleUserData[0].role)} Profile</div>
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
    </Layout>
  );
};

export default UserProfSettings;
