import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from 'components/Layout';
import { Button, TextField, Link, LinearProgress } from '@material-ui/core';
import useSession from 'utils/useSession';
import ProgressStepper from 'components/user/ProgressStepper/index';
import styles from '../../styles/users/Settings.module.css';

const UserProfSettings: React.FC = () => {
  const router = useRouter();
  const [session, sessionLoading] = useSession();
  const [setting, setSetting] = useState(0);
  const hiddenPassword = '******';

  const handleSubmit = async (values: string): Promise<void> => {
    const res = await fetch('/api/users/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: values }),
    });
  };
  // necessary?
  interface user {
    email: string;
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    image: string;
    emailVerified: string;
    hashedPassword: string;
    createdAt: string;
    updatedAt: string;
  }

  function onClickSave(values: string): void {
    setSetting(0);
    handleSubmit(values);
  }

  const emailButton =
    setting === 0 ? (
      <div className={styles.field}>
        <div>Email</div>
        <div className={styles.emailButton}>
          {session?.user.email}
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
            defaultValue={session?.user.email}
            variant="outlined"
            size="small"
          />
          <Button
            className={styles.fieldButton}
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => onClickSave('')}
          >
            Save
          </Button>
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
              {emailButton}
              {passwordButton}

              <div className={styles.delete}>
                <Link>Delete User Account</Link>
              </div>
            </div>
            <ProgressStepper />
          </div>
        </div>
      </Layout>
    );
  return <LinearProgress />;
};

export default UserProfSettings;
