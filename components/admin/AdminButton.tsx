import { Button } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';
import { MouseEventHandler } from 'react';

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
};

const AdminButton: React.FC<Props> = ({ variant, onClick }) => {
  switch (variant) {
    case 'decline':
      return (
        <Button variant="outlined" size="small" onClick={onClick}>
          Decline
        </Button>
      );
    case 'delete':
      return (
        <Button variant="outlined" size="small" onClick={onClick}>
          Delete
        </Button>
      );
    case 'suspend':
      return (
        <Button variant="outlined" size="small" onClick={onClick}>
          Suspend
        </Button>
      );
    case 'accept':
      return (
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<CheckCircleIcon />}
          disableElevation
          onClick={onClick}
        >
          Accept
        </Button>
      );
    case 'view':
      return (
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<InfoIcon />}
          disableElevation
          onClick={onClick}
        >
          View
        </Button>
      );
    case 'edit':
      return (
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<InfoIcon />}
          disableElevation
          onClick={onClick}
        >
          Edit
        </Button>
      );
    case 'reset':
      return (
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<InfoIcon />}
          disableElevation
          onClick={onClick}
        >
          Reset Password
        </Button>
      );
    default:
      return null;
  }
};

export default AdminButton;
