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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createData(
  Name: string,
  Work: string,
  Type: string,
  Date: string,
  Decline: typeof Button,
  Accept: typeof Button
) {
  return { Name, Work, Type, Date, Decline, Accept };
}

type Props = {
  pageType: string;
};

const AdminTable: React.FunctionComponent<Props> = ({ pageType }) => {
  const classes = useStyles();

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
    >
      View
    </Button>
  );

  // sample data:
  const rows = [
    createData(
      'NBJC team is the coolest',
      'being cool',
      'hella cool',
      '04/20/2020',
      declineButton,
      pageType === 'Application' ? acceptButton : viewButton
    ),
    createData(
      'OGSC team is p cool',
      'being cool #2',
      'swag',
      '10/31/1834',
      declineButton,
      pageType === 'Application' ? acceptButton : viewButton
    ),
    createData(
      'Ace',
      'honorary NBJC member',
      'Tetris King',
      'immortal',
      declineButton,
      pageType === 'Application' ? acceptButton : viewButton
    ),
    createData(
      'Oski the Bear',
      'arf arf',
      'T@#$%@^!!!!!',
      '24/00/30781',
      declineButton,
      pageType === 'Application' ? acceptButton : viewButton
    ),
  ];
  // end of sample data

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="left">Work</TableCell>
            <TableCell align="left">Type</TableCell>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Actions</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.Name}>
              <TableCell component="th" scope="row">
                {row.Name}
              </TableCell>
              <TableCell align="left">{row.Work}</TableCell>
              <TableCell align="left">{row.Type}</TableCell>
              <TableCell align="left">{row.Date}</TableCell>
              <TableCell align="right">{row.Decline}</TableCell>
              <TableCell align="left">{row.Accept}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminTable;
