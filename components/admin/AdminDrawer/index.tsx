import { Button, Hidden, List } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { useRouter } from 'next/router';
import styles from './AdminDrawer.module.css';

type Props = {
  page: string;
};

const AdminDrawer: React.FunctionComponent<Props> = ({ page }) => {
  const router = useRouter();
  return (
    <div className={styles.root}>
      <div className={styles.drawer}>
        <Hidden xsDown implementation="css">
          <div>
            <div>
              <List>
                <div className={styles.drawerItem}>
                  <Button
                    startIcon={<FiberManualRecordIcon />}
                    variant={page === 'Application' ? 'contained' : undefined}
                    color={page === 'Application' ? 'primary' : undefined}
                    disableElevation
                    onClick={() => router.push('/admin/applications')}
                  >
                    Applications
                  </Button>
                </div>
                <div className={styles.drawerItem}>
                  <Button
                    startIcon={<FiberManualRecordIcon />}
                    variant={page === 'Organization' ? 'contained' : undefined}
                    color={page === 'Organization' ? 'primary' : undefined}
                    disableElevation
                    onClick={() => router.push('/admin/organizations')}
                  >
                    Organizations
                  </Button>
                </div>
                <div className={styles.drawerItem}>
                  <Button
                    href="undefined"
                    startIcon={<FiberManualRecordIcon />}
                    variant={page === 'Question' ? 'contained' : undefined}
                    color={page === 'Question' ? 'primary' : undefined}
                    disableElevation
                    onClick={() => router.push('/admin/questions')}
                  >
                    Questions
                  </Button>
                </div>
                <div className={styles.drawerItem}>
                  <Button
                    startIcon={<FiberManualRecordIcon />}
                    variant={page === 'User' ? 'contained' : undefined}
                    color={page === 'User' ? 'primary' : undefined}
                    disableElevation
                    onClick={() => router.push('/admin/users')}
                  >
                    Users
                  </Button>
                </div>
              </List>
            </div>
          </div>
        </Hidden>
      </div>
    </div>
  );
};

export default AdminDrawer;
