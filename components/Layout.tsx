import Head from 'next/head';
import Link from 'next/link';
import {
  TextField,
  FilledInput,
  InputAdornment,
  IconButton,
  Button,
  LinearProgress,
  Menu,
  MenuItem,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useRouter } from 'next/router';
import useSession from 'utils/useSession';
import { signOut } from 'next-auth/client';
import { useState } from 'react';
import styles from '../styles/Layout.module.css';

type Props = {
  title?: string;
  page?: boolean;
  handleClickSearch?: React.ChangeEventHandler<Element> | undefined;
  searchFilters?: string;
  handleSearchChange?: (event: React.ChangeEvent<{ value: unknown }>) => void;
};

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = 'NBJC',
  page,
  handleClickSearch,
  searchFilters,
  handleSearchChange,
}) => {
  const router = useRouter();
  const [session, sessionLoading] = useSession();
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(
    null
  );

  let searchBar = null;
  if (page) {
    searchBar = (
      <div className={styles.searchbar}>
        <TextField
          placeholder="Explore Organizations"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleClickSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          value={searchFilters}
          onChange={handleSearchChange}
        />
      </div>
    );
  }

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
          {searchBar}
          <div className={styles.nav}>
            <Link href="/">
              <a className={styles.link}>Map</a>
            </Link>
            {session && session.user.role === 'organization' ? (
              <Link href="/orgs">
                <a className={styles.link}>Profile</a>
              </Link>
            ) : null}
            {session &&
            (session.user.role === 'moderator' ||
              session.user.role === 'admin') ? (
              <Link href="/moderator">
                <a className={styles.link}>Review</a>
              </Link>
            ) : null}
            {session && session.user.role === 'admin' ? (
              <Link href="/admin">
                <a className={styles.link}>Dashboard</a>
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
                        signOut();
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
