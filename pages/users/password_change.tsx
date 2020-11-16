import Layout from 'components/Layout';
import { Button, TextField, Link } from '@material-ui/core';
import styles from '../../styles/users/PasswordChange.module.css';
import { sampleUserData } from '../../utils/sample-data';

const PasswordChange: React.FC = () => {
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
                id="outlined-basic"
                label={sampleUserData[0].email}
                variant="outlined"
              />
            </div>
            <div className={styles.field}>
              New Password
              <TextField
                size="small"
                id="outlined-basic"
                label="******"
                variant="outlined"
              />
            </div>
            <div className={styles.field}>
              Confirm Password
              <TextField
                size="small"
                id="outlined-basic"
                label="******"
                variant="outlined"
              />
            </div>
          </div>
          <div className={styles.save}>
            <Link href="../users/settings">
              <Button color="primary" variant="contained" disableElevation>
                Save Changes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PasswordChange;
