import { Button, TextField } from '@material-ui/core';
import Layout from 'components/Layout';
import { useState } from 'react';
import styles from '../../../styles/users/PasswordChange.module.css';
import { NewPasswordDTO } from 'pages/api/auth/reset-password';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/client';
import Toast from 'components/Toast';

const ResetPasswordPage : React.FC = () => {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submissionError, setSubmissionError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function onClick(): Promise<void> {
      try {
        setSubmissionError(false);
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
          setSubmissionError(true);
          const respJson = await response.json();
          setErrorMessage(String(respJson.error.message));
          return;
        } else {
          const userInfo = await response.json();
          signIn('credentials', {
            email: userInfo.email,
            password: password,
            callbackUrl: 'http://localhost:3000/?resetSuccess=true',
          });
        }
      } catch (err) {
        setSubmissionError(true);
        setErrorMessage(err.error.message);
      }
    };

    const renderErrorToast = () => {
      return(
          <Toast
          snackbarProps={{
              anchorOrigin: { vertical: 'top', horizontal: 'center' },
          }}
          type="error"
          showDismissButton
          disableClickaway
          > 
          {errorMessage}
          </Toast>
      );
    }

    return(
    <Layout>
      { submissionError ? renderErrorToast() : null}
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
              Confirm Password
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
          <div className={styles.confirm}>
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

export default ResetPasswordPage;