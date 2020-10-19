import { OrgApp } from 'interfaces';
import styles from 'styles/OrgDetail.module.css';

type DetailProps = {
  items: OrgApp;
};

const OrgDetail: React.FunctionComponent<DetailProps> = ({ items }) => {
  return (
    <div className={styles.root}>
      <h1 className={styles.tab}>Basic</h1>
      <div className={styles.row}>
        <div className={styles.response}>
          Organization Name <br />
          <div className={styles.infoBox}>{items.name}</div>
        </div>
        <div className={styles.response}>
          Type <br />
          <div className={styles.infoBox}>{items.orgType}</div>
        </div>
        <div className={styles.response}>
          Work Type <br />
          <div className={styles.infoBox}>{items.workType}</div>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.response}>
          Contact Name <br />
          <div className={styles.infoBox}>{items.contact}</div>
        </div>
        <div className={styles.response}>
          Contact Email <br />
          <div className={styles.infoBox}>{items.email}</div>
        </div>
        <div className={styles.response}>
          Website <br />
          <div className={styles.infoBox}>{items.website}</div>
        </div>
      </div>
    </div>
  );
};

export default OrgDetail;
