import Link from 'next/link';
import { Box, Button, IconButton, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

type Props = {
  title?: string;
};

const AdminDash: React.FunctionComponent<Props> = ({
  children,
  title = 'NBJC',
}) => (
  <Box className={styles.page}>
    <Box className={styles.layout}>
      <Box className={styles.titleSearch}>
        <Box className={styles.pageTitle}>
          <Link href="/">
            <a>{title}</a>
          </Link>
        </Box>
        <Box className={styles.searchBar}>
          <Box>
            <IconButton color="primary">
              <SearchIcon />
            </IconButton>
            <TextField id="standard-basic" label="Explore Organizations" />
          </Box>
        </Box>
      </Box>
      <Box className={styles.linksHeader}>
        <Box className={styles.link}>
          <Link href="/">
            <a>Map</a>
          </Link>
          <Link href="/">
            <a>Review</a>
          </Link>
          <Link href="/">
            <a>Dashboard</a>
          </Link>
        </Box>
        <Box className={styles.admin}>
          <Button variant="contained" color="primary" href="#contained-buttons">
            Admin
          </Button>
        </Box>
      </Box>
    </Box>
    {children}
  </Box>
);

export default AdminDash;
