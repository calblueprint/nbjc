import { GetServerSideProps } from 'next';
import {
  LgbtqDemographic,
  RaceDemographic,
  AgeDemographic,
  Organization,
} from '@prisma/client';
import ReactMapGL, { Marker, Popup, ViewportProps } from 'react-map-gl';
import {
  AgeDemographicLabels,
  LgbtqDemographicLabels,
  RaceDemographicLabels,
} from 'utils/typesLinker';
import prisma from 'utils/prisma';
import Router, { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Button,
  ButtonProps,
} from '@material-ui/core';
import Layout from 'components/Layout';
import { useState } from 'react';
import styles from '../../styles/Results.module.css';

const Map = dynamic(() => import('../../components/Map'), {
  ssr: false,
});

type ResultsProps = {
  orgs: Organization[];
  searchValProp: string;
};

function capFirstLetters(words: string | null) {
  if (words === null) {
    return '';
  }
  const separateWord = words.toLowerCase().split(' ');
  for (let i = 0; i < separateWord.length; i += 1) {
    separateWord[i] =
      separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
  }
  return separateWord.join(' ');
}

function splitCamCase(s: string | null) {
  if (s === null) {
    return '';
  }
  const str = s.split(/(?=[A-Z])/).join(' ');
  return capFirstLetters(str);
}

