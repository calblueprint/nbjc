import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from 'components/Layout';
import styles from 'styles/users/Settings.module.css';
import { Button, TextField, Link } from '@material-ui/core';
import ProgressStepper from '../../components/user/ProgressStepper/index';

const email = 'oskibear@berkeley.edu';
const profileType = 'admin';

const UserProfSettings: React.FC = () => {
  const router = useRouter();
  const [setting, setSetting] = useState(0);
  const hiddenPassword = '******';
  const emailButton =
    setting === 0 ? (
      <div className={styles.emailEdit}>
        <div>Email</div>
        <div className={styles.emailButton}>
          {email}
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
            defaultValue={email}
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
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push('../users/change-password')}
            disableElevation
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="User Profile Settings">
      <div className={styles.content}>
        <div className={styles.box}>
          <div className={styles.top}>
            <div className={styles.title}>
              <div className={styles.caps}>{profileType} Profile</div>
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
