import Head from 'next/head';
import Link from 'next/link';
import {
  Button,
  Typography,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
  Input,
  InputAdornment,
  IconButton,
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
  pageTitle?: string;
  handleSearch?: () => void;
  searchFilters?: string;
  handleSearchChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = 'NBJC',
  handleSearch,
  searchFilters,
  handleSearchChange,
  pageTitle,
}) => {
  const router = useRouter();
  const [session, sessionLoading] = useSession();
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(
    null
  );

  let searchBar = null;
  let placeholderText = 'Explore Organizations';
  if (pageTitle === 'Moderator Dashboard') {
    placeholderText = "Look for an Organization's Application";
  }
  if (handleSearch) {
    searchBar = (
      <div className={styles.searchbar}>
        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
        <Input
          placeholder={placeholderText}
          fullWidth
          disableUnderline
          inputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          classes={{
            root: styles.searchRoot,
          }}
          // variant="outlined"
          value={searchFilters}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
      </div>
    );
  }

  if (sessionLoading) return <LinearProgress />;
  return (
    <div className={styles.entire}>
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
            {session &&
            (session.user.role === 'moderator' ||
              session.user.role === 'admin') ? (
              <>
                <Link href="/">
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
                <Link href="/events">
                  <a className={styles.link}>
                    <Typography variant="h5">Events</Typography>
                  </a>
                </Link>
              </>
            )}
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
                    {session.user.role === 'organization' ? (
                      <MenuItem
                        onClick={() => {
                          setUserMenuAnchor(null);
                          router.push('/orgs');
                        }}
                      >
                        Profile
                      </MenuItem>
                    ) : null}
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
                      onClick={async () => {
                        setUserMenuAnchor(null);
                        try {
                          await signOut({ redirect: false });
                          router.push('/');
                        } catch (err) {
                          // TODO: Add a toast
                          console.error('failed to sign out');
                        }
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
