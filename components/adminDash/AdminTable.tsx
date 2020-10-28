/* eslint-disable import/no-extraneous-dependencies */
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';
import { Organization, User } from 'interfaces';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  button: {
    display: 'flex',
    marginRight: 10,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
  },
});

const declineButton = (
  <Button variant="outlined" size="small" startIcon={<HighlightOffIcon />}>
    Decline
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
type Props = {
  appData?: Array<Organization>;
  useData?: Array<User>;
};

const AdminTable: React.FunctionComponent<Props> = ({ appData, useData }) => {
  const classes = useStyles();

  if (appData === undefined) {
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {useData.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">
                  <div className={classes.actions}>
                    <div className={classes.button}>{declineButton}</div>
                    <div className={classes.button}>{viewButton}</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Logo</TableCell>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Description</TableCell>
            <TableCell align="left">Question</TableCell>
            <TableCell align="left">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appData.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="left">{row.name}</TableCell>
              <TableCell align="left">{row.logo}</TableCell>
              <TableCell align="left">{row.date}</TableCell>
              <TableCell align="left">{row.description}</TableCell>
              <TableCell align="left">{row.question}</TableCell>
              <TableCell align="right">
                <div className={classes.actions}>
                  <div className={classes.button}>{declineButton}</div>
                  <div className={classes.button}>{acceptButton}</div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminTable;
