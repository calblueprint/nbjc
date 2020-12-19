import { GetServerSideProps } from 'next';
import prisma from 'utils/prisma';
import { Organization, ApplicationQuestion } from '@prisma/client';
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
  LinearProgress,
  Typography,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
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

type RegistrationProps = {
  org: Organization | null;
  appQuestions: ApplicationQuestion[] | null;
};

const Registration: React.FunctionComponent<RegistrationProps> = ({
  org,
  appQuestions,
}) => {
  const router = useRouter();
  const [session, sessionLoading] = useSession();
  const [selected, setSelected] = useState(0);
  const [saveDraft, setSaveDraft] = useState(true);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(
    router.query?.feedback === 'true'
  );

  const status = org?.applicationStatus;
  const readOnly = status === 'submitted' || status === 'approved';

  const validate = (values: Form): FormikErrors<Form> => {
    const { error } = schema.validate(values, {
      abortEarly: false,
      context: {
        strict: !saveDraft,
      },
    });

    return parseValidationError(error);
  };
  console.log(appQuestions);

  const handleChange = (
    _event: ChangeEvent<unknown>,
    newValue: number
  ): void => {
    setSelected(newValue);
  };

  // const shortResponses =

  const handleSubmit = async (values: Form): Promise<void> => {
    if (session && session.user.role === 'organization') {
      console.log('submitting', values);
      const { proj1, proj2, proj3, ...tempValues } = values;

      try {
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

  // sample data begin
  /*
          id: true,
          placeholder: true,
          question: true,
          hint: true,
          required: true,
          wordLimit: true,
          */
  const appQ1 = {
    id: 1,
    placeholder: 'cindy',
    question: 'hi cindy',
    hint: 'yes',
    required: true,
    wordLimit: true,
  };
  const appQ2 = {
    id: 2,
    placeholder: 'bry',
    question: 'hi bry',
    hint: 'naw',
    required: false,
    wordLimit: 1,
  };
  const sample = [appQ1, appQ2];
  // sample data end

  let elem = 0;
  const responses = Array<string>();
  const ids = Array<number>();
  appQuestions?.forEach((q): void => {
    // change between sample (test) or appQuestions (real)
    responses[elem] = '';
    ids[elem] = q.id;
    elem += 1;
  });
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
    proj1: '',
    proj2: '',
    proj3: '',
    shortResponses: {
      id: ids,
      response: responses,
    },
  };

  const formik = useFormik({
    initialValues,
    validate,
    validateOnChange: false,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    async function submitForm(): Promise<void> {
      await formik.submitForm();
      setSaveDraft(true);
    }
    if (!saveDraft) {
      submitForm();
    }
  }, [saveDraft, formik]);

  if (!sessionLoading && !session) router.push('/');
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
          <Typography variant="h4">Registration Form</Typography>
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
                appQuestions={appQuestions} // change between sample (test) or appQuestions (real)
                readOnly={readOnly}
              />
            )}
          </div>
          <div className={styles.bottomButtons}>
            {!readOnly ? (
              <div>
                <Button
                  variant="outlined"
                  color="primary"
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
            ) : null}
            <div>
              <Button
                variant={readOnly ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => router.push('/users/profile')}
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
      const email = session?.user.email;
      const user = await prisma.user.findOne({
        where: {
          email,
        },
        select: {
          organization: true,
        },
      });
      // getting app questions
      const appQuestions = await prisma.applicationQuestion.findMany({
        select: {
          id: true,
          placeholder: true,
          question: true,
          hint: true,
          required: true,
          wordLimit: true,
        },
      });

      const org = JSON.parse(JSON.stringify(user)).organization;
      return {
        props: { org, appQuestions },
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
