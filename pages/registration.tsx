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
import schema, { AppQnR, appQnRArgs, Form } from 'interfaces/registration';
import { useRouter } from 'next/router';
import useSession from 'utils/useSession';
import parseValidationError from 'utils/parseValidationError';
import getSession from 'utils/getSession';
import Joi from 'joi';
import prisma from 'utils/prisma';
import Tab from 'components/Tab';
import styles from '../styles/Registration.module.css';

type RegistrationProps = {
  org: Prisma.OrganizationGetPayload<{
    include: { organizationProjects: true };
  }> | null;
  appQnR: AppQnR;
};

const Registration: React.FunctionComponent<RegistrationProps> = ({
  org,
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

  const [tabState, setTabState] = useState<0 | 1 | 2>(0);

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
      console.log(values);
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
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            // Linter ignored because formik is reference before it is defined.
            // eslint-disable-next-line no-use-before-define
            formik.setFieldValue('projects', data.newOrg.organizationProjects);
            if (!draft) {
              router.push('/users/profile');
            }
          })
          .catch((err) => console.log('patch not successful'));
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
    foundingDate: undefined,
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

  function helperText(): React.ReactElement {
    return <Typography>last saved at</Typography>;
    const timer = setTimeout(() => {
      return <Typography />;
    }, 5000);
  }

  if (!sessionLoading && (!session || session.user.role !== 'organization'))
    router.push('/');
  if (!sessionLoading && session && session.user.role === 'organization')
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
          <Typography variant="h4">Application</Typography>
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
          <div className={styles.info}>
            <div className={styles.root}>
              <div className={styles.headerButton}>
                <Tab
                  tabName1="Basics"
                  tabName2="Project and Events"
                  tabName3="Short Response"
                  tabState={tabState}
                  setTabState={setTabState}
                />
              </div>
              <div className={styles.tabinfo}>
                {tabState === 0 && (
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
                {tabState === 1 && (
                  <TabProj
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    values={formik.values}
                    setFieldValue={formik.setFieldValue}
                    touched={formik.touched}
                    errors={formik.errors}
                    readOnly={readOnly}
                    addNewProj={addNewProj}
                    deleteProj={deleteProj}
                  />
                )}
                {tabState === 2 && (
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
            </div>
            <div className={styles.bottomButtons}>
              {!readOnly ? (
                <div className={styles.rightBottom}>
                  {/* <Typography className={styles.popup}>saved changes at</Typography> */}
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={styles.autoField}
                    onClick={() => handleSubmit(true)(formik.values)}
                    // onclick={helperText()}
                  >
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
              ) : null}
              <div className={styles.exitButton}>
                <Button
                  variant={readOnly ? 'contained' : 'outlined'}
                  color="secondary"
                  onClick={() => router.push('/users/profile')}
                >
                  Exit
                </Button>
              </div>
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
        select: appQnRArgs(organization?.id).select,
      });

      const org = JSON.parse(JSON.stringify(organization));
      return {
        props: { org, appQnR },
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
