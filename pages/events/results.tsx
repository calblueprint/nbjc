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
              <Card className={styles.event_card}>
                <CardActionArea
                  // This will return a 404 Error if the ID 4 org is not active. Make sure it is active in Prisma Studio first. Will be fixed in a separate PR.
                  onClick={() => router.push(`/orgs/4?isEvent=${true}`)}
                >
                  <CardContent className={styles.event_card}>
                    {/* <div className={styles.card}> */}
                    {/* <div className={styles.left}>
                        <Typography className={styles.event_date}>
                          Monday, Feb 29, 10AM PST
                        </Typography>
                        <Typography className={styles.event_name}>
                          Event Name
                        </Typography>
                        <Typography className={styles.event_date}>
                          Location
                        </Typography>
                        <br />
                        <Typography className={styles.event_description}>
                          Short Description: Lorem ipsum dolor sit amet,
                          consectetur adipiscing elit, sed do eiusmod tempor
                          incididunt ut labore et dolore magna aliqua.
                        </Typography>
                      </div>
                      <div className={styles.right} /> */}
                    <div className={styles.card2}>
                      <div className={styles.top}>
                        <Image
                          src="/homepage.png"
                          alt="event image"
                          width={600}
                          height={100}
                        />
                      </div>
                      <div className={styles.bottom}>
                        <Typography className={styles.bottom_date}>
                          Monday, Feb 29, 10AM PST • Location
                        </Typography>
                        <Typography className={styles.bottom_name}>
                          Event Name
                        </Typography>
                        <Typography className={styles.bottom_host}>
                          Host Organization Name
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>
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
