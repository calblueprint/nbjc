import { useFormik } from 'formik';
import { Form } from 'interfaces';
import { useState, ChangeEvent } from 'react';
import { Tabs, Tab, AppBar, Button } from '@material-ui/core';
import Layout from 'components/Layout';
import TabShortResponse from 'components/registration/TabShortResponse';
import TabBasics from 'components/registration/TabBasics';
import TabProj from 'components/registration/TabProj';
import styles from 'styles/Registration.module.css';

const validate = (values: string): { [k: string]: string } => {
  const errors: { [k: string]: string } = {};
  const r = '*Required';
  if (!values.orgName) {
    errors.orgName = r;
  }
  if (values.workType.length === 0) {
    errors.workType = r;
  }
  if (values.orgType.length === 0) {
    errors.orgType = r;
  }
  if (!values.contactName) {
    errors.contactName = r;
  }
  if (!values.contactEmail) {
    errors.contactEmail = r;
  } else if (
    values.contactEmail.includes(' ') ||
    !values.contactEmail.includes('@') ||
    !values.contactEmail.includes('.')
  ) {
    errors.contactEmail = '*Invalid Email';
  }
  if (!values.website) {
    errors.website = r;
  }
  if (!values.location) {
    errors.location = r;
  }
  if (!values.street) {
    errors.street = r;
  }
  if (!values.city) {
    errors.city = r;
  }
  if (!values.state) {
    errors.state = r;
  }
  if (!values.zipcode) {
    errors.zipcode = r;
  }
  if (values.EIN.length === 0) {
    errors.EIN = r;
  }
  if (!values.foundingDate) {
    errors.foundingDate = r;
  }
  if (values.ages.length === 0) {
    errors.ages = r;
  }
  if (values.orientation.length === 0) {
    errors.orientation = r;
  }
  if (values.ethnicity.length === 0) {
    errors.ethnicity = r;
  }
  if (!values.missionHistory) {
    errors.missionHistory = r;
  }
  if (!values.proj1) {
    errors.proj1 = r;
  }
  if (!values.proj2) {
    errors.proj2 = r;
  }
  if (!values.proj3) {
    errors.proj3 = r;
  }
  if (!values.short1) {
    errors.short1 = r;
  }
  if (!values.short2) {
    errors.short2 = r;
  }
  if (!values.short3) {
    errors.short3 = r;
  }
  return errors;
};

const Registration: React.FC = () => {
  const [selected, setSelected] = useState<number>(0);
  const handleChange = (
    _event: ChangeEvent<unknown>,
    newValue: number
  ): void => {
    setSelected(newValue);
  };
  const initialValues: Form = {
    workType: [],
    orgType: [],
    EIN: '',
    ages: [],
    orientation: [],
    ethnicity: [],
    foundingDate: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    orgName: '',
    contactName: '',
    contactEmail: '',
    website: '',
    missionHistory: '',
    short1: '',
    short2: '',
    short3: '',
    proj1: '',
    proj2: '',
    proj3: '',
    location: '',
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Layout title="Register">
      <h1 className={styles.header}>Registration Form</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.root}>
          <AppBar position="static" color="default" className={styles.appBar}>
            <Tabs value={selected} onChange={handleChange}>
              <Tab label="Basics" />
              <Tab label="Projects and Events" />
              <Tab label="Short Response" />
            </Tabs>
          </AppBar>
          {selected === 0 && (
            <TabBasics
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              values={formik.values}
              setFieldValue={formik.setFieldValue}
              touch={formik.touched}
              formikErrors={formik.errors}
            />
          )}
          {selected === 1 && (
            <TabProj
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              values={formik.values}
              setFieldValue={formik.setFieldValue}
              touch={formik.touched}
              formikErrors={formik.errors}
            />
          )}
          {selected === 2 && (
            <TabShortResponse
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              values={formik.values}
              setFieldValue={formik.setFieldValue}
              touch={formik.touched}
              formikErrors={formik.errors}
            />
          )}
        </div>
        <div className={styles.bottomButtons}>
          <div>
            <Button variant="contained">Exit</Button>
          </div>
          <div>
            <Button variant="contained" className={styles.autoField}>
              Save Changes
            </Button>
            <Button
              variant="contained"
              className={styles.autoField}
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default Registration;
