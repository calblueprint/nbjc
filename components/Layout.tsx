import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Typography } from '@material-ui/core';
import styles from '../styles/Layout.module.css';

type Props = {
  title?: string;
};

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = 'NBJC',
}) => {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav className={styles.navbar}>
          <Link href="/">
            <a>
              <h1>NBJC</h1>
            </a>
          </Link>
          <div className={styles.nav}>
            <Link href="/">
              <a className={styles.link}>
                <Typography variant="h5">Home</Typography>
              </a>
            </Link>
            <Link href="/moderator">
              <a className={styles.link}>
                <Typography variant="h5">Moderator Dashboard</Typography>
              </a>
            </Link>
            <Link href="/users/settings">
              <a className={styles.link}>
                <Typography variant="h5">Users</Typography>
              </a>
            </Link>
            <div className={styles.buttons}>
              <Button
                className={styles.logButtonSpace}
                variant="contained"
                color="primary"
                onClick={() => router.push('/api/auth/signin')}
              >
                Log In
              </Button>
              <Button
                className={styles.logButtonSpace}
                variant="contained"
                color="primary"
                onClick={() => router.push('/registration')}
              >
                Join Us
              </Button>
            </div>
          </div>
        </nav>
      </header>
      {children}
      <footer className={styles.footer} />
    </div>
  );
};

export default Layout;
