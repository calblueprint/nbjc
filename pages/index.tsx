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
import { Organization } from '@prisma/client';
import styles from '../styles/Home.module.css';

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
});

type HomeProps = {
  orgs: PublicOrganization[];
};

// using lists for now, but maybe replace with enums?
const demographicTypes = [
  'LGBTQ+',
  'SGL',
  'Transgender',
  'Asexual/Aromantic',
  'Other',
];

const audienceTypes = ['Child', 'Teen', 'Adult', 'Senior'];

const backgroundTypes = [
  'POC (All)',
  'Black',
  'Asian',
  'Pacific Islander',
  'Latinx',
  'Native/Indigeneous',
  'Other',
];

const Home: React.FC<HomeProps> = ({ orgs }) => {
  const router = useRouter();

  // ///// ADDED [START] /////

  // AUDIENCE TYPES
  const [child, setChild] = useState(false);
  const [teen, setTeen] = useState(false);
  const [adult, setAdult] = useState(false);
  const [senior, setSenior] = useState(false);
  // IDENTITY TYPES
  const [lgbtqAll, setLgbtqAll] = useState(false);
  const [sgl, setSgl] = useState(false);
  const [transgender, setTransgender] = useState(false);
  const [asexualAromantic, setAsexualAromantic] = useState(false);
  const [otherLgbtq, setOtherLgbtq] = useState(false);
  // BACKGROUND TYPES
  const [pocAll, setPocAll] = useState(false);
  const [asian, setAsian] = useState(false);
  const [latinx, setLatinx] = useState(false);
  const [black, setBlack] = useState(false);
  const [pacificIslander, setPacificIslander] = useState(false);
  const [nativeIndigeneous, setNativeIndigeneous] = useState(false);
  const [otherRace, setOtherRace] = useState(false);

  // handle changes
  const [demographicFilters, setDemographicFilters] = React.useState<string[]>(
    []
  );
  const [backgroundFilters, setBackgroundFilters] = React.useState<string[]>(
    []
  );
  const [audienceFilters, setAudienceFilters] = React.useState<string[]>([]);

  const handleDemographicChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setDemographicFilters(event.target.value as string[]);
  };

  const handleBackgroundChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setBackgroundFilters(event.target.value as string[]);
  };

  const handleAudienceChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setAudienceFilters(event.target.value as string[]);
  };

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
    if (audienceFilters.includes('Child')) {
      setChild(true);
    }
    if (audienceFilters.includes('Teen')) {
      setTeen(true);
    }
    if (audienceFilters.includes('Adult')) {
      setAdult(true);
    }
    if (audienceFilters.includes('Senior')) {
      setSenior(true);
    }
    //
    if (demographicFilters.includes('LGBTQ+')) {
      setLgbtqAll(true);
    }
    if (demographicFilters.includes('SGL')) {
      setSgl(true);
    }
    if (demographicFilters.includes('Transgender')) {
      setTransgender(true);
    }
    if (demographicFilters.includes('Asexual/Aromantic')) {
      setAsexualAromantic(true);
    }
    if (demographicFilters.includes('Other')) {
      setOtherLgbtq(true);
    }
    //
    if (backgroundFilters.includes('POC (All)')) {
      setPocAll(true);
    }
    if (backgroundFilters.includes('Asian')) {
      setAsian(true);
    }
    if (backgroundFilters.includes('Latinx')) {
      setLatinx(true);
    }
    if (backgroundFilters.includes('Black')) {
      setBlack(true);
    }
    if (backgroundFilters.includes('Pacific Islander')) {
      setPacificIslander(true);
    }
    if (backgroundFilters.includes('Native/Indigeneous')) {
      setNativeIndigeneous(true);
    }
    if (backgroundFilters.includes('Other')) {
      setOtherRace(true);
    }
  }

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

  // cards for orgs
  const displayOrgs = (): React.ElementType | void => {
    <div className={styles.cards}>
      {orgsDisplayed.length !== 0 ? (
        orgsDisplayed.map((org) => (
          <Card className={styles.card} key={org.id}>
            <CardActionArea onClick={() => router.push(`/orgs/${org.id}`)}>
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
    </div>;
  };

  // filter the orgs; enacts when apply button pressed
  const handleApplyChange = (): void => {
    setsTrue();
    setOrgsDisplayed(orgs.filter(hasFilters));
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
              <FormControl className={styles.filter} variant="outlined">
                <InputLabel classes={{ root: styles.filterLabel }}>
                  Identities
                </InputLabel>
                <Select
                  native={false}
                  className={styles.filterDropDown}
                  label="Identities"
                  multiple
                  value={demographicFilters}
                  onChange={handleDemographicChange}
                  renderValue={() => (
                    <InputLabel classes={{ root: styles.selectedLabel }}>
                      Identities
                    </InputLabel>
                  )}
                  MenuProps={{
                    variant: 'menu',
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  {demographicTypes.map((filterOption: string) => (
                    <MenuItem
                      classes={{
                        selected: styles.selectedFilter,
                        root: styles.filterOption,
                      }}
                      disableRipple
                      value={filterOption}
                      key={filterOption}
                    >
                      {filterOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className={styles.filter} variant="outlined">
                <InputLabel className={styles.filterLabel}>
                  Background
                </InputLabel>
                <Select
                  className={styles.filterDropDown}
                  label="Background"
                  multiple
                  value={backgroundFilters}
                  onChange={handleBackgroundChange}
                  renderValue={() => (
                    <InputLabel classes={{ root: styles.selectedLabel }}>
                      Background
                    </InputLabel>
                  )}
                  MenuProps={{
                    variant: 'menu',
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  {backgroundTypes.map((filterOption: string) => (
                    <MenuItem
                      classes={{
                        selected: styles.selectedFilter,
                        root: styles.filterOption,
                      }}
                      className={styles.filterOption}
                      disableRipple
                      value={filterOption}
                      key={filterOption}
                    >
                      {filterOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className={styles.filter} variant="outlined">
                <InputLabel className={styles.filterLabel}>Audience</InputLabel>
                <Select
                  className={styles.filterDropDown}
                  label="Audience"
                  multiple
                  value={audienceFilters}
                  onChange={handleAudienceChange}
                  renderValue={() => (
                    <InputLabel classes={{ root: styles.selectedLabel }}>
                      Audience
                    </InputLabel>
                  )}
                  MenuProps={{
                    variant: 'menu',
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  {audienceTypes.map((filterOption: string) => (
                    <MenuItem
                      classes={{
                        selected: styles.selectedFilter,
                        root: styles.filterOption,
                      }}
                      disableRipple
                      value={filterOption}
                      key={filterOption}
                    >
                      {filterOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyChange}
              >
                Apply
              </Button>
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
            ;
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
