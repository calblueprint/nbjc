import Link from 'next/link';
import Layout from 'components/Layout';

const AboutPage: React.FunctionComponent = () => (
  <Layout title="About | Next.js + TypeScript Example">
    <h1>Terms of Use</h1>
    <p>This is the terms of use page</p>
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

export default AboutPage;
