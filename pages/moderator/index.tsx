import { GetStaticProps } from 'next';
import Link from 'next/link';

import { Org } from 'interfaces';
import { sampleOrgAppData } from 'utils/sample-data';
import Layout from 'components/Layout';
import List from 'components/OrgList';

type Props = {
  items: Org[];
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
  // Example for including static props in a Next.js function component page.
  // Don't forget to include the respective types for any props passed into
  // the component.
  const items: Org[] = sampleOrgAppData;
  return { props: { items } };
};

export default ModeratorList;
