import { useFormik } from 'formik';
import { Form } from 'interfaces';
import { useState, ChangeEvent } from 'react';
import { Tabs, Tab, AppBar, Button } from '@material-ui/core';
import Layout from 'components/Layout';
import TabShortResponse from 'components/registration/TabShortResponse';
import TabBasics from 'components/registration/TabBasics';
import TabProj from 'components/registration/TabProj';
import styles from 'styles/Registration.module.css';
import schema from 'interfaces/registration';

const Registration: React.FC = () => {
  const validate = (values: string): Promise<{ [k: string]: string }> => {
    const errors: { [k: string]: string } = {};
    const { error } = schema.validate(values, {
      context: { strict: true },
      abortEarly: false,
    });
    if (error) {
      for (let i = 0; i < error.details.length; i += 1) {
        const val = error.details[i];
        errors[val.path[0]] = val.message;
      }
    }
    return errors;
  };
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
