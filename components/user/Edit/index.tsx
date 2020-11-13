import styles from '../User.module.css';

type Props = {
  userType: string | null;
  email: string;
  password: string;
};

const SettingsEdit: React.FunctionComponent<Props> = ({ email, password }) => (
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
);

export default SettingsEdit;
