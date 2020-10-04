import { GetStaticProps, GetStaticPaths } from 'next';

import { Org } from 'interfaces';
import { sampleOrgData } from 'utils/sample-data';
import Layout from 'components/Layout';
import OrgDetail from 'components/ListDetail';

type Props = {
  item?: Org;
  errors?: string;
};

const StaticPropsDetail: React.FunctionComponent<Props> = ({
  item,
  errors,
}) => {
  if (errors) {
    return (
      <Layout title="Error | Next.js + TypeScript Example">
        <p>
          <span style={{ color: 'red' }}>Error:</span> {errors}
        </p>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${
        item ? item.name : 'Admin Detail'
      } | Next.js + TypeScript Example`}
    >
      {item && <OrgDetail item={item} />}
    </Layout>
  );
};

export default StaticPropsDetail;

export const getStaticPaths: GetStaticPaths = async () => {
  // Get the paths we want to pre-render based on admins
  const paths = sampleOrgData.map((admin) => ({
    params: { id: admin.id.toString() },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const id = params?.id;
    const item = sampleOrgData.find((data) => data.id === Number(id));
    // By returning { props: item }, the StaticPropsDetail component
    // will receive `item` as a prop at build time
    return { props: { item } };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};
