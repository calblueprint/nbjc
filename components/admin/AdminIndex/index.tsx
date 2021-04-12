import SearchIcon from '@material-ui/icons/Search';
import { Button, InputAdornment, TextField } from '@material-ui/core';
import AdminDrawer from 'components/admin/AdminDrawer';
import styles from './AdminIndex.module.css';

type Props = {
  title?: string;
  page: string;
  search: string;
  addButtonOnClick: () => void;
};

const AdminIndex: React.FunctionComponent<Props> = ({
  children,
  page,
  search,
  addButtonOnClick,
}) => (
  <div className={styles.page}>
    <div className={styles.content}>
      <AdminDrawer page={page} />
      <div className={styles.rightCol}>
        <div className={styles.header}>
          <div className={styles.title}>{page}s</div>
          <div className={styles.headerActions}>
            <Button
              variant="contained"
              color="primary"
              className={styles.addButton}
              onClick={addButtonOnClick}
            >
              Add New {page}
            </Button>
            <TextField
              id={search}
              label={search}
              type="search"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
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
