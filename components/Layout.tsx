import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@material-ui/core';
import styles from '../styles/Layout.module.css';

type Props = {
  title?: string;
};

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = 'NBJC',
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav className={styles.pageTitle}>
        <h1>NBJC</h1>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>
        <Link href="/users">
          <a>Users List</a>
        </Link>
        <Link href="/moderator">
          <a>Moderator Dashboard</a>
        </Link>
        <Link href="/orgs">
          <a>Orgs List</a>
        </Link>
        <Link href="/api/users">
          <a>Users API</a>
        </Link>
        <Link href="/admin/applications">
          <a>Admin Dashboard</a>
        </Link>
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
      </nav>
    </header>
    {children}
    <footer>
      <hr />
      <Link href="/">
        <a>NBJC</a>
      </Link>
    </footer>
  </div>
);

export default Layout;
