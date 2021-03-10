import { TextField, InputAdornment, Card, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useFormik } from 'formik';
import Layout from 'components/Layout';
import { homepageFields } from 'interfaces';
import styles from 'styles/Home.module.css';

const slogan = 'Empowering Black, LGBTQ, & SGL people and communities.';
const orientation = ['LGBTQ+ (all)', 'SGL', 'Transgender', 'Asexual/Aromantic'];
const ethnicity = ['Black', 'Pacific Islander', 'Latinx', 'Native/Indigenous'];
const ages = ['All ages', 'Children', 'Teens', 'Adults', 'Seniors'];

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
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <Layout>
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
                  options={orientation}
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
                      placeholder="Orientation"
                    />
                  )}
                />
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={ethnicity}
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
                      placeholder="Ethnicity"
                    />
                  )}
                />
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={ages}
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
                      placeholder="Ages"
                    />
                  )}
                />
              </div>
              <div className={styles.row}>
                <TextField
                  id="outlined-size-small"
                  placeholder="Explore Organizations"
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
                  Submit
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
