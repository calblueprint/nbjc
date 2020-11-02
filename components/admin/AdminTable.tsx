import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, ButtonGroup } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';
import styles from 'styles/admin/AdminTable.module.css';

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
  data: Array<unknown>;
  pageType: string;
};

const AdminTable: React.FunctionComponent<Props> = ({ data, pageType }) => {
  const headList = Object.keys(data[0]);
  const button1 =
    // eslint-disable-next-line no-nested-ternary
    pageType === 'applications'
      ? declineButton
      : pageType === 'organizations'
      ? deleteButton
      : suspendButton;
  const button2 =
    // eslint-disable-next-line no-nested-ternary
    pageType === 'applications'
      ? acceptButton
      : pageType === 'organizations'
      ? viewButton
      : resetButton;
  const actionButtons = (
    <ButtonGroup>
      {button1}
      {button2}
    </ButtonGroup>
  );

  const table = (
    <TableContainer component={Paper}>
      <Table className={styles.table} aria-label="simple table">
        <caption>No {pageType} in database</caption>
        <TableHead>
          <TableRow>
            {headList.map((key) => (
              <TableCell align="left">{key}</TableCell>
            ))}
            <TableCell align="left">actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {Object.values(row).map((value) => (
                <TableCell align="left">{value}</TableCell>
              ))}
              <TableCell align="left">{actionButtons}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return table;
};

export default AdminTable;
