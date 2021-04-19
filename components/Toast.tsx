import {
  Button,
  Snackbar,
  SnackbarProps,
  SnackbarContent,
} from '@material-ui/core';
import { useState } from 'react';
import styles from '../styles/Toast.module.css';

type Props = {
  // custom Snackbar props
  snackbarProps?: SnackbarProps;
  // variants
  type?: 'success' | 'error';
  // disable dismiss on clickaway
  disableClickaway?: boolean;
  // display dismiss button
  showDismissButton?: boolean;
  // space out action buttons
  dualActionSpaced?: boolean;
  // custom max width (default: 600px)
  customMaxWidth?: string;
};

const Toast: React.FunctionComponent<Props> = ({
  snackbarProps,
  type = 'success',
  disableClickaway = false,
  showDismissButton = false,
  dualActionSpaced = false,
  customMaxWidth,
  children,
}) => {
  const [open, setOpen] = useState(true);
  const handleClose: SnackbarProps['onClose'] = (e, reason) => {
    if (disableClickaway && reason === 'clickaway') return;
    setOpen(false);
  };

  const dismissButton = (
    <Button
      className={type === 'error' ? styles.redButton : styles.lavendarButton}
      size="small"
      aria-label="close"
      color="inherit"
      onClick={() => setOpen(false)}
    >
      Dismiss
    </Button>
  );

  return (
    <>
      <Snackbar open={open} onClose={handleClose} {...snackbarProps}>
        <SnackbarContent
          classes={{
            root: `${styles.root} ${
              type === 'error' ? styles.error : styles.default
            }`,
            action: dualActionSpaced ? styles.action : undefined,
          }}
          style={{ maxWidth: customMaxWidth }}
          message={children}
          action={
            snackbarProps?.action ?? (showDismissButton ? dismissButton : null)
          }
        />
      </Snackbar>
    </>
  );
};

export default Toast;