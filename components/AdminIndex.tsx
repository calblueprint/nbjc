import Link from 'next/link';
// eslint-disable-next-line import/no-extraneous-dependencies
import SearchIcon from '@material-ui/icons/Search';
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import styles from '../styles/AdminIndex.module.css';

type Props = {
  title?: string;
  head?: string;
  buttonApp: typeof Button;
  buttonOrg: typeof Button;
  buttonQue: typeof Button;
  buttonUse: typeof Button;
  search: string;
};

const AdminIndex: React.FunctionComponent<Props> = ({
  children,
  title = 'NBJC',
  head,
  buttonApp,
  buttonOrg,
  buttonQue,
  buttonUse,
  search,
}) => (
  <div className={styles.page}>
    <header className={styles.head}>
      <div className={styles.titleSearch}>
        <div className={styles.pageTitle}>
          <Link href="/">
            <a>{title}</a>
          </Link>
        </div>
        <div className={styles.searchBar}>
          <div>
            <IconButton color="primary">
              <SearchIcon />
            </IconButton>
            <TextField id="standard-basic" label="Explore Organizations" />
          </div>
        </div>
      </div>
      <div className={styles.linksHeader}>
        <div className={styles.link}>
          <Link href="/">
            <a>Map</a>
          </Link>
          <Link href="/">
            <a>Review</a>
          </Link>
          <Link href="/">
            <a>Dashboard</a>
          </Link>
        </div>
        <div className={styles.admin}>
          <Button variant="contained" color="primary" href="#contained-buttons">
            Admin
          </Button>
        </div>
      </div>
    </header>
    <div className={styles.content}>
      <div className={styles.leftCol}>
        <div className={styles.buttons}>
          {buttonApp}
          {buttonOrg}
          {buttonQue}
          {buttonUse}
        </div>
      </div>
      <div className={styles.rightCol}>
        <div className={styles.header}>
          <div className={styles.title}>{head}s</div>
          <div>
            <TextField
              fullWidth
              id={search}
              label={search}
              type="search"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton color="primary">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </div>
        </div>
        <div className={styles.table}>{children}</div>
      </div>
    </div>
    <footer />
  </div>
);

export default AdminIndex;
