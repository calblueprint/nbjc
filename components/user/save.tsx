import styles from 'styles/users/SettingsEdit.module.css';
import { TextField } from '@material-ui/core';

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
);

export default SettingsSave;
