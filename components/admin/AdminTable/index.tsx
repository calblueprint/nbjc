import {
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';
import { OrgApp, Organization, User } from 'interfaces/index';
import styles from './AdminTable.module.css';

const declineButton = (
  <Button variant="outlined" size="small">
    Decline
  </Button>
);

const deleteButton = (
  <Button variant="outlined" size="small">
    Delete
  </Button>
);

const suspendButton = (
  <Button variant="outlined" size="small">
    Suspend
  </Button>
);

const acceptButton = (
  <Button
    variant="contained"
    color="primary"
    size="small"
    startIcon={<CheckCircleIcon />}
    disableElevation
  >
    Accept
  </Button>
);

const viewButton = (
  <Button
    variant="contained"
    color="primary"
    size="small"
    startIcon={<InfoIcon />}
    disableElevation
  >
    View
  </Button>
);

const resetButton = (
  <Button
    variant="contained"
    color="primary"
    size="small"
    startIcon={<InfoIcon />}
    disableElevation
  >
    Reset Password
  </Button>
);

type Props = {
  data: Array<OrgApp | Organization | User>;
  pageType: string;
};

const AdminTable: React.FunctionComponent<Props> = ({ data, pageType }) => {
  const headList = Object.keys(data[0]);
  const actionButtons = (): React.ReactElement | null => {
    if (pageType === 'applications') {
      return (
        <ButtonGroup>
          {declineButton}
          {acceptButton}
        </ButtonGroup>
      );
    }
    if (pageType === 'organizations') {
      return (
        <ButtonGroup>
          {deleteButton}
          {viewButton}
        </ButtonGroup>
      );
    }
    if (pageType === 'users') {
      return (
        <ButtonGroup>
          {suspendButton}
          {resetButton}
        </ButtonGroup>
      );
    }
    return null;
  };

  return (
    <TableContainer component={Paper}>
      <Table className={styles.table} aria-label="simple table">
        {data.length === 0 ? (
          <caption>No {pageType} in database</caption>
        ) : null}
        <TableHead>
          <TableRow>
            {headList.map((key) => (
              <TableCell align="left">{key}</TableCell>
            ))}
            <TableCell align="right">actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {Object.values(row).map((value) => (
                <TableCell align="left">{value}</TableCell>
              ))}
              <TableCell align="right">{actionButtons()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminTable;
