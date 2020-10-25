import { Tab, Tabs, Button, IconButton } from '@material-ui/core';
import AdminDash from 'components/AdminDash';
// eslint-disable-next-line import/no-extraneous-dependencies
import KeyboardArrowLeftSharpIcon from '@material-ui/icons/KeyboardArrowLeftSharp';
import styles from '../../styles/AppReview.module.css';

const AdminDashboardAppReview: React.FunctionComponent = () => (
  <AdminDash>
    <div className={styles.content}>
      <div className={styles.selectBar}>
        <Tabs
          value={undefined}
          indicatorColor="primary"
          textColor="primary"
          onChange={undefined}
          aria-label="disabled tabs example"
        >
          <Tab label="Apps" />
          <Tab label="Events" />
        </Tabs>
        <IconButton>
          <KeyboardArrowLeftSharpIcon />
        </IconButton>
      </div>
      <div className={styles.columns}>
        <div className={styles.leftCol}>Insert cards here</div>
        <div className={styles.rightCol}>
          <div className={styles.rightContent}>Content here</div>
          <div className={styles.approve}>
            <Button variant="contained">Decline</Button>
            <Button variant="contained" color="primary">
              Approve
            </Button>
          </div>
        </div>
      </div>
    </div>
  </AdminDash>
);

export default AdminDashboardAppReview;
