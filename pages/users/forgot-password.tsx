import { Button, TextField } from '@material-ui/core';
import Layout from 'components/Layout';
import { useState } from 'react';
import { ForgotPasswordDTO } from 'pages/api/auth/forgot-password';
import styles from '../../styles/users/PasswordChange.module.css';

const ForgotPassword : React.FC = () => {
    const [userEmail, setEmail] = useState('');

    async function onClick() : Promise<void> {
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({
                    email: userEmail,
                } as ForgotPasswordDTO),
            });

            if (!response.ok) {
                throw await response.json();
            } else {
                // TO-DO Notify of password reset (toast)
                setEmail("");
            }
        } catch (err) {
            // TO-DO Error handling Notify user as well (toast)
        }
    }

    return(
    <Layout>
        <div className={styles.page}>
            <div className={styles.content}>
                <div className={styles.title}>Forgot Password?</div>
                <div className={styles.textRegular}>Please enter your email below:</div>
                <div className={styles.textSmall}>A link will be sent to your email</div>
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
                <div className={styles.confirmEmail}>
                    <Button 
                        color="primary"
                        variant="contained"
                        disableElevation
                        onClick={onClick}
                        disableRipple>
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    </Layout>    
    )
}

export default ForgotPassword;