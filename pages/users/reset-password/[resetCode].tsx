import { Button, TextField } from '@material-ui/core';
import Layout from 'components/Layout';
import React, { useState } from 'react';
import styles from '../../../styles/users/PasswordChange.module.css';
import { NewPasswordDTO } from 'pages/api/auth/reset-password';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/client';

const resetPasswordPage : React.FC = () => {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function onClick(): Promise<void> {
      try {
        // Compare inputed passwords
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match!");
        }

        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({
            resetCode:   router.query['resetCode'],
            newPassword: password,
          } as NewPasswordDTO),
        });

        if (!response.ok) {
          // TO-DO fix as toast notification and message along the lines of
          // link used to reset has expired
          return;
        } else {
          // TO-DO Link back to main page logged in as user
          const userInfo = await response.json();
          console.log(userInfo);
          signIn('credentials', {
            email: userInfo['email'],
            password: password,
            callbackUrl: '/',
          });
        }
      } catch (err) {
        // Error handling, notify user as well (Toast notification)
      }
    };

    return(
    <Layout>
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.title}>Reset Password</div>
          <div className={styles.passwords}>
            <div className={styles.field}>
              New Password
              <TextField
                size="small"
                id="new-password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className={styles.field}>
              Confirm New Password
              <TextField
                size="small"
                id="confirm-password"
                type="password"
                variant="outlined"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
          </div>
          <div className={styles.saveSingle}>
            <Button
              color="primary"
              variant="contained"
              onClick={onClick}
              disableElevation
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    )
}

export default resetPasswordPage;