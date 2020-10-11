import Link from 'next/link';
import { OrgApp } from 'interfaces';
import styles from 'styles/OrgCard.module.css';

// change Org instances to Organization or OrgApp?

type Props = {
  data: OrgApp;
};

const OrgCard: React.FunctionComponent<Props> = ({ data }) => (
  <div className={styles.main}>
    <p className={styles.logo}>{data.logo}</p>
    <Link href="/moderator/[id]" as={`/moderator/${data.id}`}>
      <a>
        <div className={styles.name}>{data.name}</div>
        {data.date}
      </a>
    </Link>
    <div className={styles.description}>{data.description}</div>
  </div>
);

export default OrgCard;
