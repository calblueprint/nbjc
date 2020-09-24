import { GetStaticProps } from 'next';
import Link from 'next/link';

import { Organization } from 'interfaces';
import { sampleOrgData } from 'utils/sample-data';
import Layout from 'components/Layout';
import List from 'components/List';

type Props = {
  items: Organization[];
};

const WithStaticProps: React.FunctionComponent<Props> = ({ items }) => (
  <Layout title="Organization List | Next.js + TypeScript Example">
    <h1>Orgs List</h1>
    <p>
      RANDOM TEXT RANDOM TEXT RANDOM TEXT RANDOM TEXT RANDOM TEXT RANDOM TEXT
      RANDOM TEXT RANDOM TEXT
    </p>
    <p>You are currently on: /orgs</p>
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
  const items: Organization[] = sampleOrgData;
  return { props: { items } };
};

export default WithStaticProps;
