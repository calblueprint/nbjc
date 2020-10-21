import { Button } from '@material-ui/core';
import styles from '../styles/Home.module.css';

type Props = {
  title?: string;
};

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = 'NBJC',
}) => (
  <div>
    <header>
      <div className={styles.pageTitle}>
        {title}
        <div>
          <Button
            className={styles.logButtonSpace}
            variant="contained"
            color="primary"
          >
            Log In
          </Button>{' '}
          <Button
            className={styles.logButtonSpace}
            variant="contained"
            color="primary"
          >
            Join Us
          </Button>
        </div>
      </div>
    </header>
    {children}
    <footer />
  </div>
);

export default Layout;
