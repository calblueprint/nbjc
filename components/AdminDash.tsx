import Link from 'next/link';
import { Button, IconButton, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import styles from 'styles/Home.module.css';

type Props = {
  title?: string;
};

const AdminDash: React.FunctionComponent<Props> = ({
  children,
  title = 'NBJC',
}) => (
  <div className={styles.page}>
    <div className={styles.layout}>
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
    </div>
    {children}
  </div>
);

export default AdminDash;
