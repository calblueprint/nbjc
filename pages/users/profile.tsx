import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import prisma from 'utils/prisma';
import Layout from 'components/Layout';
import {
  Button,
  TextField,
  Link,
  LinearProgress,
  CircularProgress,
  Divider,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import useSession from 'utils/useSession';
import ProgressStepper from 'components/user/ProgressStepper/index';
import { GetServerSideProps } from 'next';
import getSession from 'utils/getSession';
import { ApplicationStatus, Organization } from '@prisma/client';
import { FormikErrors, useFormik } from 'formik';
import { Prisma } from '@prisma/client';
import styles from '../../styles/users/Profile.module.css';
import {
  BasicInfoForm,
  BasicInfoSchema,
  OperationsForm,
  OperationsInfoSchema,
  GeneralTeamMember,
} from 'interfaces/profile';
import parseValidationError from 'utils/parseValidationError';
import ProfileBasics from 'components/profile/ProfileBasics';
import ProfileOperations from 'components/profile/ProfileOperations';

const orgArgs = Prisma.validator<Prisma.OrganizationArgs>()({
  select: {
    id: true,
    applicationStatus: true,
  },
});

type UserProfileProps = {
  org: Organization | null;
  team: GeneralTeamMember[];
};

const UserProfile: React.FC<UserProfileProps> = ({ org, team }) => {
  const router = useRouter();
  const [session, sessionLoading] = useSession();
  const [setting, setSetting] = useState(0);
  const [email, setEmail] = useState('');
  const [updateEmailLoading, setUpdateEmailLoading] = useState(false);
  const [infoSetting, setInfoSetting] = useState(false);
  const [operationsSetting, setOperationsSetting] = useState(false);
  const hiddenPassword = '******';
  // This is hardcoded for now, we believe that 7 team members is good enough for an org for now.
  const TEAM_MEMBERS_NUMBER = 7;

  useEffect(() => {
    if (session) {
      setEmail(session.user.email);
    }
  }, [session]);

  const updateEmail = async (): Promise<void> => {
    // FIXME: need to change useSession with custom Context API so that email is updated in session
    setUpdateEmailLoading(true);
    if (session?.user.email !== email) {
      try {
        const res = await fetch('/api/users/updateEmail', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ oldEmail: session?.user.email, email }),
        });
        if (res.ok) {
          console.log('successful!');
          setSetting(0);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setSetting(0);
    }

    setUpdateEmailLoading(false);
  };

  const emailButton = (): JSX.Element =>
    setting === 0 ? (
      <div className={styles.field}>
        <div>Email</div>
        <div className={styles.emailButton}>
          {email}
          <Button
            variant="outlined"
            color="primary"
            disableElevation
            onClick={() => setSetting(1)}
            className={styles.fieldButton}
          >
            Edit
          </Button>
        </div>
      </div>
    ) : (
      <div className={styles.field}>
        <div>Email</div>
        <div className={styles.fieldRight}>
          <TextField
            id="email"
            variant="outlined"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={styles.updateEmailButton}>
            <Button
              className={styles.fieldButton}
              variant="contained"
              color="primary"
              disableElevation
              onClick={() => updateEmail()}
              disabled={updateEmailLoading}
            >
              Save
            </Button>
            {updateEmailLoading && (
              <CircularProgress
                size={24}
                className={styles.updateEmailProgress}
              />
            )}
          </div>
        </div>
      </div>
    );

  const passwordButton = (
    <div className={styles.passwordButton}>
      <div className={styles.field}>
        <div>Password</div>
        <div className={styles.fieldRight}>
          {hiddenPassword}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push('/users/change-password')}
            disableElevation
            className={styles.fieldButton}
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );

  // FORMIK CODE

  const initialValues: BasicInfoForm = {
    address: (org && org.address) ?? '',
    website: (org && org.website) ?? '',
    ein: (org && org.ein) ?? '',
    foundingDate: (org && org.foundingDate) ?? null,
    contactEmail: (org && org.contactEmail) ?? '',
  };

  const handleValidate = (
    values: BasicInfoForm
  ): FormikErrors<BasicInfoForm> => {
    const { error } = BasicInfoSchema.validate(values, {
      abortEarly: false,
    });
    return { ...parseValidationError(error) };
  };

  /* 
  TODO - Update this handle submit to update organization info on backend
  TODO - There is already a migration for team members, and a "seen" attribute for orgs
  CALVIN LOOK HERE
  */
  const handleSubmit = async (values: BasicInfoForm): Promise<void> => {};

  const formik = useFormik<BasicInfoForm>({
    initialValues,
    validate: handleValidate,
    validateOnChange: false,
    onSubmit: handleSubmit,
  });

  const infoSection = (): JSX.Element => {
    return (
      <div>
        <div className={styles.accountSection}>
          <div className={styles.subTitle}>Basic Information</div>
          {infoSetting ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setInfoSetting(!infoSetting)}
              disableElevation
              disableRipple
              className={styles.fieldButton}
            >
              Save
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setInfoSetting(!infoSetting)}
              disableElevation
              disableRipple
              className={styles.fieldButton}
            >
              Edit
            </Button>
          )}
        </div>
        <ProfileBasics
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          values={formik.values}
          setFieldValue={formik.setFieldValue}
          touched={formik.touched}
          errors={formik.errors}
          editing={infoSetting}
        />
      </div>
    );
  };

  const fillMembers = (team: GeneralTeamMember[]) => {
    const pad = TEAM_MEMBERS_NUMBER - team.length;
    for (let i = 0; i < pad; i++) {
      team.push({
        name: '',
        title: '',
      });
    }
    return team;
  };

  const initialMembers: OperationsForm = {
    teamMembers: fillMembers(team),
  };

  const handleOpValidate = (
    values: OperationsForm
  ): FormikErrors<OperationsForm> => {
    const { error } = OperationsInfoSchema.validate(values, {
      abortEarly: false,
    });
    return { ...parseValidationError(error) };
  };

  const handleOpSubmit = async (values: OperationsForm): Promise<void> => {
    console.log('mem values', values);
    try {
      await fetch('api/orgs/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamMembers: values,
          orgId: org?.id,
        }),
      });
    } catch (ex) {
      console.log('error');
    }
  };

  // formikOp to be used with fields relating to organization members
  const formikOp = useFormik({
    initialValues: initialMembers,
    validateOnChange: false,
    onSubmit: handleOpSubmit,
  });

  // TODO update onClick functions to handle submissions, make updates on the backend
  const operationsSection = (): JSX.Element => {
    return (
      <div>
        <div className={styles.accountSection}>
          <div className={styles.subTitle}>Operations</div>
          {operationsSetting ? (
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleOpSubmit(formikOp.values);
                  setOperationsSetting(!operationsSetting);
                }}
                disableElevation
                disableRipple
                className={styles.fieldButton}
              >
                Save
              </Button>
            </div>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOperationsSetting(!operationsSetting)}
              disableElevation
              disableRipple
              className={styles.fieldButton}
            >
              Edit
            </Button>
          )}
        </div>
        <ProfileOperations
          handleChange={formikOp.handleChange}
          handleBlur={formikOp.handleBlur}
          values={formikOp.values}
          setFieldValue={formikOp.setFieldValue}
          touched={formikOp.touched}
          errors={formikOp.errors}
          editing={operationsSetting}
        />
      </div>
    );
  };

  const accountSettings = () => (
    <div className={styles.top}>
      <div className={styles.title}>
        <div className={styles.caps}>{session?.user.role} Settings</div>
      </div>
      <div className={styles.accountSection}>
        <div className={styles.subTitle}>Account</div>
      </div>
      {emailButton()}
      {passwordButton}

      <div className={styles.delete}>
        <Link>Delete User Account</Link>
      </div>
    </div>
  );

  if (!sessionLoading && !session) router.push('/');
  if (!sessionLoading && session)
    return (
      <Layout title="User Profile Settings">
        <div className={styles.content}>
          <div className={styles.box}>
            {/* Removed check if the session user role was an org or not, does this break? */}
            {org?.applicationStatus === 'approved' ? (
              <>
                <ProgressStepper
                  applicationStatus={org?.applicationStatus}
                  orgId={org?.id}
                />
                <Divider style={{ marginTop: '20px' }} />
                {accountSettings()}
                <div>
                  <Divider />
                  <div className={styles.top}>{infoSection()}</div>
                  <Divider />
                  <div className={styles.top}>{operationsSection()}</div>
                </div>
              </>
            ) : (
              <>
                {accountSettings()}
                <Divider />
                <ProgressStepper
                  applicationStatus={org?.applicationStatus}
                  orgId={org?.id}
                />
              </>
            )}
          </div>
        </div>
      </Layout>
    );
  return <LinearProgress />;
};

export default UserProfile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);
    if (session) {
      const org = await prisma.organization.findUnique({
        where: {
          userId: session.user.id,
        },
      });
      const team = await prisma.orgTeamMember.findMany({
        where: {
          organizationId: org?.id,
        },
      });
      return {
        props: { org, team },
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
