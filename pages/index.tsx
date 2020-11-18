import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { PublicOrganization } from 'interfaces/organization';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from '@material-ui/core';
// import { signIn, signOut, useSession } from 'next-auth/client'; -> See below comment for future functionality
import SearchIcon from '@material-ui/icons/Search';
import Layout from 'components/Layout';
import styles from '../styles/Home.module.css';
import { getAllPublicOrganizations } from './api/orgs';

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
});

type HomeProps = {
  orgs: PublicOrganization[];
};

const Home: React.FC<HomeProps> = ({ orgs }) => {
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
            <div className={styles.filters}>
              <FormControl className={styles.filter} variant="outlined">
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
              <FormControl className={styles.filter} variant="outlined">
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
              <FormControl className={styles.filter} variant="outlined">
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

            <div className={styles.cards}>
              {orgs.map((org) => (
                <Card className={styles.card}>
                  <CardActionArea>
                    <CardContent>
                      <Typography variant="h5">{org.name}</Typography>
                      <Typography variant="body2">
                        {org.organizationType}
                        {org.organizationType && org.workType ? ' • ' : null}
                        {org.workType}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </div>
          </div>

          <div className={styles.rightCol}>
            <Map orgs={orgs} width="100%" height="100%" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const resp = await getAllPublicOrganizations();
    const orgs = JSON.parse(JSON.stringify(resp));
    console.log(orgs);
    return {
      props: {
        orgs,
      },
    };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};
