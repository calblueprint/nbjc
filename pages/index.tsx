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
const identityTypes = [
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

  // AUDIENCE TYPES
  // const [child, setChild] = useState(false);
  let child = false;
  let teen = false;
  let adult = false;
  let senior = false;
  // IDENTITY TYPES
  let lgbtqAll = false;
  let sgl = false;
  let transgender = false;
  let asexualAromantic = false;
  let otherLgbtq = false;
  // BACKGROUND TYPES
  let pocAll = false;
  let asian = false;
  let latinx = false;
  let black = false;
  let pacificIslander = false;
  let nativeIndigeneous = false;
  let otherRace = false;

  // handle changes
  const [identityFilters, setIdentityFilters] = React.useState<string[]>([]);
  const [backgroundFilters, setBackgroundFilters] = React.useState<string[]>(
    []
  );
  const [audienceFilters, setAudienceFilters] = React.useState<string[]>([]);

  const handleIdentityChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setIdentityFilters(event.target.value as string[]);
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
    child = false;
    teen = false;
    adult = false;
    senior = false;
    //
    lgbtqAll = false;
    sgl = false;
    transgender = false;
    asexualAromantic = false;
    otherLgbtq = false;
    //
    pocAll = false;
    asian = false;
    latinx = false;
    black = false;
    pacificIslander = false;
    nativeIndigeneous = false;
    otherRace = false;
    //
    if (audienceFilters.includes('Child')) {
      child = true;
    }
    if (audienceFilters.includes('Teen')) {
      teen = true;
    }
    if (audienceFilters.includes('Adult')) {
      adult = true;
    }
    if (audienceFilters.includes('Senior')) {
      senior = true;
    }
    //
    if (identityFilters.includes('LGBTQ+')) {
      lgbtqAll = true;
    }
    if (identityFilters.includes('SGL')) {
      sgl = true;
    }
    if (identityFilters.includes('Transgender')) {
      transgender = true;
    }
    if (identityFilters.includes('Asexual/Aromantic')) {
      asexualAromantic = true;
    }
    if (identityFilters.includes('Other')) {
      otherLgbtq = true;
    }
    //
    if (backgroundFilters.includes('POC (All)')) {
      pocAll = true;
    }
    if (backgroundFilters.includes('Asian')) {
      asian = true;
    }
    if (backgroundFilters.includes('Latinx')) {
      latinx = true;
    }
    if (backgroundFilters.includes('Black')) {
      black = true;
    }
    if (backgroundFilters.includes('Pacific Islander')) {
      pacificIslander = true;
    }
    if (backgroundFilters.includes('Native/Indigeneous')) {
      nativeIndigeneous = true;
    }
    if (backgroundFilters.includes('Other')) {
      otherRace = true;
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

  // filter the orgs; enacts when apply button pressed
  const handleApplyChange = (): void => {
    console.log('Apply Button Pressed');
    setsTrue();
    orgs.filter(hasFilters);
    console.log('First:');
    console.log(orgsDisplayed);
    setOrgsDisplayed(orgs.filter(hasFilters));
    console.log('Second:');
    console.log(orgsDisplayed);
  };

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
                  value={identityFilters}
                  onChange={handleIdentityChange}
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
                  {identityTypes.map((filterOption: string) => (
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
