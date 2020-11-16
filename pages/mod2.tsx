import { useState, ChangeEvent } from 'react';
import { GetStaticProps } from 'next';
import { OrgApp } from 'interfaces';
import Layout from 'components/Layout';
import SearchIcon from '@material-ui/icons/Search';
import {
  Tabs,
  Tab,
  AppBar,
  Button,
  Paper,
  Card,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import OrgCard from 'components/moderator/OrgCard';
import OrgDetail from 'components/moderator/OrgDetail';
import { sampleOrgAppData } from 'utils/sample-data';
import styles from 'styles/Mod2.module.css';

type Props = {
  items: OrgApp[];
};

// to highlight cards when selected, for future use?
// https://stackoverflow.com/questions/52305490/react-material-design-onclick-list-item-highlight-the-item-active

// drawer, missing functionality to push page content over
// https://medium.com/@albertchu539/how-to-make-an-app-drawer-with-react-hooks-and-css-1338ae57afb4

const ModeratorDashBoard: React.FunctionComponent<Props> = ({ items }) => {
  const [card, setCard] = useState<OrgApp>(items[0]);
  const clickCard = (newCard: OrgApp): void => {
    setCard(newCard);
  };

  const [selected, setSelected] = useState<number>(0);
  const handleChange = (
    _event: ChangeEvent<unknown>,
    newValue: number
  ): void => {
    setSelected(newValue);
  };

  return (
    <Layout title="Moderator Dashboard">
      <div className={styles.root}>
        <div className={styles.leftCol}>
          <div>
            <TextField
              fullWidth
              id="search"
              label="Search for an Organization"
              type="search"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </div>
          <AppBar position="static" color="default" className={styles.appBar}>
            <Tabs value={selected} onChange={handleChange}>
              <Tab label="Orgs" />
              <Tab label="Events" />
            </Tabs>
          </AppBar>
          {selected === 0 && (
            <div className={styles.content}>
              {items.map((item) => (
                // TODO: Add accessibility support
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
                <div key={item.id} onClick={() => clickCard(item)}>
                  <OrgCard items={item} />
                </div>
              ))}
            </div>
          )}
          {selected === 1 && 'Event list, mimic the Org mapping on first tab?'}
        </div>
        <div className={styles.rightCol}>
          <div className={styles.header}>
            <div>
              <div className={styles.large}>{card.name}</div>
              <div className={styles.med}>
                {card.workType} {card.orgType}
              </div>
            </div>
            <div>
              <Button variant="outlined" color="primary">
                Rejection history
              </Button>
              <Button variant="outlined" color="secondary">
                Notepad
              </Button>
            </div>
          </div>
          <div className={styles.content}>
            <OrgDetail items={card} />
          </div>
          <div className={styles.footer}>
            <Button variant="contained" color="secondary">
              Decline
            </Button>
            <Button variant="contained" color="primary">
              Accept
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const items: OrgApp[] = sampleOrgAppData;
  return { props: { items } };
};
// <h1 className={styles.stick}>Header</h1>
export default ModeratorDashBoard;
