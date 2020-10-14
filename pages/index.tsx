import dynamic from 'next/dynamic';
import Box from '@material-ui/core/Box';
import {
  Button,
  CircularProgress,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
// import { signIn, signOut, useSession } from 'next-auth/client';
import SearchIcon from '@material-ui/icons/Search';
import styles from '../styles/Home.module.css';

const MapVisual = dynamic(() => import('../components/Map'), {
  ssr: false,
});

const Home: React.FC = () => {
  return (
    <Box className={styles.pageFlex}>
      <Box className={styles.pageTitle}>
        NBJC
        <Box>
          <Button
            className={styles.logButtonSpace}
            variant="contained"
            color="primary"
          >
            Log In
          </Button>{' '}
          <Button
            className={styles.logButtonSpace}
            variant="contained"
            color="primary"
          >
            Join Us
          </Button>
        </Box>
      </Box>

      <Box className={styles.pageContent}>
        <Box className={styles.searchBar}>
          <Box>
            <IconButton color="primary">
              <SearchIcon />
            </IconButton>
            <TextField id="standard-basic" label="Explore Organizations" />
          </Box>
          <Box className={styles.keywords}>
            <Box className={styles.keyButtonSpace}>
              <FormControl className={styles.keyword} variant="outlined">
                <InputLabel>Keyword</InputLabel>
                <Select>
                  <MenuItem value={10}>Test1</MenuItem>
                  <MenuItem value={20}>Test1</MenuItem>
                  <MenuItem value={30}>Test1</MenuItem>
                </Select>
              </FormControl>{' '}
            </Box>
            <Box className={styles.keyButtonSpace}>
              <FormControl className={styles.keyword} variant="outlined">
                <InputLabel>Keyword</InputLabel>
                <Select>
                  <MenuItem value={10}>Test1</MenuItem>
                  <MenuItem value={20}>Test1</MenuItem>
                  <MenuItem value={30}>Test1</MenuItem>
                </Select>
              </FormControl>{' '}
            </Box>
            <Box className={styles.keyButtonSpace}>
              <FormControl className={styles.keyword} variant="outlined">
                <InputLabel>Keyword</InputLabel>
                <Select>
                  <MenuItem value={10}>Test1</MenuItem>
                  <MenuItem value={20}>Test1</MenuItem>
                  <MenuItem value={30}>Test1</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>

        <Box className={styles.textBox}>
          <Box className={styles.text}>SampleText1</Box>
          <Box className={styles.text}>SampleText2</Box>
          <Box className={styles.text}>SampleText3</Box>
        </Box>

        <Box className={styles.component} display="flex">
          <MapVisual />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
