import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import {
  Button,
  TextField,
  Link,
  LinearProgress,
  CircularProgress,
} from '@material-ui/core';
import useSession from 'utils/useSession';
import ProgressStepper from 'components/user/ProgressStepper/index';
import styles from '../../styles/users/Profile.module.css';

const UserProfile: React.FC = () => {
  const router = useRouter();
  const [session, sessionLoading] = useSession();
  const [setting, setSetting] = useState(0);
  const [email, setEmail] = useState('');
  const [updateEmailLoading, setUpdateEmailLoading] = useState(false);
  const hiddenPassword = '******';

  useEffect(() => {
    if (session) {
      setEmail(session.user.email);
    }
  }, [session]);

  const updateEmail = async (): Promise<void> => {
    setUpdateEmailLoading(true);
    if (session?.user.email !== email) {
      try {
        const res = await fetch('/api/users/updateEmail', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ oldEmail: session?.user.email, email }),
        });
        if (res.ok) {
          console.log('successful!');
          setSetting(0);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setSetting(0);
    }

    setUpdateEmailLoading(false);
  };

  const emailButton = (): JSX.Element =>
    setting === 0 ? (
      <div className={styles.field}>
        <div>Email</div>
        <div className={styles.emailButton}>
          {email}
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
            variant="outlined"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={styles.updateEmailButton}>
            <Button
              className={styles.fieldButton}
              variant="contained"
              color="primary"
              disableElevation
              onClick={() => updateEmail()}
              disabled={updateEmailLoading}
            >
              Save
            </Button>
            {updateEmailLoading && (
              <CircularProgress
                size={24}
                className={styles.updateEmailProgress}
              />
            )}
          </div>
        </div>
      </div>
    );

  const passwordButton = (
    <div className={styles.passwordButton}>
      <div className={styles.field}>
        <div>Password</div>
        <div className={styles.fieldRight}>
          {hiddenPassword}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push('/users/change-password')}
            disableElevation
            className={styles.fieldButton}
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );

  if (!sessionLoading && !session) router.push('/');
  if (!sessionLoading && session)
    return (
      <Layout title="User Profile Settings">
        <div className={styles.content}>
          <div className={styles.box}>
            <div className={styles.top}>
              <div className={styles.title}>
                <div className={styles.caps}>{session.user.role} Profile</div>
              </div>
              {emailButton()}
              {passwordButton}

              <div className={styles.delete}>
                <Link>Delete User Account</Link>
              </div>
            </div>
            {session.user.role === 'organization' && <ProgressStepper />}
          </div>
        </div>
      </Layout>
    );
  return <LinearProgress />;
};

export default UserProfile;
