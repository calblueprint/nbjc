import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { Link, Button, IconButton, Snackbar } from '@material-ui/core';
import styles from './EmailVerify.module.css';

export default function EmailVerify() {
  const [open, setOpen] = React.useState(true);

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
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
          <React.Fragment>
            <div className={styles.buttons}>
              <div>
            <Link color="primary" className={styles.button}>
              Can't find it? Resend Verification Email
            </Link>
            </div>
            <div>
            <Link color="inherit" onClick={handleClose}>
              Dismiss
            </Link>
            </div>
            </div>
          </React.Fragment>
        }
      />
    </div>
  );
}
