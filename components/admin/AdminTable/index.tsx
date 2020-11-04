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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function giveButton1(pT: string) {
  if (pT === 'applications') {
    return declineButton;
  }
  if (pT === 'organizations') {
    return deleteButton;
  }
  return suspendButton;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function giveButton2(pT: string) {
  if (pT === 'applications') {
    return acceptButton;
  }
  if (pT === 'organizations') {
    return viewButton;
  }
  return resetButton;
}

const AdminTable: React.FunctionComponent<Props> = ({ data, pageType }) => {
  const headList = Object.keys(data[0]);
  const button1 = giveButton1(pageType);
  const button2 = giveButton2(pageType);
  const actionButtons = (
    <ButtonGroup>
      {button1}
      {button2}
    </ButtonGroup>
  );

  const table = (
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
              <TableCell align="right">{actionButtons}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return table;
};

export default AdminTable;
