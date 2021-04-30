import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router';
import { ApplicationStatus } from '@prisma/client';
import { Typography } from '@material-ui/core';
import styles from './ProgressStepper.module.css';

type ProgressStepperProps = {
  applicationStatus?: ApplicationStatus;
  orgId?: number;
};

const ProgressStepper: React.FC<ProgressStepperProps> = ({
  applicationStatus,
  orgId,
}) => {
  const router = useRouter();
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
          Verify email address to begin application.
        </div>
        <div className={styles.button}>
          <Button
            variant="contained"
            color="primary"
            onClick={goToRegistration()}
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

  function helperText(stage: number): React.ReactElement {
    if (stage === 1) {
      return (
        <Typography>
          Start your application to begin the registration process.
        </Typography>
      );
    }
    if (stage === 2) {
      return (
        <Typography>
          To complete the registration process and become a listed organization
          on [NETWORK NAME], please submit the application form and wait to be
          notified for the results.
        </Typography>
      );
    }
    if (stage === 3) {
      return (
        <Typography>
          Your application has been submitted! You will receive an email
          notification when the result has been decided, and you can also come
          back here to check the status of your application.
        </Typography>
      );
    }
    return (
      <Typography>
        Your organization has been accepted to join [Network Name]! Your
        organization’s profile is partly auto-filled with answers from your
        application, but complete your profile with more details!
      </Typography>
    );
  }

  return (
    <div className={styles.content}>
      <div className={styles.title}>Application Status </div>
      <div className={styles.helper}>{helperText(status)}</div>

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
