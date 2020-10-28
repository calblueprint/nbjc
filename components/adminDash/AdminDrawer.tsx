import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
// eslint-disable-next-line import/no-extraneous-dependencies
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { Button, Link } from '@material-ui/core';
import AdminTable from './AdminTable';
import styles from '../../styles/admin/AdminDrawer.module.css';

// try looking at Next.js documents to see if color can change depend on URL color

type Props = {
  table: typeof AdminTable;
  page: string;
};

const AdminDrawer: React.FunctionComponent<Props> = ({ table, page }) => (
  <div className={styles.root}>
    <CssBaseline />
    <AppBar position="fixed" className={styles.appBar} />
    <nav className={styles.drawer} aria-label="mailbox folders">
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: styles.drawerPaper,
          }}
          variant="permanent"
          open
        >
          <div>
            <div className={styles.title}>
              <Link href="/" color="inherit">
                NBJC
              </Link>
            </div>
            <div className={styles.appBar}>
              <List>
                <div className={styles.selected}>
                  <Button
                    href="../adminDash/Applications"
                    startIcon={<FiberManualRecordIcon />}
                    variant={page === 'Application' ? 'contained' : ''}
                    color={page === 'Application' ? 'primary' : ''}
                    disableElevation
                  >
                    Applications
                  </Button>
                </div>
                <div className={styles.selected}>
                  <Button
                    href="../adminDash/Organizations"
                    startIcon={<FiberManualRecordIcon />}
                    variant={page === 'Organization' ? 'contained' : ''}
                    color={page === 'Organization' ? 'primary' : ''}
                    disableElevation
                  >
                    Organizations
                  </Button>
                </div>
                <div className={styles.selected}>
                  <Button
                    href="undefined"
                    startIcon={<FiberManualRecordIcon />}
                    variant={page === 'Question' ? 'contained' : ''}
                    color={page === 'Question' ? 'primary' : ''}
                    disableElevation
                  >
                    Questions
                  </Button>
                </div>
                <div className={styles.selected}>
                  <Button
                    href="../adminDash/Users"
                    startIcon={<FiberManualRecordIcon />}
                    variant={page === 'User' ? 'contained' : ''}
                    color={page === 'User' ? 'primary' : ''}
                    disableElevation
                  >
                    Users
                  </Button>
                </div>
              </List>
            </div>
          </div>
        </Drawer>
      </Hidden>
    </nav>
    <main className={styles.content}>
      <div className={styles.toolbar} />
      {table}
    </main>
  </div>
);

export default AdminDrawer;
