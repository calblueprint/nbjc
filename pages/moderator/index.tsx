import { useState } from 'react';
import { GetStaticProps } from 'next';
import { OrgApp } from 'interfaces';
import Layout from 'components/Layout';
import OrgCard from 'components/moderator/OrgCard';
import OrgDetail from 'components/moderator/OrgDetail';
import { Button } from '@material-ui/core';

import { sampleOrgAppData } from 'utils/sample-data';

import styles from '../../styles/Moderator.module.css';

type Props = {
  items: OrgApp[];
};

const ModeratorDashBoard: React.FunctionComponent<Props> = ({ items }) => {
  const [card, setCard] = useState<OrgApp>(items[0]);

  const clickCard = (newCard: OrgApp): void => {
    setCard(newCard);
  };

  return (
    <Layout title="Moderator Dashboard">
      <h1>Moderator Dash</h1>
      <div className={styles.root}>
        <div className={styles.leftCol}>
          {items.map((item) => (
            // TODO: Add accessibility support
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
            <div key={item.id} onClick={() => clickCard(item)}>
              <OrgCard items={item} />
            </div>
          ))}
        </div>
        <div className={styles.rightCol}>
          <div className={styles.expandedApp}>
            <OrgDetail items={card} />
          </div>
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
