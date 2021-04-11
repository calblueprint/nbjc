import { TextField, InputAdornment, Card, Button } from '@material-ui/core';
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
import styles from 'styles/Home.module.css';

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
      try {
        const res = await fetch('/api/search/orgs/', {
          // This is a POST request because GET requests take no payload.
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orgName: values.orgName,
            ages: values.ages,
            ethnicity: values.ethnicity,
            orientation: values.orientation,
          }),
        });
      } catch (err) {
        console.log(err);
      }
    },
  });
  return (
    <Layout title="Home">
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.root}>
          <div className={styles.leftCol}>{slogan}</div>
          <div className={styles.rightCol}>
            <Card className={styles.searchCard}>
              <div className={styles.big}>Explore Organizations</div>
              <div className={styles.auto}>
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={Object.values(LgbtqDemographicLabels)}
                  getOptionLabel={(option) => option}
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
                    />
                  )}
                />
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={Object.values(RaceDemographicLabels)}
                  getOptionLabel={(option) => option}
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
                    />
                  )}
                />
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={Object.values(AgeDemographicLabels)}
                  getOptionLabel={(option) => option}
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
                />
                <Button
                  variant="contained"
                  className={styles.button}
                  color="primary"
                  type="submit"
                >
                  Search
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default Home;
