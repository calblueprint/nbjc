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
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import useSession from 'utils/useSession';
import ProgressStepper from 'components/user/ProgressStepper/index';
import { GetServerSideProps } from 'next';
import getSession from 'utils/getSession';
import { ApplicationStatus, OrgTeamMembers, Organization } from '@prisma/client';
import { FormikErrors, useFormik } from 'formik';
import { Prisma } from '@prisma/client';
import styles from '../../styles/users/Profile.module.css';
import {
  BasicInfoForm,
  BasicInfoSchema,
  OperationsForm,
  OperationsInfoSchema
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
  team: OrgTeamMembers[]
};

const UserProfile: React.FC<UserProfileProps> = ({ org, team }) => {
  const router = useRouter();
  const [session, sessionLoading] = useSession();
  const [setting, setSetting] = useState(0);
  const [email, setEmail] = useState('');
  const [updateEmailLoading, setUpdateEmailLoading] = useState(false);
  const [infoSetting, setInfoSetting ] = useState(false);
  const [operationsSetting, setOperationsSetting ] = useState(false);
  const hiddenPassword = '******';
  
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

  const initialValues : BasicInfoForm = {
    address: (org && org.address) ?? '',
    website: (org && org.website) ?? '',
    ein: (org && org.ein) ?? '',
    foundingDate: (org && org.foundingDate) ?? null,
    contactEmail: (org && org.contactEmail) ?? '',
  };

  const handleValidate = (values: BasicInfoForm) : FormikErrors<BasicInfoForm> => {
    const { error } = BasicInfoSchema.validate(values, {
        abortEarly: false,   
    });
    return {... parseValidationError(error)};
  };

  /* 
  TODO - Update this handle submit to update organization info on backend
  TODO - There is already a migration for team members, and a "seen" attribute for orgs
  */
  const handleSubmit = async(
    values: BasicInfoForm
  ) : Promise<void> => {
    
  }

  const formik = useFormik<BasicInfoForm>({
    initialValues,
    validate: handleValidate,
    validateOnChange: false,
    onSubmit: handleSubmit,
  });

  const infoSection = () : JSX.Element => {
    return(
      <div>
      <div className={styles.accountSection}>
        <div className={styles.subTitle}>Basic Information</div>
        {infoSetting?  
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
          : 
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
        }
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
    )
  };

  const initialMembers : OperationsForm = {
    memberName1: team.length >= 1 ? team[0].name : '',
    memberTitle1: team.length >= 1 ? team[0].title : '',
    memberName2: team.length >= 2 ? team[1].name : '',
    memberTitle2: team.length >= 2 ? team[1].title : '',
    memberName3: team.length >= 3 ? team[2].name : '',
    memberTitle3: team.length >= 3 ? team[2].title : '',
    memberName4: team.length >= 4 ? team[3].name : '',
    memberTitle4: team.length >= 4 ? team[3].title : '',
    memberName5: team.length === 5 ? team[4].name : '',
    memberTitle5: team.length === 5 ? team[4].title : '',   
  };

  const handleOpValidate = (values: OperationsForm) : FormikErrors<OperationsForm> => {
    const { error } =  OperationsInfoSchema.validate(values, {
        abortEarly: false,   
    });
    return {... parseValidationError(error)};
  };

  const handleOpSubmit = async(
    values: BasicInfoForm
  ) : Promise<void> => {
    
  }

  // formikOp to be used with fields relating to organization members
  const formikOp = useFormik({
    initialValues: initialMembers,
    validateOnChange: false,
    onSubmit: () => {},
  })

  // TODO update onClick functions to handle submissions, make updates on the backend
  const operationsSection = () : JSX.Element => {
    return(
    <div>
      <div className={styles.accountSection}>
        <div className={styles.subTitle}>Operations</div>
        {
          operationsSetting ?
          <div>
            <Button
            variant="contained"
            color="primary"
            onClick={() => setOperationsSetting(!operationsSetting)}
            disableElevation
            disableRipple
            className={styles.fieldButton}
            >
            Save
            </Button>
          </div>:
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
        }
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
    </div>)
  };

  if (!sessionLoading && !session) router.push('/');
  if (!sessionLoading && session)
    return (
      <Layout title="User Profile Settings">
        <div className={styles.content}>
          <div className={styles.box}>
            {session.user.role === 'organization' && (
                <ProgressStepper
                  applicationStatus={org?.applicationStatus}
                  orgId={org?.id}
                />
            )}
            <div className={styles.top}>
              <div className={styles.title}>
                <div className={styles.caps}>{session.user.role} Settings</div>
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
            
            {session.user.role === 'organization' && (
            <div>
              <div className={styles.top}>
                  {infoSection()}
              </div>
              <div className={styles.top}>
                  {operationsSection()}
              </div>
            </div>
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
      const team = await prisma.orgTeamMembers.findMany({
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
