import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
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
                    startIcon={<FiberManualRecordIcon />}
                    variant={page === 'Application' ? 'contained' : undefined}
                    color={page === 'Application' ? 'primary' : undefined}
                    disableElevation
                  >
                    <Link color="inherit" href="/admin/applications">
                      Applications
                    </Link>
                  </Button>
                </div>
                <div className={styles.selected}>
                  <Button
                    startIcon={<FiberManualRecordIcon />}
                    variant={page === 'Organization' ? 'contained' : undefined}
                    color={page === 'Organization' ? 'primary' : undefined}
                    disableElevation
                  >
                    <Link color="inherit" href="/admin/organizations">
                      Organizations
                    </Link>
                  </Button>
                </div>
                <div className={styles.selected}>
                  <Button
                    href="undefined"
                    startIcon={<FiberManualRecordIcon />}
                    variant={page === 'Question' ? 'contained' : undefined}
                    color={page === 'Question' ? 'primary' : undefined}
                    disableElevation
                  >
                    <Link color="inherit" href={undefined}>
                      Questions
                    </Link>
                  </Button>
                </div>
                <div className={styles.selected}>
                  <Button
                    startIcon={<FiberManualRecordIcon />}
                    variant={page === 'User' ? 'contained' : undefined}
                    color={page === 'User' ? 'primary' : undefined}
                    disableElevation
                  >
                    <Link color="inherit" href="/admin/users">
                      Users
                    </Link>
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
