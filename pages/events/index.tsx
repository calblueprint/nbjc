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
import Router from 'next/router';
import {
  AgeDemographicLabels,
  RaceDemographicLabels,
  LgbtqDemographicLabels,
} from 'utils/typesLinker';
import styles from 'styles/Events.module.css';
import {
  LgbtqDemographic,
  RaceDemographic,
  AgeDemographic,
} from '@prisma/client';
import EventCard from 'components/event/EventCard';
import { func } from 'joi';

const slogan = 'Empowering Black, LGBTQ, & SGL people and communities.';

const initialValues: homepageFields = {
  ages: [],
  orientation: [],
  ethnicity: [],
  orgName: '',
};

/* TODO: add onClick={goToMap} to submit button */

const Home: React.FC = () => {
  const formik = useFormik({
    initialValues,
    onSubmit: async (values): Promise<void> => {
      Router.push({
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
    <Layout title="Home">
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
          <EventCard event={1} />
          <EventCard event={1} />
          <EventCard event={1} />
          <EventCard event={1} />
          <EventCard event={1} />
        </div>
        <div className={styles.explore}>
          <Typography className={styles.trending}>Popular Near You</Typography>
          <Button className={styles.seeMore} type="submit">
            See More {'>'}
          </Button>
        </div>
        <div className={styles.trendingEvents}>
          <EventCard event={1} />
          <EventCard event={1} />
          <EventCard event={1} />
          <EventCard event={1} />
          <EventCard event={1} />
        </div>
      </form>
    </Layout>
  );
};

export default Home;
