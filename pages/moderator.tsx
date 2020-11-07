import { useState, ChangeEvent } from 'react';
import { GetStaticProps } from 'next';
import { OrgApp } from 'interfaces';
import Layout from 'components/Layout';
import { Tabs, Tab, AppBar, Button, Paper } from '@material-ui/core';
import OrgCard from 'components/moderator/OrgCard';
import OrgDetail from 'components/moderator/OrgDetail';
import { sampleOrgAppData } from 'utils/sample-data';
import styles from '../styles/Moderator.module.css';

type Props = {
  items: OrgApp[];
};

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
      <h1>Moderator Dash</h1>
      <div className={styles.root}>
        <div className={styles.leftCol}>
          <AppBar position="static" color="default" className={styles.appBar}>
            <Tabs value={selected} onChange={handleChange}>
              <Tab label="Orgs" />
              <Tab label="Events" />
            </Tabs>
          </AppBar>
          {selected === 0 && (
            <div>
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
          <Paper>
            <OrgDetail items={card} />
          </Paper>
          <div className={styles.acceptDecline}>
            <Button variant="contained" color="primary">
              Accept
            </Button>
            <Button variant="contained" color="secondary">
              Decline
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

export default ModeratorDashBoard;
