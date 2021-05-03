import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import computeDate from 'utils/computeDate';
import {
  TableApplicationQuestion,
  TableOrganization,
  TableOrgApplication,
  TableUser,
} from 'interfaces/admin';
import AdminButton from 'components/admin/AdminButton';
import styles from './AdminTable.module.css';

type Props = {
  data: Array<
    | TableOrgApplication
    | TableOrganization
    | TableUser
    | TableApplicationQuestion
  >;
  pageType: string;
  primaryAction?: (id: number) => void;
  secondaryAction?: (id: number) => void;
  actionLoadingIndex?: number;
};

const AdminTable: React.FunctionComponent<Props> = ({
  data,
  pageType,
  primaryAction,
  secondaryAction,
  actionLoadingIndex,
}) => {
  const headList = Object.keys(data[0] ?? {});
  const actionButtons = (index: number): React.ReactElement | null => {
    if (pageType === 'applications') {
      return (
        <>
          <AdminButton
            variant="accept"
            onClick={() => (primaryAction ? primaryAction(index) : null)}
            loading={index === actionLoadingIndex}
          />
          <AdminButton
            variant="decline"
            onClick={() => (secondaryAction ? secondaryAction(index) : null)}
            loading={index === actionLoadingIndex}
          />
        </>
      );
    }
    if (pageType === 'organizations') {
      return (
        <>
          <AdminButton
            variant="view"
            onClick={() => (primaryAction ? primaryAction(index) : null)}
            loading={index === actionLoadingIndex}
          />
          <AdminButton
            variant="delete"
            onClick={() => (secondaryAction ? secondaryAction(index) : null)}
            loading={index === actionLoadingIndex}
          />
        </>
      );
    }
    if (pageType === 'users') {
      return (
        <>
          <AdminButton
            variant="reset"
            onClick={() => (primaryAction ? primaryAction(index) : null)}
            loading={index === actionLoadingIndex}
          />
          <AdminButton
            variant="suspend"
            onClick={() => (secondaryAction ? secondaryAction(index) : null)}
            loading={index === actionLoadingIndex}
          />
        </>
      );
    }
    if (pageType === 'questions') {
      return (
        <>
          <AdminButton
            variant="edit"
            onClick={() => (primaryAction ? primaryAction(index) : null)}
            loading={index === actionLoadingIndex}
          />
          <AdminButton
            variant="delete"
            onClick={() => (secondaryAction ? secondaryAction(index) : null)}
            loading={index === actionLoadingIndex}
          />
        </>
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
          {data.map((row, orgIndex) => (
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
              <TableCell align="right" className={styles.actions}>
                {actionButtons(orgIndex)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminTable;
