/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { OrgApp } from 'interfaces';
import { GetStaticProps } from 'next';
import { sampleOrgAppData } from 'utils/sample-data';
import Layout from 'components/Layout';
import styles from 'styles/index.module.css';
import OrgCard from 'components/OrgCard';
import OrgDetail from 'components/OrgDetail';
import { useState } from 'react';

type Props = {
  items: OrgApp[];
};

const ModList: React.FunctionComponent<Props> = ({ items }) => {
  const [card, setCard] = useState<OrgApp>(items[0]);

  const clickCard = (newCard: OrgApp): void => {
    setCard(newCard);
  };

  return (
    <Layout title="Moderator Dash">
      <h1>Moderator Dash</h1>
      <div className={styles.root}>
        <div className={styles.leftCol}>
          {items.map((a) => (
            <div key={a.id} onClick={() => clickCard(a)}>
              <OrgCard items={a} />
            </div>
          ))}
        </div>
        <div className={styles.rightCol}>
          <div className={styles.expandedApp}>
            {' '}
            <OrgDetail items={card} />{' '}
          </div>
          <div className={styles.acceptDecline}>
            <button type="button" className={styles.accept}>
              {' '}
              Accept
            </button>
            <button type="button" className={styles.decline}>
              {' '}
              Decline
            </button>
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

export default ModList;
