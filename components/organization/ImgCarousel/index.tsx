import { Tab, Tabs, Typography, Box } from '@material-ui/core';
import { useState } from 'react';
import styles from './ImgCarousel.module.css';

interface TabPanelProps {
  children: React.ReactNode;
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
  const [imgIndex, setImgIndex] = useState(0);

  return (
    <div className={styles.root}>
      <div className={styles.tabPanel}>
        {images && images.length
          ? images.map((img, idx) => (
              <TabPanel value={imgIndex} index={idx}>
                <img className={styles.tabImg} src={img} alt={idx.toString()} />
              </TabPanel>
            ))
          : null}
      </div>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        selectionFollowsFocus={false}
        value={imgIndex}
        onChange={(e, newVal) => setImgIndex(newVal)}
        aria-label="Vertical tabs"
        className={styles.tabs}
        TabIndicatorProps={{
          style: {
            display: 'none',
          },
        }}
      >
        {images && images.length
          ? images.map((img, idx) => (
              <Tab
                className={styles.sideTab}
                icon={<img alt={idx.toString()} src={img} />}
                {...a11yProps(idx)}
              />
            ))
          : null}
      </Tabs>
    </div>
  );
};

export default ImgCarousel;
