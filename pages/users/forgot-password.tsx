import { Button, TextField } from '@material-ui/core';
import Layout from 'components/Layout';
import { useState } from 'react';
import { ForgotPasswordDTO } from 'pages/api/auth/forgot-password';
import Toast from 'components/Toast';
import styles from '../../styles/users/PasswordChange.module.css';

const ForgotPassword: React.FC = () => {
  const [userEmail, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function onClick(): Promise<void> {
    setSubmitted(false);
    setSubmissionError(false);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: userEmail,
        } as ForgotPasswordDTO),
      });

      if (!response.ok) {
        throw await response.json();
      } else {
        setSubmitted(true);
        setEmail('');
      }
    } catch (err) {
      setSubmissionError(true);
      setEmail('');
      setErrorMessage(err.error.message);
    }
  }

  const renderToast = () => {
    return (
      <Toast
        snackbarProps={{
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        }}
        type="success"
        showDismissButton
      >
        <div>
          Please check your inbox for an email with password reset instructions.
        </div>
      </Toast>
    );
  };

  const renderErrorToast = () => {
    return (
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
  };

  return (
    <Layout>
      {submitted && !submissionError ? renderToast() : null}
      {submissionError ? renderErrorToast() : null}
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.title}>Forgot Password?</div>
          <div className={styles.textRegular}>
            Please enter your email below:
          </div>
          <div className={styles.textSmall}>
            A link will be sent to your email
          </div>
          <div className={styles.passwords}>
            <div className={styles.field}>
              Email
              <TextField
                size="small"
                id="email"
                label="email"
                variant="outlined"
                value={userEmail}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>
          <div className={styles.confirm}>
            <Button
              color="primary"
              variant="contained"
              disableElevation
              onClick={onClick}
              disableRipple
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
