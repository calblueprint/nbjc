import Link from 'next/link';
// eslint-disable-next-line import/no-extraneous-dependencies
import SearchIcon from '@material-ui/icons/Search';
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import AdminDrawer from 'components/adminDash/AdminDrawer';
import styles from '../../styles/admin/AdminIndex.module.css';

type Props = {
  title?: string;
  head?: string;
  search: string;
};

const AdminIndex: React.FunctionComponent<Props> = ({
  children,
  title = 'NBJC',
  head,
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
      <AdminDrawer page={head} />
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
