import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/client';
import styles from '../styles/Layout.module.css';

type Props = {
  title?: string;
};

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = 'NBJC',
}) => {
  const router = useRouter();
  const [session, loading] = useSession();

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null;

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
              <a className={styles.link}>Home</a>
            </Link>
            <Link href="/moderator">
              <a className={styles.link}>Moderator Dashboard</a>
            </Link>
            <Link href="/orgs">
              <a className={styles.link}>Orgs List</a>
            </Link>
            <div className={styles.buttons}>
              {!session ? (
                <div>
                  <Button
                    className={styles.logButtonSpace}
                    variant="contained"
                    color="primary"
                    onClick={() => router.push('/users/signin')}
                  >
                    Log In
                  </Button>
                  <Button
                    className={styles.logButtonSpace}
                    variant="contained"
                    color="primary"
                    onClick={() => router.push('/users/signup')}
                  >
                    Join Us
                  </Button>
                </div>
              ) : (
                <Button
                  className={styles.logButtonSpace}
                  variant="contained"
                  color="primary"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
};

export default Layout;
