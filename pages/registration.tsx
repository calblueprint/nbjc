import { useFormik } from 'formik';
import { Form } from 'interfaces';
import { useState, ChangeEvent } from 'react';
import { Tabs, Tab, AppBar, Button } from '@material-ui/core';
import Layout from 'components/Layout';
import TabShortResponse from 'components/registration/TabShortResponse';
import TabBasics from 'components/registration/TabBasics';
import TabProj from 'components/registration/TabProj';
import styles from 'styles/register.module.css';

const Register: React.FC = () => {
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
              values={formik.values}
              setFieldValue={formik.setFieldValue}
            />
          )}
          {selected === 1 && (
            <TabProj
              handleChange={formik.handleChange}
              values={formik.values}
            />
          )}
          {selected === 2 && (
            <TabShortResponse
              handleChange={formik.handleChange}
              values={formik.values}
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

export default Register;
