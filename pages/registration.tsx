import { GetServerSideProps } from 'next';
import {
  Organization,
  PrismaClient,
  OrganizationGetPayload,
} from '@prisma/client';
import {
  Formik,
  FormikErrors,
  useFormik,
  FormikValues,
  FormikHelpers,
} from 'formik';
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
import getSession from 'utils/getSession';
import styles from '../styles/Registration.module.css';

const prisma = new PrismaClient();

type RegistrationProps = {
  org: OrganizationGetPayload<{
    include: { organizationProjects: true };
  }> | null;
};

const Registration: React.FunctionComponent<RegistrationProps> = ({ org }) => {
  const router = useRouter();
  const [session, sessionLoading] = useSession();
  const [selected, setSelected] = useState(0);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [saveDraft, setSaveDraft] = useState(false);

  const status = org?.applicationStatus;
  // if (status && status !== 'draft') {
  //   router.back();
  // }

  const validate = (values: FormikValues): FormikErrors<Form> => {
    const formValues = values as Form;
    const { error } = schema.validate(formValues, {
      abortEarly: false,
      context: {
        strict: !saveDraft,
      },
    });
    // console.log('validate');
    // console.log(parseValidationError(error));

    return parseValidationError(error);
  };

  const tabChange = (_event: ChangeEvent<unknown>, newValue: number): void => {
    setSelected(newValue);
  };

  const handleSubmit = async (values: Form): Promise<void> => {
    if (session && session.user.role === 'organization') {
      const { short1, short2, short3, projects, ...tempValues } = values;
      // set to hold all current projects in front-end
      const currStateProjSet = new Set();
      // IDs of projects from original serverSideProps get request
      const originalIDs = org?.organizationProjects?.map((o) => o.id) ?? [];
      // will hold the IDs of the projects to delete
      const projIDsToDelete = [];
      let ind = 0;
      for (let i = 0; i < projects.length; i += 1) {
        currStateProjSet.add(projects[i].id);
      }
      for (let i = 0; i < originalIDs.length; i += 1) {
        if (!currStateProjSet.has(originalIDs[i])) {
          projIDsToDelete[ind] = originalIDs[i];
          ind += 1;
        }
      }
      try {
        const res = await fetch(`/api/app/orgs?submitting=${!saveDraft}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail: session.user.email,
            ...tempValues,
            projects,
            projIDsToDelete,
          }),
        });

        if (res.ok && !saveDraft) router.push('/users/settings');
        if (!res.ok) {
          console.log('patch not successful');
        }
      } catch (err) {
        // TODO: Raise an error toast
        console.log(err);
      }
    }
  };
  const initialValues: Form = {
    name: (org && org.name) ?? '',
    contactName: (org && org.contactName) ?? '',
    contactEmail: (org && org.contactEmail) ?? '',
    contactPhone: (org && org.contactPhone) ?? '',
    organizationType: (org && org.organizationType) ?? '',
    workType: (org && org.workType) ?? '',
    address: (org && org.address) ?? '',
    missionStatement: (org && org.missionStatement) ?? '',
    shortHistory: (org && org.shortHistory) ?? '',
    lgbtqDemographic: org ? org.lgbtqDemographic : [],
    raceDemographic: org ? org.raceDemographic : [],
    ageDemographic: org ? org.ageDemographic : [],
    // capacity: undefined,
    ein: (org && org.ein) ?? '',
    // foundingDate: undefined,
    is501c3: Boolean(org && org.is501c3),
    website: (org && org.website) ?? '',
    short1: '',
    short2: '',
    short3: '',
    projects:
      org?.organizationProjects?.map((o) => ({
        id: o.id ?? null,
        title: o.title,
        description: o.description ?? '',
      })) ?? [],
  };

  const addNewProj = (
    values: Form,
    setFieldValue: FormikHelpers<string>['setFieldValue']
  ): void => {
    const currProjs = values.projects;
    currProjs.push({ title: '', description: '' });
    setFieldValue('projects', currProjs);
  };

  const deleteProj = (
    values: Form,
    setFieldValue: FormikHelpers<string>['setFieldValue'],
    index: number
  ): void => {
    const currProjs = values.projects;
    currProjs.splice(index, 1);
    setFieldValue('projects', currProjs);
  };

  // useEffect(() => {
  //   async function submitForm(): Promise<void> {
  //     await formik.submitForm();
  //     setSaveDraft(true);
  //   }
  //   if (!saveDraft) {
  //     submitForm();
  //   }
  // }, [saveDraft, formik]);

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
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
          render={({
            handleChange,
            handleBlur,
            setFieldValue,
            values,
            touched,
            errors,
          }): React.ReactNode => {
            // console.log(errors);
            const formValues = values as Form;
            return (
              <>
                <div className={styles.root}>
                  <AppBar
                    position="static"
                    color="default"
                    className={styles.appBar}
                  >
                    <Tabs value={selected} onChange={tabChange}>
                      <Tab label="Basics" />
                      <Tab label="Projects and Events" />
                      <Tab label="Short Response" />
                    </Tabs>
                  </AppBar>
                  {selected === 0 && (
                    <TabBasics
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      values={formValues}
                      setFieldValue={setFieldValue}
                      touched={touched}
                      errors={errors}
                    />
                  )}
                  {selected === 1 && (
                    <TabProj
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      values={formValues}
                      setFieldValue={setFieldValue}
                      touched={touched}
                      errors={errors}
                      addNewProj={addNewProj}
                      deleteProj={deleteProj}
                    />
                  )}
                  {selected === 2 && (
                    <TabShortResponse
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      values={formValues}
                      setFieldValue={setFieldValue}
                      touched={touched}
                      errors={errors}
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
                      onClick={() => setSaveDraft(false)}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="contained"
                      className={styles.autoField}
                      color="primary"
                      onClick={() => handleSubmit(formValues)}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </>
            );
          }}
        />
      </Layout>
    );
  return <LinearProgress />;
};

export default Registration;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);
    if (session && session.user.role === 'organization') {
      const email = session?.user.email;
      // Temp solution until merged with main
      const user = await prisma.user.findOne({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

      const org = await prisma.organization.findOne({
        where: {
          userId: user?.id,
        },
        include: {
          organizationProjects: true,
        },
      });

      const parsedOrg = JSON.parse(JSON.stringify(org));
      console.log(parsedOrg, 'printing in serversideprops');
      return {
        props: { org: parsedOrg },
      };
    }
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  } catch (err) {
    console.log('error');
    return { props: { errors: err.message } };
  }
};
