import { Link, Snackbar, Button } from '@material-ui/core';
import styles from './EmailVerify.module.css';
import { useState } from 'react'

const EmailVerify: React.FC = () => {
  const [open, setOpen] = useState(true);
  const msg = "Can't find it? Resend Verification Email";

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ): undefined => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        color="primary"
        onClose={handleClose}
        message={
          'Please check your inbox to verify your email, so you can activate \
          your account and begin the organization application!'
        }
        action={
          <>
            <div>
              <Link color="primary" className={styles.button}>
                {msg}
              </Link>
            </div>
            <Button color="inherit" onClick={handleClose}>
              Dismiss
            </Button>
          </>
        }
      />
    </div>
  );
};

export default EmailVerify;
