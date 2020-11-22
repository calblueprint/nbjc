import { useState } from 'react';
import { Button, ButtonGroup, Chip } from '@material-ui/core';
import styles from '../styles/Tab.module.css';

type TabProps = {
  buttonName1: string;
  buttonName2: string;
  buttonName3?: string;
  buttonSetState1: () => void;
  buttonSetState2: () => void;
  buttonSetState3?: () => void;
};

const showInfo = true;

const Tab: React.FunctionComponent<TabProps> = ({
  buttonName1,
  buttonName2,
  buttonName3,
  buttonSetState1,
  buttonSetState2,
  buttonSetState3,
}) => {
  const [showB1, setB1] = useState<boolean>(true);
  const [showB2, setB2] = useState<boolean>(false);
  const [showB3, setB3] = useState<boolean>(false);
  const handleB1Click = (): void => {
    setB1(true);
    setB2(false);
    setB3(false);
    buttonSetState1();
  };
  const handleB2Click = (): void => {
    setB2(true);
    setB1(false);
    setB3(false);
    buttonSetState2();
  };
  const handleB3Click = (): void => {
    setB3(true);
    setB2(false);
    setB1(false);
    buttonSetState3();
  };

  return (
    <ButtonGroup
      variant="contained"
      color="primary"
      className={styles.buttonGroup}
    >
      <Button
        className={showB1 ? styles.buttonIndSelected : styles.buttonInd}
        onClick={handleB1Click}
        disableElevation
      >
        {buttonName1}
      </Button>
      <Button
        className={showB2 ? styles.buttonIndSelected : styles.buttonInd}
        onClick={handleB2Click}
        disableElevation
      >
        {buttonName2}
      </Button>
      {buttonName3 ? (
        <Button
          className={showB3 ? styles.buttonIndSelected : styles.buttonInd}
          onClick={handleB3Click}
          disableElevation
        >
          {buttonName3}
        </Button>
      ) : null}
    </ButtonGroup>
  );
};

export default Tab;
