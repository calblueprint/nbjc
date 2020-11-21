import { TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Layout from 'components/Layout';
import styles from 'styles/Home.module.css';

const slogan = 'Empowering Black, LGBTQ, & SGL people and communities.';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className={styles.root}>
        <div className={styles.leftCol}>{slogan}</div>
        <div className={styles.rightCol}>
          <div className={styles.searchField}>
            <TextField
              id="outlined-size-small"
              placeholder="Explore Organizations"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
