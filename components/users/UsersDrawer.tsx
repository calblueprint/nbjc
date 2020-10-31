import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
// eslint-disable-next-line import/no-extraneous-dependencies
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { Button, Link } from '@material-ui/core';
import styles from '../../styles/users/UsersDrawer.module.css';

// try looking at Next.js documents to see if color can change depend on URL color

type Props = {
  page: string;
};

const UsersDrawer: React.FunctionComponent<Props> = ({ page }) => (
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
          <div className={styles.expand}>
            <div className={styles.title}>
              <Link href="/" color="inherit">
                NBJC
              </Link>
            </div>
            <div className={styles.appBar}>
              <List>
                <div className={styles.selected}>
                  <Button
                    href="../users/profile_settings"
                    startIcon={<FiberManualRecordIcon />}
                    variant={page === 'User' ? 'contained' : undefined}
                    color={page === 'User' ? 'primary' : undefined}
                    disableElevation
                  >
                    Users
                  </Button>
                </div>
                <div className={styles.selected}>
                  <Button
                    href="../adminDash/Organizations"
                    startIcon={<FiberManualRecordIcon />}
                    variant={page === 'Organization' ? 'contained' : undefined}
                    color={page === 'Organization' ? 'primary' : undefined}
                    disableElevation
                  >
                    Applications
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
    </main>
  </div>
);

export default UsersDrawer;
