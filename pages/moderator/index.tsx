/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { OrgApp } from 'interfaces';
import { GetStaticProps } from 'next';
import { sampleOrgAppData } from 'utils/sample-data';
import Layout from 'components/Layout';
import styles from 'styles/ModIndex.module.css';
import OrgCard from 'components/OrgCard';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
// import ModTabs from 'components/Moderator/ModTabs';
import OrgDetail from 'components/OrgDetail';

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
            <div key={item.id} onClick={() => clickCard(item)}>
              <OrgCard items={item} />
            </div>
          ))}
        </div>
        <div className={styles.rightCol}>
          <div>
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
