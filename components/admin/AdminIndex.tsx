import SearchIcon from '@material-ui/icons/Search';
import { IconButton, InputAdornment, TextField } from '@material-ui/core';
import AdminDrawer from 'components/admin/AdminDrawer';
import styles from '../../styles/admin/AdminIndex.module.css';

type Props = {
  title?: string;
  head?: string;
  search: string;
};

const AdminIndex: React.FunctionComponent<Props> = ({
  children,
  head,
  search,
}) => (
  <div className={styles.page}>
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
