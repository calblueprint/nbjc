import { FormikErrors, useFormik } from 'formik';
import { useState, useEffect, ChangeEvent } from 'react';
import {
  Tabs,
  Tab,
  AppBar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import Layout from 'components/Layout';
import TabShortResponse from 'components/registration/TabShortResponse';
import TabBasics from 'components/registration/TabBasics';
import TabProj from 'components/registration/TabProj';
import schema, { Form } from 'interfaces/registration';
import { useRouter } from 'next/router';
import styles from '../styles/Registration.module.css';

const Registration: React.FC = () => {
  const router = useRouter();
  const [selected, setSelected] = useState(0);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [saveDraft, setSaveDraft] = useState(true);

  const validate = (values: Form): FormikErrors<Form> => {
    const { error } = schema.validate(values, {
      abortEarly: false,
      context: {
        strict: !saveDraft,
      },
    });

    const msg: { [k: string]: string } = error
      ? error.details.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.path[0]]: curr.message,
          }),
          {}
        )
      : {};

    return msg;
  };

  const handleChange = (
    _event: ChangeEvent<unknown>,
    newValue: number
  ): void => {
    setSelected(newValue);
  };

  const handleSubmit = (values: Form): void => {
    console.log('submitting', values);
    // TODO: Change status to submitted when submitted
  };

  const initialValues: Form = {
    name: '',
    contactName: '',
    contactEmail: '',
    organizationType: '',
    workType: '',
    address: '',
    missionStatement: '',
    shortHistory: '',
    lgbtqDemographic: [],
    raceDemographic: [],
    ageDemographic: [],
    capacity: undefined,
    ein: '',
    foundingDate: undefined,
    is501c3: false,
    website: '',
    short1: '',
    short2: '',
    short3: '',
    proj1: '',
    proj2: '',
    proj3: '',
    locationType: '',
  };

  const formik = useFormik({
    initialValues,
    validate,
    validateOnChange: false,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (!saveDraft) {
      formik.submitForm();
      setSaveDraft(true);
    }
  }, [saveDraft, formik]);

  return (
    <Layout title="Register">
      <Dialog open={exitDialogOpen} onClose={() => setExitDialogOpen(false)}>
        <DialogTitle>Exit Without Saving</DialogTitle>
        <DialogContent>
          Are you sure you wish to exit without saving?
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push('/users/profile')}
          >
            Yes
          </Button>
          <Button
            variant="contained"
            color="primary"
            autoFocus
            onClick={() => setExitDialogOpen(false)}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
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
              touched={formik.touched}
              errors={formik.errors}
            />
          )}
          {selected === 1 && (
            <TabProj
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              values={formik.values}
              setFieldValue={formik.setFieldValue}
              touched={formik.touched}
              errors={formik.errors}
            />
          )}
          {selected === 2 && (
            <TabShortResponse
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              values={formik.values}
              setFieldValue={formik.setFieldValue}
              touched={formik.touched}
              errors={formik.errors}
            />
          )}
        </div>
        <div className={styles.bottomButtons}>
          <div>
            <Button variant="contained" onClick={() => setExitDialogOpen(true)}>
              Exit
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              className={styles.autoField}
              type="submit"
            >
              Save Changes
            </Button>
            <Button
              variant="contained"
              className={styles.autoField}
              color="primary"
              onClick={() => setSaveDraft(false)}
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
