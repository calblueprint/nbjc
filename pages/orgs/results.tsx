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
import { useRouter } from 'next/router';
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
import Filters from 'components/results/Filters';
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
  const [searchVal, setSearchVal] = useState(searchValProp);
  const [demographicFilters, setDemographicFilters] = useState<
    LgbtqDemographic[]
  >([]);
  const [backgroundFilters, setBackgroundFilters] = useState<RaceDemographic[]>(
    []
  );
  const [audienceFilters, setAudienceFilters] = useState<AgeDemographic[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const lat = orgs[0].lat || 37.8712;
  const lon = orgs[0].long || -122.2601;
  const z = orgs[0] ? 9 : 0;
  const [viewport, setViewport] = useState<ViewportProps>({
    width: '100%',
    height: '100%',
    latitude: lat,
    longitude: lon,
    zoom: z,
  });

  const handleDemographicChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setDemographicFilters(event.target.value as LgbtqDemographic[]);
  };

  const handleBackgroundChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setBackgroundFilters(event.target.value as RaceDemographic[]);
  };

  const handleAudienceChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setAudienceFilters(event.target.value as AgeDemographic[]);
  };

  const handleSearch = (): void => {
    router.push({
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
      handleSearch={() => handleSearch()}
      searchFilters={searchVal}
      handleSearchChange={(event) => setSearchVal(event.target.value)}
    >
      <div className={styles.pageFlex}>
        <div className={styles.pageContent}>
          <div className={styles.leftCol}>
            <div className={styles.filters}>
              <Filters
                demographicFilters={demographicFilters}
                backgroundFilters={backgroundFilters}
                audienceFilters={audienceFilters}
                handleDemographicChange={handleDemographicChange}
                handleBackgroundChange={handleBackgroundChange}
                handleAudienceChange={handleAudienceChange}
                handleSearch={handleSearch}
              />
            </div>

            <div className={styles.cards}>
              {orgs && orgs.length !== 0 ? (
                orgs.map((org) => (
                  <Card className={styles.card} key={org.id}>
                    <CardActionArea
                      onClick={() => window.open(`/orgs/${org.id}`)}
                    >
                      <CardContent>
                        <Typography
                          className={styles.longOrgTitle}
                          variant="h5"
                        >
                          {org.name}
                        </Typography>
                        <Typography className={styles.orgInfo} variant="body2">
                          {splitCamCase(org.organizationType)}
                          {org.organizationType && org.workType ? ' • ' : null}
                          {splitCamCase(org.workType)}
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
            <Map
              objs={orgs}
              viewport={viewport}
              setViewport={setViewport}
              setSelectedObj={setSelectedOrg}
              selectedObj={selectedOrg}
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
