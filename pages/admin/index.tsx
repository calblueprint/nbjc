// copy from Users

import { GetStaticProps } from 'next';
import Link from 'next/link';

import { Org } from 'interfaces';
import { sampleOrgData } from 'utils/sample-data';
import Layout from 'components/Layout';
import List from 'components/OrgList';

type Props = {
  items: Org[];
};

// TODO: put the components on line 24, where items currently is

const WithStaticProps: React.FunctionComponent<Props> = ({ items }) => (
  <Layout title="Admin Dash | Next.js + TypeScript Example">
    <h1>Admin Dash</h1>
    <p>
      Example fetching data from in <code>getStaticProps()</code>.
    </p>
    <p>You are currently on: /admins</p>
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
  const items: Org[] = sampleOrgData;
  return { props: { items } };
};

export default WithStaticProps;
