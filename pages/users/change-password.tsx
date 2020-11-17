import Layout from 'components/Layout';
import styles from 'styles/users/PasswordChange.module.css';
import { Button, TextField } from '@material-ui/core';
import { useRouter } from 'next/router';

const email = "oskibear@berkeley.edu"

const ChangePassword: React.FC = () => {
  const router = useRouter();
  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.title}>Change Password</div>
          <div className={styles.passwords}>
            <div className={styles.field}>
              Old Password
              <TextField
                size="small"
                id="email"
                label={email}
                variant="outlined"
              />
            </div>
            <div className={styles.field}>
              New Password
              <TextField
                size="small"
                id="new-password"
                label="******"
                variant="outlined"
              />
            </div>
            <div className={styles.field}>
              Confirm Password
              <TextField
                size="small"
                id="confirm-password"
                label="******"
                variant="outlined"
              />
            </div>
          </div>
          <div className={styles.save}>
              <Button color="primary" variant="contained" onClick={() => router.push('../users/settings')} disableElevation>
                Save Changes
              </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChangePassword;
