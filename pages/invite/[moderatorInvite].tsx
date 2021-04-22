import Layout from 'components/Layout';
import { TextField, Button } from '@material-ui/core';
import styles from 'styles/users/PasswordChange.module.css';
import Toast from 'components/Toast';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ModeratorInviteInfo } from 'pages/api/invites/moderator/validate';
import { signIn } from 'next-auth/client';

const ModeratorSignupPage : React.FC = () => {
    const [userEmail, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submissionError, setSubmissionError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();

    async function onClick() : Promise<void> {
        setSubmissionError(false);
        try {
            // validate info
            const validationRes = await fetch('/api/invites/moderator/validate', {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({
                    modInvite: router.query['moderatorInvite'],
                    email:     userEmail,
                } as ModeratorInviteInfo),
            });

            if (!validationRes) {
                throw new Error('Failed to validate invite link');
            }

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match!');
            }

            // POST request
            const res = await fetch('/api/users/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: userEmail,
                  password: password,
                  role: 'moderator',
                  emailVerified: Date.now(),
                }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw error;
            }

            // Sign in user
            signIn('credentials', {
                email: userEmail,
                password: password,
                callbackUrl: '/',
            });
        } catch (err) {
            console.log(err)
            setSubmissionError(true);
            setErrorMessage(err.error.message);
        }
    }

    const renderErrorToast = () : JSX.Element => {
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
        {submissionError ? renderErrorToast() : null}
        <div className={styles.page}>
            <div className={styles.content}>
                <div className={styles.title}>Complete Set-up</div>
                <div className={styles.textRegular}>Finish setting up your moderator account by setting a
                password. </div>
                <div className={styles.passwords}>
                    <div className={styles.field}>
                        Email
                        <TextField
                            size="small"
                            id="email"
                            placeholder="email@example.org"
                            variant="outlined"
                            value={userEmail}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        New Password
                        <TextField
                            size="small"
                            id="new-password"
                            type="password"
                            variant="outlined"
                            placeholder="******"
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
                            placeholder="******"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                        </div>
                </div>
                <div className={styles.confirm}>
                    <Button 
                        color="primary"
                        variant="contained"
                        disableElevation
                        onClick={onClick}
                        disableRipple>
                        Sign Up
                    </Button>
                </div>
            </div>
        </div>
    </Layout>    
    )
}

export default ModeratorSignupPage;