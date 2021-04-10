import { TextField, InputAdornment, Card, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useFormik } from 'formik';
import Layout from 'components/Layout';
import { homepageFields } from 'interfaces';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import styles from 'styles/Home.module.css';
import { GetServerSideProps } from 'next';
import mapboxgl from 'mapbox-gl';

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
                      placeholder="By Identities"
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
                      placeholder="By Background"
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const geocoder = new MapboxGeocoder({
  //   accessToken:
  //     'pk.eyJ1IjoibmJqYy1jYWxibHVlcHJpbnQiLCJhIjoiY2tnNHVsMGJ6MGl1aTJ2cXNpZnM3YXRieiJ9.FXKfdWi8TBjCBIvtK67tyQ',
  //   mapboxgl: mapboxgl,
  // });
  // const res = geocoder.query('5621 Applegate Way Dublin CA 94568');
  // console.log(res);
  var search_text = '5621 Applegate Way Dublin California 94568';
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${search_text}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`;
  console.log(url);
  const res = await fetch(url).then((result) => console.log(result.body));
  // console.log(res.headers);
  // res.then((result) => {
  //   console.log(result);
  // });
  // const stuff = res.json();
  // const obj = JSON.stringify(res);
  // console.log(obj);
  // console.log(stuff);

  //   const opts = {
  //     provider: 'geocodio',
  //     apiKey: '2d1d6072010006d900629210772228071162219',
  //     formatter: null,
  //   } as Options;
  //   const geo = node_geocoder(opts);
  //   const q = {
  //     address: '5621 Applegate Way, Dublin CA',
  //     country: 'USA',
  //     zipcode: '94568',
  //   } as Query;
  //   const res = geo.geocode(q);
  //   console.log('yeet');
  //   console.log(res);
  return { props: { search_text } };
};

export default Home;
