import { useState } from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router';
import styles from './ProgressStepper.module.css';

export default function ProgressMobileStepper(): React.ReactElement {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    router.push('/registration');
  };

  function stepText(text: string, step: number): React.ReactElement {
    if (activeStep === step) {
      return <div className={styles.current}>{text}</div>;
    }
    if (activeStep < step) {
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
      <div className={styles.stepper}>
        <MobileStepper
          variant="progress"
          steps={5}
          position="static"
          activeStep={activeStep}
          nextButton={undefined}
          backButton={undefined}
          classes={{
            progress: styles.progress,
          }}
        />
      </div>
      <div className={styles.wording}>
        Verify email address to begin application.
      </div>
      <div className={styles.button}>
        <Button variant="contained" color="primary" onClick={handleNext}>
          Edit Application
        </Button>
      </div>
    </div>
  );
}
