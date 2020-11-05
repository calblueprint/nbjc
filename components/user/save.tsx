import styles from 'styles/users/SettingsEdit.module.css';
import { Button, Link, TextField } from '@material-ui/core';

type Props = {
  userType: string;
  email: string;
  password: string;
};

const SettingsSave: React.FunctionComponent<Props> = ({
  userType,
  email,
  password,
}) => (
  <div className={styles.box}>
    <div className={styles.top}>
      <div className={styles.title}>{userType} Profile</div>
      <div className={styles.settings}>User Account Settings</div>
    </div>
    <div className={styles.middle}>
      <div className={styles.userInfo}>
        <div className={styles.text}>Email</div>
        <TextField
          id="email"
          defaultValue={email}
          variant="outlined"
          size="small"
        />
      </div>
      <div className={styles.userInfo}>
        <div className={styles.text}>Password</div>
        <TextField
          id="password"
          defaultValue={password}
          variant="outlined"
          size="small"
        />
      </div>
    </div>
    <div className={styles.delete}>
      <div>
        <Link>Delete User Account</Link>
      </div>
      <div>
        <Link href="/users/settings_edit">
          <Button variant="contained" color="primary" disableElevation>
            Save
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

export default SettingsSave;
