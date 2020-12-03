import { GetServerSideProps } from 'next';
import { Organization, PrismaClient } from '@prisma/client';
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
  LinearProgress,
} from '@material-ui/core';
import Layout from 'components/Layout';
import TabShortResponse from 'components/registration/TabShortResponse';
import TabBasics from 'components/registration/TabBasics';
import TabProj from 'components/registration/TabProj';
import schema, { Form } from 'interfaces/registration';
import { useRouter } from 'next/router';
import useSession from 'utils/useSession';
import parseValidationError from 'utils/parseValidationError';
import { getSession } from 'next-auth/client';
import styles from '../styles/Registration.module.css';

const prisma = new PrismaClient();

type RegistrationProps = {
  org: Organization;
};

const Registration: React.FunctionComponent<RegistrationProps> = (org) => {
  const router = useRouter();
  const [session, sessionLoading] = useSession();
  const [selected, setSelected] = useState(0);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [saveDraft, setSaveDraft] = useState(true);
  const userOrg = org.org;

  const validate = (values: Form): FormikErrors<Form> => {
    const { error } = schema.validate(values, {
      abortEarly: false,
      context: {
        strict: !saveDraft,
      },
    });

    const msg = parseValidationError(error);

    return msg;
  };

  const handleChange = (
    _event: ChangeEvent<unknown>,
    newValue: number
  ): void => {
    setSelected(newValue);
  };

  const handleSubmit = async (values: Form): Promise<void> => {
    if (session && session.user.role === 'organization') {
      console.log('submitting', values);
      const {
        short1,
        short2,
        short3,
        proj1,
        proj2,
        proj3,
        ...tempValues
      } = values;
      const res = await fetch(`/api/app/orgs?submitting=${!saveDraft}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: session.user.email,
          ...tempValues,
        }),
      });

      if (res.ok) router.push('/users/settings');
      // TODO: Raise an error
    }
  };

  const initialValues: Form = {
    name: userOrg.name,
    contactName: userOrg.contactName,
    contactEmail: userOrg.contactEmail,
    contactPhone: userOrg.contactPhone,
    organizationType: userOrg.organizationType,
    workType: userOrg.workType,
    address: userOrg.address,
    missionStatement: userOrg.missionStatement,
    shortHistory: userOrg.shortHistory,
    lgbtqDemographic: userOrg.lgbtqDemographic,
    raceDemographic: userOrg.raceDemographic,
    ageDemographic: userOrg.ageDemographic,
    capacity: userOrg.capacity,
    ein: userOrg.ein,
    foundingDate: userOrg.foundingDate,
    is501c3: userOrg.is501c3,
    website: userOrg.website,
    short1: '',
    short2: '',
    short3: '',
    proj1: '',
    proj2: '',
    proj3: '',
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

  if (!sessionLoading && !session) router.push('/');
  if (!sessionLoading && session && session.user.role === 'organization')
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
              onClick={() => router.push('/users/settings')}
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
              <Button
                variant="contained"
                onClick={() => setExitDialogOpen(true)}
              >
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
  return <LinearProgress />;
};

export default Registration;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);
    const email = session?.user.email;
    console.log(session);
    const newUser = await prisma.user.findOne({
      where: {
        email,
      },
      select: {
        organization: true,
      },
    });
    const org = JSON.parse(JSON.stringify(newUser)).organization;
    return {
      props: { org },
    };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};
