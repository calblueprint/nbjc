import { GetServerSideProps } from 'next';
import prisma from 'utils/prisma';
import { Organization } from '@prisma/client';
import { FormikErrors, useFormik } from 'formik';
import { useState, ChangeEvent } from 'react';
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
import styles from '../styles/Registration.module.css';

type RegistrationProps = {
  org: Organization | null;
  appQnR: AppQnR;
};

const Registration: React.FunctionComponent<RegistrationProps> = ({
  org,
  appQnR,
}) => {
  const router = useRouter();
  const [session, sessionLoading] = useSession();
  const [selected, setSelected] = useState(0);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(
    router.query?.feedback === 'true'
  );

  const status = org?.applicationStatus;
  const readOnly = status === 'submitted' || status === 'approved';

  const handleValidate = (draft: boolean) => (
    values: Form
  ): FormikErrors<Form> => {
    const { qnr, ...rest } = values;
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

  const handleChange = (
    _event: ChangeEvent<unknown>,
    newValue: number
  ): void => {
    setSelected(newValue);
  };

  const handleSubmit = (draft: boolean) => async (
    values: Form
  ): Promise<void> => {
    if (session && session.user.role === 'organization') {
      if (draft && Object.keys(handleValidate(true)(values)).length !== 0)
        return;
      console.log('submitting', values);
      const { proj1, proj2, proj3, ...tempValues } = values;

      try {
        const res = await fetch(`/api/app/orgs?submitting=${!draft}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session.user.id,
            ...tempValues,
          }),
        });

        if (res.ok && !draft) router.push('/users/profile');
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
    proj1: '',
    proj2: '',
    proj3: '',
    qnr:
      appQnR?.map((q) => ({
        questionId: q.id,
        response: q.applicationResponses[0]?.answer ?? '',
      })) ?? [],
  };

  const formik = useFormik({
    initialValues,
    validate: handleValidate(false),
    validateOnChange: false,
    onSubmit: handleSubmit(false),
  });

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
                  color="primary"
                  className={styles.autoField}
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
      const organization = await prisma.organization.findUnique({
        where: {
          userId: session.user.id,
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
