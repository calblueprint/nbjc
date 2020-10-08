import Link from 'next/link';
import { Org } from 'interfaces';
import styles from 'styles/OrgCard.module.css';

type Props = {
  data: Org;
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
