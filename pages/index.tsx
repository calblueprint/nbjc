import { GetServerSideProps } from 'next';
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
import SearchIcon from '@material-ui/icons/Search';
import Layout from 'components/Layout';
import React, { useState } from 'react';
import {
  AgeDemographic,
  LgbtqDemographic,
  Organization,
  RaceDemographic,
} from '@prisma/client';
import styles from '../styles/Home.module.css';

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
});

type HomeProps = {
  orgs: PublicOrganization[];
};

const Home: React.FC<HomeProps> = ({ orgs }) => {
  const router = useRouter();

  // ///// ADDED /////
  const [ageDemoVals, setAgeDemoVals] = useState([
    'child',
    'teen',
    'adult',
    'senior',
  ] as AgeDemographic[]);
  const [lgbtqDemoVals, setLgbtqDemoVals] = useState([
    'lgbtqAll',
    'sgl',
    'transgender',
    'asexualAromantic',
    'other',
  ] as LgbtqDemographic[]);
  const [raceDemoVals, setRaceDemoVals] = useState([
    'pocAll',
    'asian',
    'latinx',
    'black',
    'pacificIslander',
    'nativeIndigeneous',
    'other',
  ] as RaceDemographic[]);

  const handleAgeChange = (values: Array<AgeDemographic>): void => {
    setAgeDemoVals(values);
  };
  const handleLgbtqChange = (values: Array<LgbtqDemographic>): void => {
    setLgbtqDemoVals(values);
  };
  const handleRaceChange = (values: Array<RaceDemographic>): void => {
    setRaceDemoVals(values);
  };
  const testChange = (): void => {
    setAgeDemoVals(['adult', 'senior']);
  };

  // const getOrgs = prisma.organization.findMany({
  //  where: {
  //    ageDemographic: {
  //      hasEvery: ageDemoVals,
  //    },
  //    lgbtqDemographic: {
  //      hasEvery: lgbtqDemoVals,
  //    },
  //    raceDemographic: {
  //      hasEvery: raceDemoVals,
  //    },
  //  },
  // });

  // ///// ADDED /////

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
              <FormControl
                className={styles.filter}
                variant="outlined"
                onChange={testChange}
              >
                <InputLabel>Age</InputLabel>
                <Select label="Age">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="child">Children</MenuItem>
                  <MenuItem value="teens">Teens</MenuItem>
                  <MenuItem value="adults">Adults</MenuItem>
                  <MenuItem value="seniors">Seniors</MenuItem>
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

            {
              // ////// POSSIBLY DELETE //////
              // get list of values w their respective labels
              // get orgs like so: prisma.orgs
              // need to dynamically update,,,hm,,,
              //    reload page?
              //    use react's setOrg ability?
              // need to account for different amounts of keywords
              //    (use map)
              //
              // const orgResult = await prisma.orgs.findMany({})
              //  have a list of all the values from filter buttons
              //  map through all values in the function above^^^
              //    setOrgsDisplayed to orgResult
              // ////// POSSIBLY DELETE //////
            }

            <div className={styles.cards}>
              {orgs.length !== 0 ? (
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

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // let { ageDemoVals, lgbtqDemoVals, raceDemoVals } = useSWR(
    //   '/api/user',
    //   fetch
    // );
    // if (ageDemoVals === undefined || ageDemoVals === null) {
    //   ageDemoVals = ['child', 'teen', 'adult', 'senior'] as AgeDemographic[];
    // }

    const resp = await prisma.organization.findMany({
      where: {
        active: true,
        // ageDemographic: {
        //   hasEvery: ageDemoVals,
        // },
        // lgbtqDemographic: {
        //   hasEvery: lgbtqDemoVals,
        // },
        // raceDemographic: {
        //   hasEvery: raceDemoVals,
        // },
      },
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
        ageDemographic: true,
        lgbtqDemographic: true,
        raceDemographic: true,
      },
    });
    const orgs = JSON.parse(JSON.stringify(resp)) as PublicOrganization[];
    return {
      props: {
        orgs,
      },
    };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};
function useSWR(
  arg0: string,
  fetch: (
    input: RequestInfo,
    init?: RequestInit | undefined
  ) => Promise<Response>
): {
  ageDemoVals: Array<AgeDemographic>;
  lgbtqDemoVals: Array<LgbtqDemographic>;
  raceDemoVals: Array<RaceDemographic>;
} {
  throw new Error('Function not implemented.');
}
