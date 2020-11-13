import { TextField } from '@material-ui/core';
import styles from '../User.module.css';

type Props = {
  userType: string | null;
  email: string;
  password: string;
};

const SettingsShow: React.FunctionComponent<Props> = ({ email, password }) => (
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

export default SettingsShow;
