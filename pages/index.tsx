import Layout from 'components/Layout';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  return (
    <Layout title="Home Page | Next.js + TypeScript Example">
      <Head>
        <title>NBJC Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Home</h1>
      <p>FRED IS THE IMPOSTER!!!!!</p>
    </Layout>
  );
};

export default Home;
