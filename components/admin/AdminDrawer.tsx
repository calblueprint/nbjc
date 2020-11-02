import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { Button, Link } from '@material-ui/core';
import styles from '../../styles/admin/AdminDrawer.module.css';

type Props = {
  page: string;
};

const AdminDrawer: React.FunctionComponent<Props> = ({ page }) => (
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
                  <Link color="inherit" href="/admin/organizations">
                    <Button
                      startIcon={<FiberManualRecordIcon />}
                      variant={
                        page === 'Organization' ? 'contained' : undefined
                      }
                      color={page === 'Organization' ? 'primary' : undefined}
                      disableElevation
                    >
                      Organizations
                    </Button>
                  </Link>
                </div>
                <div className={styles.selected}>
                  <Link color="inherit" href={undefined}>
                    <Button
                      href="undefined"
                      startIcon={<FiberManualRecordIcon />}
                      variant={page === 'Question' ? 'contained' : undefined}
                      color={page === 'Question' ? 'primary' : undefined}
                      disableElevation
                    >
                      Questions
                    </Button>
                  </Link>
                </div>
                <div className={styles.selected}>
                  <Link color="inherit" href="/admin/users">
                    <Button
                      startIcon={<FiberManualRecordIcon />}
                      variant={page === 'User' ? 'contained' : undefined}
                      color={page === 'User' ? 'primary' : undefined}
                      disableElevation
                    >
                      Users
                    </Button>
                  </Link>
                </div>
              </List>
            </div>
          </div>
        </Drawer>
      </Hidden>
    </nav>
  </div>
);

export default AdminDrawer;
