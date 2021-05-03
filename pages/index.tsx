import { TextField, InputAdornment, Card, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useFormik } from 'formik';
import Layout from 'components/Layout';
import { homepageFields } from 'interfaces';
import Router, { useRouter } from 'next/router';
import {
  AgeDemographicLabels,
  RaceDemographicLabels,
  LgbtqDemographicLabels,
} from 'utils/typesLinker';
import {
  LgbtqDemographic,
  RaceDemographic,
  AgeDemographic,
} from '@prisma/client';
import Toast from 'components/Toast';
import styles from 'styles/Home.module.css';

const slogan = 'Empowering Black, LGBTQ+, & SGL people and communities.';

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
        pathname: '/orgs/results',
        query: {
          orgName: values.orgName,
          ages: values.ages,
          ethnicity: values.ethnicity,
          orientation: values.orientation,
        },
      });
    },
  });

  const renderSuccessToast = () => {
    return (
      <Toast
        snackbarProps={{
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        }}
        type="success"
        showDismissButton
      >
        <div>Password has been successfully reset!</div>
      </Toast>
    );
  };

  const router = useRouter();
  const { resetSuccess } = router.query;

  return (
    <Layout title="Home">
      {resetSuccess ? renderSuccessToast() : null}
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.root}>
          <div className={styles.topCol}>{slogan}</div>
          <div className={styles.bottomCol}>
            <Card className={styles.searchCard}>
              <div className={styles.big}>Explore Organizations</div>
              <div className={styles.auto}>
                <Autocomplete
                  classes={{ listbox: styles.popper }}
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
                      // className={styles.testing}
                      variant="outlined"
                      placeholder="By Identities"
                      size="small"
                    />
                  )}
                />
                <Autocomplete
                  classes={{ listbox: styles.popper }}
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
                  classes={{ listbox: styles.popper }}
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
      </form>
      <div className={styles.bottomButtons}>
        <a href="/about" className={styles.bottomButton}>
          About Us
        </a>
        <a href="/termsOfUse" className={styles.bottomButton}>
          Terms of Use
        </a>
        <a href="/privacyPolicy" className={styles.bottomButton}>
          Privacy Policy
        </a>
      </div>
    </Layout>
  );
};

export default Home;
