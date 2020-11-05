import styles from 'styles/users/SettingsEdit.module.css';
import { Button, Link } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';

type Props = {
  userType: string;
  email: string;
  password: string;
};

const SettingsEdit: React.FunctionComponent<Props> = ({
  userType,
  email,
  password,
}) => (
  <div className={styles.box}>
    <div className={styles.top}>
      <div className={styles.title}>
        <div>{userType} Profile</div>
        <div className={styles.edit}>
          <Link href="/users/settings_save">
            <Button
              variant="outlined"
              color="primary"
              disableElevation
              startIcon={<CreateIcon />}
            >
              Edit
            </Button>
          </Link>
        </div>
      </div>
      <div className={styles.settings}>Settings</div>
    </div>
    <div className={styles.middle}>
      <div className={styles.userInfo}>
        <div className={styles.text}>Email</div>
        <div>{email}</div>
      </div>
      <div className={styles.userInfo}>
        <div className={styles.text}>Password</div>
        <div>{password}</div>
      </div>
    </div>
    <div className={styles.delete}>
      <Link>Delete User Account</Link>
    </div>
  </div>
);

export default SettingsEdit;