const Results: React.FC<ResultsProps> = ({ orgs, searchValProp }) => {
  const router = useRouter();

  // TO-DO optimize theme/color changes with Select, MenuItem, & Button components
  const demographicTypes = Object.keys(
    LgbtqDemographicLabels
  ) as LgbtqDemographic[];
  const backgroundTypes = Object.keys(
    RaceDemographicLabels
  ) as RaceDemographic[];
  const audienceTypes = Object.keys(AgeDemographicLabels) as AgeDemographic[];

  const [searchVal, setSearchVal] = useState(searchValProp);
  const [demographicFilters, setDemographicFilters] = useState<string[]>([]);
  const [backgroundFilters, setBackgroundFilters] = useState<string[]>([]);
  const [audienceFilters, setAudienceFilters] = useState<string[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const lat = orgs[0].lat || 37.8712;
  const lon = orgs[0].long || -122.2601;
  const z = orgs[0] ? 9 : 0;
  const [viewport, setViewport] = useState<ViewportStateProps | ViewportProps>({
    width: '100%',
    height: '100%',
    latitude: lat,
    longitude: lon,
    zoom: z,
  });

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

  // TO-DO fix return type here
  const outlinedButton = (props: ButtonProps): JSX.Element => (
    <Button variant="outlined" disableRipple {...props} />
  );

  const handleSearch = (): void => {
    Router.push({
      pathname: 'results',
      query: {
        orgName: searchVal,
        ages: audienceFilters,
        ethnicity: backgroundFilters,
        orientation: demographicFilters,
      },
    });
  };

  return (
    <Layout
      handleClickSearch={() => handleSearch()}
      searchFilters={searchVal}
      handleSearchChange={(event) => setSearchVal(event.target.value)}
    >
      <div className={styles.pageFlex}>
        <p className={styles.resultsTitle}>Results</p>
        <div className={styles.filters}>
          <FormControl
            focused={Boolean(demographicFilters.length)}
            className={styles.filter}
            variant="outlined"
          >
            <InputLabel shrink={false} classes={{ root: styles.filterLabel }}>
              {!demographicFilters.length && 'Identities'}
            </InputLabel>
            <Select
              classes={{
                Menu: styles.selectMenuOver,
              }}
              native={false}
              className={
                demographicFilters.length > 0
                  ? styles.filterDropDownActive
                  : styles.filterDropDown
              }
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
                classes: {
                  paper: styles.selectMenuOver,
                },
                getContentAnchorEl: null,
              }}
            >
              {demographicTypes.map((filterOption: LgbtqDemographic) => (
                <MenuItem
                  selected
                  classes={{
                    selected: styles.selectedFilter,
                    root: styles.filterOption,
                  }}
                  style={{
                    backgroundColor: demographicFilters.includes(filterOption)
                      ? '#F8F4FF'
                      : 'transparent',
                  }}
                  component={outlinedButton}
                  disableRipple
                  value={filterOption}
                >
                  {LgbtqDemographicLabels[filterOption]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            focused={Boolean(backgroundFilters.length)}
            className={styles.filter}
            variant="outlined"
          >
            <InputLabel shrink={false} className={styles.filterLabel}>
              {!backgroundFilters.length && 'Background'}
            </InputLabel>
            <Select
              className={
                backgroundFilters.length > 0
                  ? styles.filterDropDownActive
                  : styles.filterDropDown
              }
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
                classes: {
                  paper: styles.selectMenuOver,
                },
                getContentAnchorEl: null,
              }}
            >
              {backgroundTypes.map((filterOption: RaceDemographic) => (
                <MenuItem
                  selected
                  classes={{
                    selected: styles.selectedFilter,
                    root: styles.filterOption,
                  }}
                  component={outlinedButton}
                  className={styles.filterOption}
                  style={{
                    backgroundColor: backgroundFilters.includes(filterOption)
                      ? '#F8F4FF'
                      : 'transparent',
                  }}
                  disableRipple
                  value={filterOption}
                >
                  {RaceDemographicLabels[filterOption]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            focused={Boolean(audienceFilters.length)}
            className={styles.filter}
            variant="outlined"
          >
            <InputLabel shrink={false} className={styles.filterLabel}>
              {!audienceFilters.length && 'Audience'}
            </InputLabel>
            <Select
              className={
                audienceFilters.length > 0
                  ? styles.filterDropDownActive
                  : styles.filterDropDown
              }
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
                classes: {
                  paper: styles.selectMenuOver,
                },
                getContentAnchorEl: null,
              }}
            >
              {audienceTypes.map((filterOption: AgeDemographic) => (
                <MenuItem
                  selected
                  classes={{
                    selected: styles.selectedFilter,
                    root: styles.filterOption,
                  }}
                  component={outlinedButton}
                  disableRipple
                  style={{
                    backgroundColor: audienceFilters.includes(filterOption)
                      ? '#F8F4FF'
                      : 'transparent',
                  }}
                  value={filterOption}
                >
                  {AgeDemographicLabels[filterOption]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            className={styles.applyButton}
            onClick={handleSearch}
            disableElevation
          >
            <p className={styles.apply}>Apply</p>
          </Button>
        </div>
        <div className={styles.pageContent}>
          <div className={styles.leftCol}>
            <div className={styles.cards}>
              {orgs && orgs.length !== 0 ? (
                orgs.map((org) =>
                  selectedOrg?.id === org.id ? (
                    <Card
                      className={styles.card}
                      classes={{ root: styles.cardRootSelected }}
                      key={org.id}
                      onMouseEnter={() => {
                        setSelectedOrg(org);
                        setViewport({
                          width: '100%',
                          height: '100%',
                          latitude: selectedOrg?.lat,
                          longitude: selectedOrg?.long,
                          zoom: 4,
                        });
                      }}
                    >
                      <CardActionArea
                        onClick={() => router.push(`/orgs/${org.id}`)}
                      >
                        <CardContent>
                          <Typography
                            className={styles.longOrgTitleSelected}
                            variant="h5"
                          >
                            {org.name}
                          </Typography>
                          <Typography
                            className={styles.orgInfo}
                            variant="body2"
                          >
                            {splitCamCase(org.organizationType)}
                            {org.organizationType && org.workType
                              ? ' • '
                              : null}
                            {splitCamCase(org.workType)}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  ) : (
                    <Card
                      className={styles.card}
                      classes={{ root: styles.cardRoot }}
                      key={org.id}
                      onMouseEnter={() => {
                        setSelectedOrg(org);
                        setViewport({
                          width: '100%',
                          height: '100%',
                          latitude: org.lat,
                          longitude: org.long,
                          zoom: 4,
                        });
                      }}
                    >
                      <CardActionArea
                        onClick={() => router.push(`/orgs/${org.id}`)}
                      >
                        <CardContent>
                          <Typography
                            className={styles.longOrgTitle}
                            variant="h5"
                          >
                            {org.name}
                          </Typography>
                          <Typography
                            className={styles.orgInfo}
                            variant="body2"
                          >
                            {splitCamCase(org.organizationType)}
                            {org.organizationType && org.workType
                              ? ' • '
                              : null}
                            {splitCamCase(org.workType)}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  )
                )
              ) : (
                <Typography>No Organizations</Typography>
              )}
            </div>
          </div>

          <div className={styles.rightCol}>
            <Map
              orgs={orgs}
              width="100%"
              height="100%"
              viewport={viewport}
              setViewport={setViewport}
              setSelectedOrg={setSelectedOrg}
              selectedOrg={selectedOrg}
            />
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
        active: true,
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

    return {
      props: {
        orgs,
        searchValProp: context.query?.orgName,
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
