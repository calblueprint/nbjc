import { GetServerSideProps } from 'next';
import {
  LgbtqDemographic,
  RaceDemographic,
  AgeDemographic,
  OrganizationEvent,
} from '@prisma/client';
import {
  AgeDemographicLabels,
  LgbtqDemographicLabels,
  RaceDemographicLabels,
} from 'utils/typesLinker';
import prisma from 'utils/prisma';
import Filters from 'components/results/Filters';
import Router, { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import HorizEventCard from 'components/event/EventCard/horizEventCard';
import Layout from 'components/Layout';
import { useState } from 'react';
import styles from '../../styles/Results.module.css';

const Map = dynamic(() => import('../../components/Map'), {
  ssr: false,
});

type EventsResultsProps = {
  events: OrganizationEvent[];
  searchValProp: string;
};

const EventsResults: React.FC<EventsResultsProps> = ({
  events,
  searchValProp,
}) => {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState(searchValProp);
  const [demographicFilters, setDemographicFilters] = useState<
    LgbtqDemographic[]
  >([]);
  const [backgroundFilters, setBackgroundFilters] = useState<RaceDemographic[]>(
    []
  );
  const [audienceFilters, setAudienceFilters] = useState<AgeDemographic[]>([]);

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
    Router.push({
      pathname: router.pathname,
      query: {
        eventName: searchVal,
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
            <div className={styles.event_cards}>
              {events.map((event) => (
                <HorizEventCard event={event} />
              ))}
            </div>
          </div>
          <div className={styles.rightCol}>
            <Map objs={events} width="100%" height="100%" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventsResults;

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
    const events = await prisma.organizationEvent.findMany({
      where: {
        title: {
          contains: context.query?.eventName as string,
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
    return {
      props: {
        events,
        searchValProp: context.query?.eventName,
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
