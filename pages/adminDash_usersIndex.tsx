import { Button } from '@material-ui/core';
import AdminIndex from 'components/AdminIndex';
// eslint-disable-next-line import/no-extraneous-dependencies
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import styles from '../styles/AppIndex.module.css';

const appButton = (
  <div className={styles.buttonFlex}>
    <Button href="/adminDash_appIndex" startIcon={<FiberManualRecordIcon />}>
      Applications
    </Button>
  </div>
);

const orgButton = (
  <div className={styles.buttonFlex}>
    <Button href="/adminDash_orgIndex" startIcon={<FiberManualRecordIcon />}>
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
  <Button
    variant="contained"
    color="primary"
    href="/adminDash_usersIndex"
    startIcon={<FiberManualRecordIcon />}
  >
    Users
  </Button>
);

const AdminDashboardAppIndex: React.FunctionComponent = () => (
  <AdminIndex
    head="User"
    buttonApp={appButton}
    buttonOrg={orgButton}
    buttonQue={queButton}
    buttonUse={useButton}
    search="Look for a User"
  />
);

export default AdminDashboardAppIndex;
