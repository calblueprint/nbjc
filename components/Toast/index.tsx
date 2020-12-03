import { Button, Snackbar, SnackbarContent, Link } from '@material-ui/core';
import { useState } from 'react';
import styles from 'components/Toast/Toast.module.css';

type Props = {
  variant: // figma-specific
  | 'acceptedAlert' // alert with design of Organization Name accepted
    | 'verifyEmailAlert' // alert to check email inbox and link to resend email
    | 'userExistsError' // error that a user already exists

    // general
    | 'simpleAlert' // simple alert with Dismiss button
    | 'linkAlert' // alert with Dismiss button and link
    | 'error'; // error toast
  verticalPos?: 'top' | 'bottom';
  horizontalPos?: 'left' | 'center' | 'right';

  msg?: string; // message of the alert/error if variant is general
  // if variant='linkAlert'
  link?: string; // link if variant='linkAlert'
  linkMsg?: string; // message of link button if variant='linkAlert'
};

const Toast: React.FunctionComponent<Props> = ({
  msg,
  variant,
  verticalPos,
  horizontalPos,
  link,
  linkMsg,
}) => {
  const [open, setOpen] = useState(true);
  const handleClose = (): void => {
    setOpen(false);
  };
  let message = '';
  if (msg === null || msg === undefined) {
    message = '';
  } else {
    message = msg;
  }
  if (variant === 'acceptedAlert') {
    message = 'Organization Name has been successfully accepted.';
  } else if (variant === 'verifyEmailAlert') {
    message =
      'Please check your inbox to verify your email, so you can activate your account and begin the organization application.';
  } else if (variant === 'userExistsError') {
    message = 'This user account already exists. Try signing in instead.';
  }

  let vPos = 'top';
  let hPos = 'center';
  if (verticalPos !== null && verticalPos !== undefined) {
    vPos = verticalPos;
  }
  if (horizontalPos !== null && horizontalPos !== undefined) {
    hPos = horizontalPos;
  }

  let linkMessage = "Can't find it? Resend Verification Email";
  if (linkMsg !== null && linkMsg !== undefined) {
    linkMessage = linkMsg;
  }
  let linkButton = null;
  if (variant === 'verifyEmailAlert' || variant === 'linkAlert') {
    linkButton = (
      <Link className={styles.linkButton} color="secondary" href={link}>
        {linkMessage}
      </Link>
    );
  }

  let actionStyle;
  let type = styles.root;
  let actionButton = (
    <Button
      className={styles.lavendarButton}
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      Dismiss
    </Button>
  );
  if (variant === 'error' || variant === 'userExistsError') {
    type = styles.error;
    actionButton = (
      <Link className={styles.signIn} href={link}>
        <Button className={styles.signIn}>Sign In</Button>
      </Link>
    );
  } else if (variant === 'verifyEmailAlert' || variant === 'linkAlert') {
    actionStyle = styles.action;
    actionButton = (
      <Button
        className={styles.grayButton}
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        Dismiss
      </Button>
    );
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: vPos,
          horizontal: hPos,
        }}
        open={open}
        onClose={handleClose}
      >
        <SnackbarContent
          classes={{
            root: type,
            action: actionStyle,
          }}
          message={message}
          action={
            <>
              {linkButton}
              {actionButton}
            </>
          }
        />
      </Snackbar>
    </div>
  );
};

export default Toast;
