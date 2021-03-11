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
  Button,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Layout from 'components/Layout';
// DELETE LINE BELOW when implemented
// eslint-disable-next-line no-use-before-define
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

  // ///// ADDED [START] /////

  const [ageDemoVals, setAgeDemoVals] = useState([
    'child',
    'teen',
    'adult',
    'senior',
  ] as AgeDemographic[]);
  const [child, setChild] = useState(false);
  const [teen, setTeen] = useState(false);
  const [adult, setAdult] = useState(false);
  const [senior, setSenior] = useState(false);
  const [lgbtqDemoVals, setLgbtqDemoVals] = useState([
    'lgbtqAll',
    'sgl',
    'transgender',
    'asexualAromantic',
    'other',
  ] as LgbtqDemographic[]);
  const [lgbtqAll, setLgbtqAll] = useState(false);
  const [sgl, setSgl] = useState(false);
  const [transgender, setTransgender] = useState(false);
  const [asexualAromantic, setAsexualAromantic] = useState(false);
  const [otherLgbtq, setOtherLgbtq] = useState(false);
  const [raceDemoVals, setRaceDemoVals] = useState([
    'pocAll',
    'asian',
    'latinx',
    'black',
    'pacificIslander',
    'nativeIndigeneous',
    'other',
  ] as RaceDemographic[]);
  const [pocAll, setPocAll] = useState(false);
  const [asian, setAsian] = useState(false);
  const [latinx, setLatinx] = useState(false);
  const [black, setBlack] = useState(false);
  const [pacificIslander, setPacificIslander] = useState(false);
  const [nativeIndigeneous, setNativeIndigeneous] = useState(false);
  const [otherRace, setOtherRace] = useState(false);

  // goes through vals and checks if they have been set true
  function setsTrue(): void {
    setChild(false);
    setTeen(false);
    setAdult(false);
    setSenior(false);
    //
    setLgbtqAll(false);
    setSgl(false);
    setTransgender(false);
    setAsexualAromantic(false);
    setOtherLgbtq(false);
    //
    setPocAll(false);
    setAsian(false);
    setLatinx(false);
    setBlack(false);
    setPacificIslander(false);
    setNativeIndigeneous(false);
    setOtherRace(false);
    //
    if (ageDemoVals.includes('child')) {
      setChild(true);
    }
    if (ageDemoVals.includes('teen')) {
      setTeen(true);
    }
    if (ageDemoVals.includes('adult')) {
      setAdult(true);
    }
    if (ageDemoVals.includes('senior')) {
      setSenior(true);
    }
    //
    if (lgbtqDemoVals.includes('lgbtqAll')) {
      setLgbtqAll(true);
    }
    if (lgbtqDemoVals.includes('sgl')) {
      setSgl(true);
    }
    if (lgbtqDemoVals.includes('transgender')) {
      setTransgender(true);
    }
    if (lgbtqDemoVals.includes('other')) {
      setOtherLgbtq(true);
    }
    //
    if (raceDemoVals.includes('pocAll')) {
      setPocAll(true);
    }
    if (raceDemoVals.includes('asian')) {
      setAsian(true);
    }
    if (raceDemoVals.includes('latinx')) {
      setLatinx(true);
    }
    if (raceDemoVals.includes('black')) {
      setBlack(true);
    }
    if (raceDemoVals.includes('pacificIslander')) {
      setPacificIslander(true);
    }
    if (raceDemoVals.includes('nativeIndigeneous')) {
      setNativeIndigeneous(true);
    }
    if (raceDemoVals.includes('other')) {
      setOtherRace(true);
    }
  }

  // sets new incoming lists...prepare to compare w current list
  // DELETE LINE BELOW when implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAgeChange = (values: Array<AgeDemographic>): void => {
    setAgeDemoVals(values);
  };
  // DELETE LINE BELOW when implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLgbtqChange = (values: Array<LgbtqDemographic>): void => {
    setLgbtqDemoVals(values);
  };
  // DELETE LINE BELOW when implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRaceChange = (values: Array<RaceDemographic>): void => {
    setRaceDemoVals(values);
  };

  // orgs that will be shown to user
  const [orgsDisplayed, setOrgsDisplayed] = useState(orgs);

  // age filter func
  function hasFilters(org: Organization): Organization | undefined {
    if (child && !org.ageDemographic.includes('child')) {
      return undefined;
    }
    if (teen && !org.ageDemographic.includes('teen')) {
      return undefined;
    }
    if (adult && !org.ageDemographic.includes('adult')) {
      return undefined;
    }
    if (senior && !org.ageDemographic.includes('senior')) {
      return undefined;
    }
    //
    if (lgbtqAll && !org.lgbtqDemographic.includes('lgbtqAll')) {
      return undefined;
    }
    if (sgl && !org.lgbtqDemographic.includes('sgl')) {
      return undefined;
    }
    if (transgender && !org.lgbtqDemographic.includes('transgender')) {
      return undefined;
    }
    if (
      asexualAromantic &&
      !org.lgbtqDemographic.includes('asexualAromantic')
    ) {
      return undefined;
    }
    if (otherLgbtq && !org.lgbtqDemographic.includes('other')) {
      return undefined;
    }
    //
    if (pocAll && !org.raceDemographic.includes('pocAll')) {
      return undefined;
    }
    if (asian && !org.raceDemographic.includes('asian')) {
      return undefined;
    }
    if (latinx && !org.raceDemographic.includes('latinx')) {
      return undefined;
    }
    if (black && !org.raceDemographic.includes('black')) {
      return undefined;
    }
    if (pacificIslander && !org.raceDemographic.includes('pacificIslander')) {
      return undefined;
    }
    if (
      nativeIndigeneous &&
      !org.raceDemographic.includes('nativeIndigeneous')
    ) {
      return undefined;
    }
    if (otherRace && !org.raceDemographic.includes('other')) {
      return undefined;
    }
    //
    return org;
  }
  // filter the orgs; enacts when apply button pressed
  const handleApplyChange = (): void => {
    setsTrue();
    setOrgsDisplayed(orgs.filter(hasFilters));
  };

  // for testing purposes on backend
  const testChange = (): void => {
    setAgeDemoVals(['child']);
    setLgbtqDemoVals(['lgbtqAll']);
    setRaceDemoVals(['pocAll']);
  };

  // ///// ADDED [END] /////

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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={testChange}
                >
                  Test
                </Button>
              </FormControl>
              <FormControl
                className={styles.filter}
                variant="outlined"
                onChange={handleApplyChange}
              >
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleApplyChange}
                >
                  Apply
                </Button>
              </FormControl>
            </div>

            <div className={styles.cards}>
              {orgsDisplayed.length !== 0 ? (
                orgsDisplayed.map((org) => (
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
            <Map orgs={orgsDisplayed} width="100%" height="100%" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const resp = await prisma.organization.findMany({
      where: {
        active: true,
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
