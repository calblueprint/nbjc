import dynamic from 'next/dynamic';
import Layout from 'components/Layout';
import { Button, CircularProgress } from '@material-ui/core';
// import { signIn, signOut, useSession } from 'next-auth/client';
// import styles from '../styles/Home.module.css';

const MapVisual = dynamic(() => import('../components/Map'), {
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
      <MapVisual />
    </Layout>
  );
};

export default Home;
