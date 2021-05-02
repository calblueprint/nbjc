import { Button, CircularProgress } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';
import { MouseEventHandler } from 'react';
import styles from './AdminButton.module.css';

type Props = {
  variant:
    | 'decline'
    | 'delete'
    | 'suspend'
    | 'accept'
    | 'view'
    | 'edit'
    | 'reset';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
};

const AdminButton: React.FC<Props> = ({ variant, onClick, loading }) => {
  let ret;

  switch (variant) {
    case 'decline':
      ret = (
        <Button
          variant="outlined"
          size="small"
          onClick={onClick}
          disabled={loading}
        >
          Decline
        </Button>
      );
      break;
    case 'delete':
      ret = (
        <Button
          variant="outlined"
          size="small"
          onClick={onClick}
          disabled={loading}
        >
          Delete
        </Button>
      );
      break;
    case 'suspend':
      ret = (
        <Button
          variant="outlined"
          size="small"
          onClick={onClick}
          disabled={loading}
        >
          Suspend
        </Button>
      );
      break;
    case 'accept':
      ret = (
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<CheckCircleIcon />}
          disableElevation
          onClick={onClick}
          disabled={loading}
        >
          Accept
        </Button>
      );
      break;
    case 'view':
      ret = (
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<InfoIcon />}
          disableElevation
          onClick={onClick}
          disabled={loading}
        >
          View
        </Button>
      );
      break;
    case 'edit':
      ret = (
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<InfoIcon />}
          disableElevation
          onClick={onClick}
          disabled={loading}
        >
          Edit
        </Button>
      );
      break;
    case 'reset':
      ret = (
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<InfoIcon />}
          disableElevation
          onClick={onClick}
          disabled={loading}
        >
          Reset Password
        </Button>
      );
      break;
    default:
      ret = null;
  }

  return (
    <div className={styles.buttonPosition}>
      {ret}
      {loading && (
        <CircularProgress size={20} className={styles.buttonProgress} />
      )}
    </div>
  );
};

export default AdminButton;
