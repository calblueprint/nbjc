import { GetStaticProps } from 'next';
import Link from 'next/link';

import { OrgApp } from 'interfaces';
import { sampleOrgAppData } from 'utils/sample-data';
import Layout from 'components/Layout';
import List from 'components/OrgList';

type Props = {
  items: OrgApp[];
};

const ModeratorList: React.FunctionComponent<Props> = ({ items }) => (
  <Layout title="Moderator Dash | Next.js + TypeScript Example">
    <h1>Moderator Dash</h1>
    <List items={items} />
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const items: OrgApp[] = sampleOrgAppData;
  return { props: { items } };
};

export default ModeratorList;
