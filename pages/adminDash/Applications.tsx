import { Button } from '@material-ui/core';
import AdminIndex from 'components/AdminIndex';
// eslint-disable-next-line import/no-extraneous-dependencies
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import AdminTable from 'components/AdminTable';
import styles from '../../styles/AppIndex.module.css';

const appButton = (
  <Button
    variant="contained"
    color="primary"
    href="../adminDash/Applications"
    startIcon={<FiberManualRecordIcon />}
  >
    Applications
  </Button>
);

const orgButton = (
  <div className={styles.buttonFlex}>
    <Button
      href="../adminDash/Organizations"
      startIcon={<FiberManualRecordIcon />}
    >
      Organizations
    </Button>
  </div>
);

const queButton = (
  <div className={styles.buttonFlex}>
    <Button href={undefined} startIcon={<FiberManualRecordIcon />}>
      Questions
    </Button>
  </div>
);

const useButton = (
  <div className={styles.buttonFlex}>
    <Button href="../adminDash/Users" startIcon={<FiberManualRecordIcon />}>
      Users
    </Button>
  </div>
);

const AdminDashboardAppIndex: React.FunctionComponent = () => (
  <AdminIndex
    head="Application"
    buttonApp={appButton}
    buttonOrg={orgButton}
    buttonQue={queButton}
    buttonUse={useButton}
    search="Look for an Application"
  >
    <AdminTable pageType="Application" />
  </AdminIndex>
);

export default AdminDashboardAppIndex;
