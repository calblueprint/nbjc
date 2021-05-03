import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import prisma from 'utils/prisma';
import {
  LgbtqDemographic,
  RaceDemographic,
  AgeDemographic,
  OrganizationEvent,
} from '@prisma/client';
import {
  TextField,
  InputAdornment,
  Card,
  Button,
  Typography,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useFormik } from 'formik';
import Layout from 'components/Layout';
import { homepageFields } from 'interfaces';
import {
  AgeDemographicLabels,
  RaceDemographicLabels,
  LgbtqDemographicLabels,
} from 'utils/typesLinker';
import HorizEventCard from 'components/event/EventCard/horizEventCard';
import styles from '../../styles/Events.module.css';

const slogan = 'Empowering Black, LGBTQ, & SGL people and communities.';

/* TODO: add onClick={goToMap} to submit button */

type Props = {
  events?: OrganizationEvent[];
};

const EventsHome: React.FC<Props> = ({ events }) => {
  const router = useRouter();

  const initialValues: homepageFields = {
    ages: [],
    orientation: [],
    ethnicity: [],
    orgName: '',
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values): Promise<void> => {
      router.push({
        pathname: '/events/results',
        query: {
          orgName: values.orgName,
          ages: values.ages,
          ethnicity: values.ethnicity,
          orientation: values.orientation,
        },
      });
    },
  });

  return (
    <Layout title="Events Home">
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.root}>
          <div className={styles.topCol}>{slogan}</div>
          <div className={styles.bottomCol}>
            <Card className={styles.searchCard}>
              <div className={styles.big}>Explore Events</div>
              <div className={styles.auto}>
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={
                    Object.keys(LgbtqDemographicLabels) as LgbtqDemographic[]
                  }
                  getOptionLabel={(option: LgbtqDemographic) =>
                    LgbtqDemographicLabels[option]
                  }
                  filterSelectedOptions
                  onChange={(event, newValue) => {
                    formik.setFieldValue('orientation', newValue);
                  }}
                  className={styles.autoField}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="By Identities"
                      size="small"
                    />
                  )}
                />
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={
                    Object.keys(RaceDemographicLabels) as RaceDemographic[]
                  }
                  getOptionLabel={(option: RaceDemographic) =>
                    RaceDemographicLabels[option]
                  }
                  filterSelectedOptions
                  onChange={(event, newValue) => {
                    formik.setFieldValue('ethnicity', newValue);
                  }}
                  className={styles.autoField}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="By Background"
                      size="small"
                    />
                  )}
                />
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={
                    Object.keys(AgeDemographicLabels) as AgeDemographic[]
                  }
                  getOptionLabel={(option: AgeDemographic) =>
                    AgeDemographicLabels[option]
                  }
                  filterSelectedOptions
                  onChange={(event, newValue) => {
                    formik.setFieldValue('ages', newValue);
                  }}
                  className={styles.autoField}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="By Audiences"
                      size="small"
                    />
                  )}
                />
              </div>
              <div className={styles.row}>
                <TextField
                  id="outlined-size-small"
                  placeholder="By Name"
                  fullWidth
                  className={styles.textField}
                  onChange={formik.handleChange}
                  name="orgName"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="small"
                />
                <Button
                  variant="contained"
                  className={styles.button}
                  type="submit"
                >
                  Search
                </Button>
              </div>
            </Card>
          </div>
        </div>
        <div className={styles.explore}>
          <Typography className={styles.trending}>Trending Events</Typography>
          <Button className={styles.seeMore} type="submit">
            See More {'>'}
          </Button>
        </div>
        <div className={styles.trendingEvents}>
          {events &&
            events.map((event) => (
              <HorizEventCard key={event.id} event={event} />
            ))}
        </div>
        <div className={styles.explore}>
          <Typography className={styles.trending}>Popular Near You</Typography>
          <Button className={styles.seeMore} type="submit">
            See More {'>'}
          </Button>
        </div>
        <div className={styles.trendingEvents}>
          {events &&
            events.map((event) => (
              <HorizEventCard key={event.id} event={event} />
            ))}
        </div>
      </form>
    </Layout>
  );
};

export default EventsHome;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const events = await prisma.organizationEvent.findMany();
    return {
      props: { events },
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
};
