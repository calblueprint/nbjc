import dynamic from 'next/dynamic';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@material-ui/core';
// import { signIn, signOut, useSession } from 'next-auth/client';
import SearchIcon from '@material-ui/icons/Search';
import Layout from 'components/Layout';
import styles from '../styles/Home.module.css';

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
});

const Home: React.FC = () => {
  return (
    <Layout>
      <div className={styles.pageFlex}>
        <TextField
          id="outlined-size-small"
          placeholder="Explore Organizations"
          size="normal"
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

        <div className={styles.pageContent}>
          <div className={styles.leftCol}>
            <div className={styles.keywords}>
              <div className={styles.keyButtonSpace}>
                <FormControl className={styles.keyword} variant="outlined">
                  <InputLabel>Keyword</InputLabel>
                  <Select>
                    <MenuItem value={10}>Test1</MenuItem>
                    <MenuItem value={20}>Test1</MenuItem>
                    <MenuItem value={30}>Test1</MenuItem>
                  </Select>
                </FormControl>{' '}
              </div>
              <div className={styles.keyButtonSpace}>
                <FormControl className={styles.keyword} variant="outlined">
                  <InputLabel>Keyword</InputLabel>
                  <Select>
                    <MenuItem value={10}>Test1</MenuItem>
                    <MenuItem value={20}>Test1</MenuItem>
                    <MenuItem value={30}>Test1</MenuItem>
                  </Select>
                </FormControl>{' '}
              </div>
              <div className={styles.keyButtonSpace}>
                <FormControl className={styles.keyword} variant="outlined">
                  <InputLabel>More</InputLabel>
                  <Select>
                    <MenuItem value={10}>Test1</MenuItem>
                    <MenuItem value={20}>Test1</MenuItem>
                    <MenuItem value={30}>Test1</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className={styles.cards}>Insert Cards Here</div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.component}>
              <Map />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
