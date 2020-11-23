import { Dispatch, SetStateAction } from 'react';
import { Button, ButtonGroup } from '@material-ui/core';
import styles from '../styles/Tab.module.css';

type TabProps = {
  tabName1: string;
  tabName2: string;
  tabName3?: string;
  tabState: 0 | 1 | 2;
  setTabState: Dispatch<SetStateAction<0 | 1 | 2>>;
};

const Tab: React.FunctionComponent<TabProps> = ({
  tabName1,
  tabName2,
  tabName3,
  tabState,
  setTabState,
}) => (
  <ButtonGroup
    variant="contained"
    color="primary"
    className={styles.buttonGroup}
  >
    <Button
      className={tabState === 0 ? styles.buttonIndSelected : styles.buttonInd}
      onClick={() => setTabState(0)}
      disableElevation
    >
      {tabName1}
    </Button>
    <Button
      className={tabState === 1 ? styles.buttonIndSelected : styles.buttonInd}
      onClick={() => setTabState(1)}
      disableElevation
    >
      {tabName2}
    </Button>
    {tabName3 ? (
      <Button
        className={tabState === 2 ? styles.buttonIndSelected : styles.buttonInd}
        onClick={() => setTabState(2)}
        disableElevation
      >
        {tabName3}
      </Button>
    ) : null}
  </ButtonGroup>
);

export default Tab;
