import { GetServerSideProps } from 'next';
import prisma from 'utils/prisma';
import { Prisma, Organization } from '@prisma/client';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { orgProfile } from 'interfaces/organization';
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
import SearchIcon from '@material-ui/icons/Search';
import Layout from 'components/Layout';
import Image from 'next/image';
import HorizEventCard from 'components/event/EventCard/horizEventCard';
import styles from '../../styles/Events.module.css';

const Map = dynamic(() => import('../../components/Map'), {
  ssr: false,
});

type EventsProps = {
  orgs: Organization[];
};

const Home: React.FC<EventsProps> = ({ orgs }) => {
  const router = useRouter();

  // This is to verify whether or not the current user has a proper session configured to see the page.
  // Will be implemented in the next PR.
  // const [session, loading] = useSession();

  return (
    <Layout>
      <div className={styles.pageFlex}>
        <TextField
          id="outlined-size-small"
          placeholder="Explore Events"
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

            <div className={styles.event_cards}>
              <HorizEventCard event={1} />
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
    const orgs = await prisma.organization.findMany({
      where: { active: true },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        organizationType: true,
        workType: true,
        lat: true,
        long: true,
      },
    });
    return {
      props: {
        orgs,
      },
    };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};
