import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router';
import { ApplicationStatus } from '@prisma/client';
import styles from './ProgressStepper.module.css';
import { useEffect, useState } from 'react';
import useSession from 'utils/useSession';

type ProgressStepperProps = {
  applicationStatus?: ApplicationStatus;
  orgId?: number;
};

const ProgressStepper: React.FC<ProgressStepperProps> = ({
  applicationStatus,
  orgId,
}) => {
  const router = useRouter();
  const [emailVerified, setVerified] = useState(false);
  const [session, sessionLoading] = useSession();
  let status: number;
  switch (applicationStatus) {
    case 'approved': {
      status = 4;
      break;
    }
    case 'rejected': {
      status = 4;
      break;
    }
    case 'submitted': {
      status = 3;
      break;
    }
    case 'draft': {
      status = 2;
      break;
    }
    default: {
      status = 1;
      break;
    }
  }


  const goToRegistration = (feedback?: boolean) => (): void => {
    router.push(`/registration${feedback ? '?feedback=true' : ''}`);
  };


  useEffect(() : void => {
    const checkVerification = async() => {
      const res = await fetch(`/api/users/${session?.user.id}`, {
        method: "GET"
      });
      if (res.ok) {
        const user = await res.json();
        setVerified(Boolean(user.emailVerified));
      }
    }
    checkVerification();
  }, [session]);

  const appAction = (): JSX.Element | null => {
    if (applicationStatus === 'draft') {
      return (
        <div className={styles.button}>
          <Button
            variant="contained"
            color="primary"
            onClick={goToRegistration()}
          >
            Edit Application
          </Button>
        </div>
      );
    }
    if (applicationStatus === 'submitted') {
      return (
        <div className={styles.button}>
          <Button
            variant="contained"
            color="primary"
            onClick={goToRegistration()}
          >
            View Application
          </Button>
        </div>
      );
    }
    if (applicationStatus === 'rejected') {
      return (
        <>
          <div className={styles.wording}>
            We are sorry to inform you that your application has not been
            approved this time. However, we encourage you to edit your
            application after viewing the comments given by NBJC staff and
            resubmit again! We look forward to reviewing your edited
            application!
          </div>
          <div className={`${styles.button} ${styles.twoButtons}`}>
            <Button
              variant="contained"
              color="primary"
              onClick={goToRegistration(true)}
            >
              View Feedback
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={goToRegistration()}
            >
              Edit Application
            </Button>
          </div>
        </>
      );
    }
    if (applicationStatus === 'approved') {
      return (
        <>
          <div className={styles.wording}>
            Your organization has been accepted to join [Network Name]! Your
            organization’s profile is partly auto-filled with answers from your
            application, but complete your profile with more details!
          </div>
          <div className={`${styles.button} ${styles.twoButtons}`}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push(`/orgs/${orgId ?? ''}`)}
            >
              View Profile
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={goToRegistration()}
            >
              View Application
            </Button>
          </div>
        </>
      );
    }
    return (
      <>
        <div className={`${styles.wording} ${styles.verifyMessage}`}>
          {emailVerified? '' : 'Verify email address to begin application.'}
        </div>
        <div className={styles.button}>
          <Button
            variant="contained"
            color="primary"
            onClick={goToRegistration()}
            disabled={!emailVerified}
          >
            Begin Application
          </Button>
        </div>
      </>
    );
  };

  function stepText(text: string, step: number): React.ReactElement {
    if (status === step) {
      return <div className={styles.current}>{text}</div>;
    }
    if (status < step) {
      return <div className={styles.untouched}>{text}</div>;
    }
    return <div className={styles.complete}>{text}</div>;
  }

  return (
    <div className={styles.content}>
      <div className={styles.title}>Application Status </div>
      <div className={styles.steps}>
        {stepText('Not Started', 1)}
        {stepText('In Progress', 2)}
        {stepText('Submitted', 3)}
        {stepText('Results', 4)}
      </div>
      <div>
        <MobileStepper
          variant="progress"
          steps={5}
          position="static"
          activeStep={status}
          nextButton={undefined}
          backButton={undefined}
          classes={{
            progress: styles.progress,
          }}
        />
      </div>
      {appAction()}
    </div>
  );
};

export default ProgressStepper;