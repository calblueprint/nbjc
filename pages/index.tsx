import dynamic from 'next/dynamic';
import { Button, CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Link from 'next/link';
// import { signIn, signOut, useSession } from 'next-auth/client';
// import styles from '../styles/Home.module.css';

const MapVisual = dynamic(() => import('../components/Map'), {
  ssr: false,
});

const Home: React.FC = () => {
  return (
    <Box>
      <h1>Home</h1>
      <p>FRED IS THE IMPOSTER!!!!!</p>
      <Button variant="contained" color="primary">
        Hello
      </Button>
      <CircularProgress />
      <MapVisual />
      <p>Click link below:</p>
      <Link href="adminDash/Dashboard">
        <a>Admin Review,</a>
      </Link>{' '}
      <Link href="adminDash/Applications">
        <a>Admin Index,</a>
      </Link>{' '}
      <Link href="adminDash/Organizations">
        <a>Org Index,</a>
      </Link>{' '}
      <Link href="adminDash/Users">
        <a>Users Index</a>
      </Link>
    </Box>
  );
};

export default Home;
