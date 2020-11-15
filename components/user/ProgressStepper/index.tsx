import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import styles from './ProgressStepper.module.css';

function getSteps(): Array<string> {
  return ['Not Started', 'In Progress', 'Submitted', 'Results'];
}

const ProgressStepper: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext: void = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  return (
    <div className={styles.content}>
      <div className={styles.title}>Application Status </div>
      <div className={styles.stepper}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
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
};

export default ProgressStepper;
