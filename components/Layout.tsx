import Head from 'next/head';
import Link from 'next/link';
import {
  Button,
  Typography,
  LinearProgress,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import useSession from 'utils/useSession';
import { signOut } from 'next-auth/client';
import { useState } from 'react';
import styles from '../styles/Layout.module.css';

type Props = {
  title?: string;
};

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = 'NBJC',
}) => {
  const router = useRouter();
  const [session, sessionLoading] = useSession();
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(
    null
  );

  if (sessionLoading) return <LinearProgress />;
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
            {session &&
            (session.user.role === 'moderator' ||
              session.user.role === 'admin') ? (
              <>
                <Link href="/moderator">
                  <a className={styles.link}>
                    <Typography variant="h5">Map</Typography>
                  </a>
                </Link>
                <Link href="/moderator">
                  <a className={styles.link}>
                    <Typography variant="h5">Review</Typography>
                  </a>
                </Link>
              </>
            ) : (
              // Change below link to new events search page
              <>
                <Link href="/">
                  <a className={styles.link}>
                    <Typography variant="h5">Organizations</Typography>
                  </a>
                </Link>
                <Link href="/">
                  <a className={styles.link}>
                    <Typography variant="h5">Events</Typography>
                  </a>
                </Link>
              </>
            )}
            {/* <Link href="/users/settings">
              <a className={styles.link}>
                <Typography variant="h5">Users</Typography>
              </a>
            </Link> */}

            {/* For easy access to own profile? */}

            {/* {session && session.user.role === 'organization' ? (
              <Link href="/orgs">
                <a className={styles.link}>
                  <Typography variant="h5">Profile</Typography>
                </a>
              </Link>
            ) : null} */}
            {session && session.user.role === 'admin' ? (
              <Link href="/admin">
                <a className={styles.link}>
                  <Typography variant="h5">Dashboard</Typography>
                </a>
              </Link>
            ) : null}
            <div className={styles.buttons}>
              {!session ? (
                <div>
                  <Button
                    className={styles.logButtonSpace}
                    variant="outlined"
                    color="primary"
                    onClick={() => router.push('/signin')}
                  >
                    Sign In
                  </Button>
                  <Button
                    className={styles.logButtonSpace}
                    variant="contained"
                    color="primary"
                    onClick={() => router.push('/signup')}
                  >
                    Join Us
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    className={styles.logButtonSpace}
                    variant="contained"
                    color="primary"
                    onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                  >
                    {session.user.role}
                  </Button>
                  <Menu
                    anchorEl={userMenuAnchor}
                    keepMounted
                    open={Boolean(userMenuAnchor)}
                    onClose={() => setUserMenuAnchor(null)}
                  >
                    <MenuItem
                      onClick={() => {
                        setUserMenuAnchor(null);
                        router.push('/users/profile');
                      }}
                    >
                      Settings
                    </MenuItem>
                    <MenuItem
                      className={styles.signOutText}
                      onClick={() => {
                        setUserMenuAnchor(null);
                        signOut({ callbackUrl: '/' });
                      }}
                    >
                      Sign Out
                    </MenuItem>
                  </Menu>
                </>
              )}
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
