// eslint-disable-next-line no-use-before-define
import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import styles from './ImgCarousel.module.css';

interface TabPanelProps {
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

type ImgProps = {
  images: Array<string>;
};

const ImgCarousel: React.FC<ImgProps> = ({ images }) => {
  const [value, setValue] = React.useState(0);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={styles.root}>
      <div className={styles.tabPanel}>
        <TabPanel value={value} index={0}>
          <img className={styles.tabImg} src={images[0]} alt="0" />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <img className={styles.tabImg} src={images[1]} alt="1" />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <img className={styles.tabImg} src={images[2]} alt="2" />
        </TabPanel>
      </div>
      <Tabs
        orientation="vertical"
        variant="standard"
        selectionFollowsFocus={false}
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs"
        className={styles.tabs}
        TabIndicatorProps={{
          style: {
            display: 'none',
          },
        }}
      >
        <Tab
          className={styles.sideTab}
          icon={<img alt="0" src={images[0]} />}
          {...a11yProps(0)}
        />
        <Tab
          className={styles.sideTab}
          icon={<img alt="1" src={images[1]} />}
          {...a11yProps(1)}
        />
        <Tab
          className={styles.sideTab}
          icon={<img alt="2" src={images[2]} />}
          {...a11yProps(2)}
        />
      </Tabs>
    </div>
  );
};

export default ImgCarousel;
