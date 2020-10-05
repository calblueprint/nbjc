import Layout from 'components/Layout';
import { Button, CircularProgress } from '@material-ui/core';
// import { signIn, signOut, useSession } from 'next-auth/client';
// import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  // const [session, loading] = useSession();
  return (
    //   <>
    //   {!session && <>
    //     Not signed in <br/>
    //     <button onClick={signIn}>Sign in</button>
    //   </>}
    //   {session && <>
    //     Signed in as {session.user.email} <br/>
    //     <button onClick={signOut}>Sign out</button>
    //   </>}
    // </>
    <Layout title="NBJC Home">
      <h1>Home</h1>
      <p>FRED IS THE IMPOSTER!!!!!</p>
      <Button variant="contained" color="primary">
        Hello
      </Button>
      <CircularProgress />
    </Layout>
  );
};

export default Home;
