import Link from 'next/link';
import Layout from 'components/Layout';
import Toast from 'components/Toast';

const Test: React.FunctionComponent = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js</h1>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
    <Toast msg="test" variant="alert" />
  </Layout>
);

export default Test;
