import Link from 'next/link';
// import Head from 'next/head';
import { Org } from 'interfaces';
// import styles from 'styles/OrgCard.module.css';

type Props = {
  data: Org;
};

// <OrgCard className={styles.OrgCard}> OrgCard</OrgCard>
const OrgCard: React.FunctionComponent<Props> = ({ data }) => (
  <>
    <p>{data.logo}</p>
    <Link href="/admin/[id]" as={`/admin/${data.id}`}>
      <a>
        {data.name}: {data.date}
      </a>
    </Link>
    <div>{data.description}</div>
  </>
);

export default OrgCard;
