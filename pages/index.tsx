import dynamic from 'next/dynamic';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@material-ui/core';
// import { signIn, signOut, useSession } from 'next-auth/client'; -> See below comment for future functionality
import SearchIcon from '@material-ui/icons/Search';
import Layout from 'components/Layout';
import styles from '../styles/Home.module.css';

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
});

const Home: React.FC = () => {
  // This is to verify whether or not the current user has a proper session configured to see the page.
  // Will be implemented in the next PR.
  // const [session, loading] = useSession();

  return (
    <Layout>
      <div className={styles.pageFlex}>
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

        <div className={styles.pageContent}>
          <div className={styles.leftCol}>
            <div className={styles.keywords}>
              <div className={styles.keyButtonSpace}>
                <FormControl className={styles.keyword} variant="outlined">
                  <InputLabel>Keyword</InputLabel>
                  <Select label="Keyword">
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={1}>One</MenuItem>
                    <MenuItem value={2}>Two</MenuItem>
                    <MenuItem value={3}>Three</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className={styles.keyButtonSpace}>
                <FormControl className={styles.keyword} variant="outlined">
                  <InputLabel>Keyword</InputLabel>
                  <Select label="Keyword">
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={1}>One</MenuItem>
                    <MenuItem value={2}>Two</MenuItem>
                    <MenuItem value={3}>Three</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className={styles.keyButtonSpace}>
                <FormControl className={styles.keyword} variant="outlined">
                  <InputLabel>More</InputLabel>
                  <Select label="More">
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={1}>One</MenuItem>
                    <MenuItem value={2}>Two</MenuItem>
                    <MenuItem value={3}>Three</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className={styles.cards}>Insert Cards Here</div>
          </div>

          <div className={styles.rightCol}>
            <Map width="100%" height="100%" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
