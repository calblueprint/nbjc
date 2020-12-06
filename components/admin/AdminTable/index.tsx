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
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import computeDate from 'utils/computeDate';
import {
  TableApplicationQuestion,
  TableOrganization,
  TableOrgApplication,
  TableUser,
} from 'interfaces/admin';
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

const editButton = (
  <Button
    variant="contained"
    color="primary"
    size="small"
    startIcon={<InfoIcon />}
    disableElevation
  >
    Edit
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
  data: Array<
    | TableOrgApplication
    | TableOrganization
    | TableUser
    | TableApplicationQuestion
  >;
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
    if (pageType === 'questions') {
      return (
        <ButtonGroup>
          {deleteButton}
          {editButton}
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
          <TableRow className={styles.headerText}>
            {headList.map((key) => (
              <TableCell align="left" key={key}>
                {key}
              </TableCell>
            ))}
            <TableCell align="right">actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {Object.values(row).map((value, index) => {
                if (value instanceof Date) {
                  return (
                    <TableCell align="left" key={headList[index]}>
                      {computeDate(value, 1)}
                    </TableCell>
                  );
                }
                if (typeof value === 'boolean') {
                  return (
                    <TableCell align="left" key={headList[index]}>
                      {value ? <CheckIcon /> : <CloseIcon />}
                    </TableCell>
                  );
                }
                return (
                  <TableCell align="left" key={headList[index]}>
                    {value ?? <CloseIcon />}
                  </TableCell>
                );
              })}
              <TableCell align="right">{actionButtons()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminTable;
