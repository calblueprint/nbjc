import { GetServerSideProps } from 'next';
import {
  LgbtqDemographic,
  RaceDemographic,
  AgeDemographic,
  Organization,
} from '@prisma/client';
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
};

const Results: React.FC<ResultsProps> = ({ orgs }) => {
  const router = useRouter();
  const { orgName, ages, ethnicity, orientation } = router.query;
  const filtersConverter = (filters: any) =>
    typeof filters === 'string' ? [filters] : filters;
  const [searchVal, setSearchVal] = useState(orgName as string | undefined);
  const [demographicFilters, setDemographicFilters] = useState<
    LgbtqDemographic[]
  >(filtersConverter(orientation));
  const [backgroundFilters, setBackgroundFilters] = useState<RaceDemographic[]>(
    filtersConverter(ethnicity)
  );
  const [audienceFilters, setAudienceFilters] = useState<AgeDemographic[]>(
    filtersConverter(ages)
  );

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
            <Map objs={orgs} width="100%" height="100%" />
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
