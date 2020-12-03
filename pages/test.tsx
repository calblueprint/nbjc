import Link from 'next/link';
import Layout from 'components/Layout';
import Toast from 'components/Toast/index';

// you don't need to accept incoming changes here
// 'acceptedAlert','verifyEmailAlert', 'userExistsError'
const Test: React.FunctionComponent = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js</h1>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
    <Toast variant="userExistsError" />
  </Layout>
);

export default Test;
