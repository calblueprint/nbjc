import { GetServerSideProps } from 'next';
import { Organization, PrismaClient, Prisma } from '@prisma/client';
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
  LinearProgress,
  Typography,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Layout from 'components/Layout';
import TabShortResponse from 'components/registration/TabShortResponse';
import TabBasics from 'components/registration/TabBasics';
import TabProj from 'components/registration/TabProj';
import schema, { AppQnR, Form } from 'interfaces/registration';
import { useRouter } from 'next/router';
import useSession from 'utils/useSession';
import parseValidationError from 'utils/parseValidationError';
import getSession from 'utils/getSession';
import Joi from 'joi';
import prisma from 'utils/prisma';
import styles from '../styles/Registration.module.css';

type RegistrationProps = {
  propOrg: Prisma.OrganizationGetPayload<{
    include: { organizationProjects: true };
  }> | null;
  appQnR: AppQnR;
};

const Registration: React.FunctionComponent<RegistrationProps> = ({
  propOrg,
  appQnR,
}) => {
  const router = useRouter();
  const [session, sessionLoading] = useSession();
  const [selected, setSelected] = useState(0);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [saveDraft, setSaveDraft] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(
    router.query?.feedback === 'true'
  );
  const [org, setOrg] = useState(propOrg);

  useEffect(() => {
    if (!org) {
      console.log('wait');
    }
  }, [org]);

  const status = org?.applicationStatus;
  const readOnly = status === 'submitted' || status === 'approved';

  const exiting = (): void => {
    setExitDialogOpen(true);
    router.push('/users/profile');
  };

  const handleValidate = (draft: boolean) => (
    values: FormikValues
  ): FormikErrors<Form> => {
    const { qnr, ...rest } = values as Form;
    const { error } = schema.validate(rest, {
      abortEarly: false,
      context: {
        strict: !draft,
      },
    });
    // console.log('validate');
    // console.log(parseValidationError(error));

    // Validate custom short response questions
    let qnrValidateEmpty = true;
    const qnrValidate: string[] = qnr.map(({ response: value }, i) => {
      if (!draft && appQnR && appQnR[i].required) {
        const response = Joi.string()
          .messages({ 'string.empty': 'This prompt is required.' })
          .validate(value).error?.message;
        if (qnrValidateEmpty && response) qnrValidateEmpty = false;
        return response ?? '';
      }

      const response = Joi.string().empty('').validate(value).error?.message;
      if (qnrValidateEmpty && response) qnrValidateEmpty = false;
      return response ?? '';
    });

    if (!qnrValidateEmpty)
      return {
        ...parseValidationError(error),
        qnr: qnrValidate,
      };
    return { ...parseValidationError(error) };
  };

  const tabChange = (_event: ChangeEvent<unknown>, newValue: number): void => {
    setSelected(newValue);
  };

  const handleSubmit = (draft: boolean) => async (
    values: Form
  ): Promise<void> => {
    if (session && session.user.role === 'organization') {
      if (draft && Object.keys(handleValidate(true)(values)).length !== 0)
        return;
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
        console.log('currstate', currStateProjSet);
        console.log('origIDs', originalIDs);
        if (!currStateProjSet.has(originalIDs[i])) {
          projIDsToDelete[ind] = originalIDs[i];
          ind += 1;
        }
      }
      try {
        const res = await fetch(`/api/app/orgs?submitting=${!draft}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session.user.id,
            ...tempValues,
            projects,
            projIDsToDelete,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('newProjs', data);
            // Replace current formValues projects with created projects from back-end w/ ids.
            for (let i = 0; i < data.createdProjs.length; i++) {
              let foundIndex = formik.values.projects.findIndex(
                (newProj) =>
                  newProj.description === data.createdProjs[i].description &&
                  newProj.title === data.createdProjs[i].title
              );
              if (foundIndex >= 0) formik.values.projects[foundIndex] = data[i];
              console.log(formik.values.projects);
            }
            setOrg(data.newOrg);
            // formValues.projects.push.apply(formValues.projects, data);
            // Temp solution to fix the multiple save changes clicking issue making multiple objects in DB.

            // REMOVE WHEN READY TO DEBUG PROPERLY //
            router.push('/registration');
          })
          .catch((err) => console.log('patch not successful'));
        // if (res.ok && !draft) router.push('/users/profile');
      } catch (err) {
        // TODO: Raise an error toast
        console.log(err);
      }
    }
  };
  const formValues: Form = {
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
    qnr:
      appQnR?.map((q) => ({
        questionId: q.id,
        response: q.applicationResponses[0]?.answer ?? '',
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

  const formik = useFormik({
    initialValues: formValues,
    validate: handleValidate(false),
    validateOnChange: false,
    onSubmit: handleSubmit(false),
  });

  console.log('these are formik.values', formik.values);
  console.log('formik proj values', formik.values.projects);

  if (!sessionLoading && (!session || session.user.role !== 'organization'))
    router.push('/');
  if (!sessionLoading && session && session.user.role === 'organization' && org)
    return (
      <Layout title="Register">
        {status === 'rejected' ? (
          <Dialog
            open={feedbackDialogOpen}
            onClose={() => setFeedbackDialogOpen(false)}
          >
            <DialogTitle disableTypography className={styles.feedbackHeader}>
              <Typography variant="h6">Reason For Declining</Typography>
              <IconButton
                aria-label="close"
                onClick={() => setFeedbackDialogOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              This is where the feedback text will go asd sda fa sdf asd fas df
              asdf asd fas df asd fas df asdf asd fas df asdf as dfas dfs adf
            </DialogContent>
          </Dialog>
        ) : null}
        <div className={styles.header}>
          <Typography variant="h4">Registration Form</Typography>
          <h1 className={styles.header}>Registration Form</h1>
          {status === 'rejected' ? (
            <Button
              variant="outlined"
              onClick={() => setFeedbackDialogOpen(true)}
            >
              View Feedback
            </Button>
          ) : null}
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.root}>
            <AppBar position="static" color="default" className={styles.appBar}>
              <Tabs value={selected} onChange={tabChange}>
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
                readOnly={readOnly}
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
                addNewProj={addNewProj}
                deleteProj={deleteProj}
                readOnly={readOnly}
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
                appQnR={appQnR}
                readOnly={readOnly}
              />
            )}
          </div>
          <div className={styles.bottomButtons}>
            {!readOnly ? (
              <div>
                <Button
                  variant="outlined"
                  className={styles.autoField}
                  type="submit"
                  onClick={() => handleSubmit(true)(formik.values)}
                >
                  Save Changes
                </Button>
                <Button
                  variant="contained"
                  className={styles.autoField}
                  color="primary"
                  type="submit"
                  onClick={() => handleSubmit(false)(formik.values)}
                >
                  Submit
                </Button>
              </div>
            ) : null}
            <div>
              <Button
                variant={readOnly ? 'contained' : 'outlined'}
                onClick={() => exiting()}
              >
                Exit
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
    if (session && session.user.role === 'organization') {
      const organization = await prisma.organization.findUnique({
        where: {
          userId: session.user.id,
        },
        include: {
          organizationProjects: true,
        },
      });
      // getting app questions
      const appQnR = await prisma.applicationQuestion.findMany({
        select: {
          id: true,
          placeholder: true,
          question: true,
          hint: true,
          required: true,
          wordLimit: true,
          applicationResponses: {
            where: {
              organizationId: organization?.id ?? -1,
            },
            select: {
              answer: true,
            },
          },
        },
      });

      const org = JSON.parse(JSON.stringify(organization));
      return {
        props: { propOrg: org, appQnR },
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
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
};
