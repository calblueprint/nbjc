import dynamic from 'next/dynamic';
import Layout from 'components/Layout';
import { Button, CircularProgress } from '@material-ui/core';
import styles from '../styles/Home.module.css';

const DynamicComponentWithNoSSR = dynamic(() => import('../components/Map'), {
  ssr: false,
});

const Home: React.FC = () => {
  return (
    <Layout title="NBJC Home">
      <h1>Home</h1>
      <p>FRED IS THE IMPOSTER!!!!!</p>
      <Button variant="contained" color="primary">
        Hello
      </Button>
      <CircularProgress />
      <DynamicComponentWithNoSSR />
    </Layout>
  );
};

export default Home;
