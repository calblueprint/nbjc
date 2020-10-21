import { Button } from '@material-ui/core';
import AdminIndex from 'components/AdminIndex';
// eslint-disable-next-line import/no-extraneous-dependencies
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import AdminTable from 'components/AdminTable';
import styles from '../styles/AdminIndex.module.css';

const appButton = (
  <div className={styles.buttonFlex}>
    <Button href="/adminDash_appIndex" startIcon={<FiberManualRecordIcon />}>
      Applications
    </Button>
  </div>
);

const orgButton = (
  <Button
    variant="contained"
    color="primary"
    href="/adminDash_orgIndex"
    startIcon={<FiberManualRecordIcon />}
  >
    Organizations
  </Button>
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
    <Button href="/adminDash_usersIndex" startIcon={<FiberManualRecordIcon />}>
      Users
    </Button>
  </div>
);

const AdminDashboardOrgIndex: React.FunctionComponent = () => (
  <AdminIndex
    head="Organization"
    buttonApp={appButton}
    buttonOrg={orgButton}
    buttonQue={queButton}
    buttonUse={useButton}
    search="Look for an Organization"
  >
    <AdminTable pageType="Organization" />
  </AdminIndex>
);

export default AdminDashboardOrgIndex;
