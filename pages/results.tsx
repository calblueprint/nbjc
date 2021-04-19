import { GetServerSideProps } from 'next';
import {
  PrismaClient,
  LgbtqDemographic,
  RaceDemographic,
  AgeDemographic,
} from '@prisma/client';
import prisma from 'utils/prisma';
import { useRouter } from 'next/router';
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
import {
  AgeDemographicLabels,
  LgbtqDemographicLabels,
  RaceDemographicLabels,
} from 'utils/typesLinker';

import SearchIcon from '@material-ui/icons/Search';
import Layout from 'components/Layout';
import styles from '../styles/Results.module.css';

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
});

type ResultsProps = {
  orgs: PublicOrganization[];
};

// const prisma = new PrismaClient();

const Results: React.FC<ResultsProps> = ({ orgs }) => {
  const router = useRouter();

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
              {orgs && orgs.length !== 0 ? (
                orgs.map((org) => (
                  <Card className={styles.card} key={org.id}>
                    <CardActionArea
                      onClick={() => router.push(`/orgs/${org.id}`)}
                    >
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
                ))
              ) : (
                <Typography>No Organizations</Typography>
              )}
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

export default Results;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Only add filters if they are listed, otherwise use all filters
    const orientationBody = context.query.orientation
      ? context.query.orientation
      : Object.keys(LgbtqDemographicLabels);
    const ethnicityBody = context.query.ethnicity
      ? context.query.ethnicity
      : Object.keys(RaceDemographicLabels);
    const agesBody = context.query.ages
      ? context.query.ages
      : Object.keys(AgeDemographicLabels);
    const orgs = await prisma.organization.findMany({
      where: {
        name: {
          contains: context.query?.orgName as string,
          mode: 'insensitive',
        },
        lgbtqDemographic: {
          hasSome: orientationBody as LgbtqDemographic[],
        },
        raceDemographic: {
          hasSome: ethnicityBody as RaceDemographic[],
        },
        ageDemographic: {
          hasSome: agesBody as AgeDemographic[],
        },
      },
    });
    const propOrgs = JSON.parse(JSON.stringify(orgs)) as PublicOrganization[];
    return {
      props: {
        orgs: propOrgs,
      },
    };
  } catch (err) {
    // Probably do a better error state, toast? Not just redirect and not indicate anything.
    console.log(err);
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
};
